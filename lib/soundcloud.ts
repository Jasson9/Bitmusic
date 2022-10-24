import fetch from 'node-fetch';
import {load} from 'cheerio';
import { AudioSearchResponse, AudioInfoResponse } from './interfaces';
var clientregex = new RegExp(/client_id:"(.+?)"/);

export async function setClientId(){
    var body = await fetch("https://a-v2.sndcdn.com/assets/0-a73cab88.js", {
    "headers": {
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "no-cache",
        "pragma": "no-cache",
        "sec-ch-ua": "\"Chromium\";v=\"106\", \"Microsoft Edge\";v=\"106\", \"Not;A=Brand\";v=\"99\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\""
    },
    "body": null,
    "method": "GET"
    });

    var res = await body.text();
    var idres = clientregex.exec(res)?.[1];
    if(idres){
        process.env.SCCLIENTID = new String(idres).valueOf();
        return idres;
    } 
};

export async function searchSong(keyword:string){
    if(!process.env.SCCLIENTID){
        console.log("fetching ClientId");
        await setClientId();
    }
    var body = await fetch(`https://api-v2.soundcloud.com/search/tracks?q=${encodeURIComponent(keyword)}&facet=genre&client_id=${process.env.SCCLIENTID}&limit=20&offset=0&linked_partitioning=1&app_version=1666362116&app_locale=en`, {
    "headers": {
        "accept": "application/json, text/javascript, */*; q=0.01",
        "accept-language": "en-US,en;q=0.9,id;q=0.8",
        "cache-control": "no-cache",
        "pragma": "no-cache",
        "sec-ch-ua": "\"Chromium\";v=\"106\", \"Microsoft Edge\";v=\"106\", \"Not;A=Brand\";v=\"99\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "Referer": "https://soundcloud.com/",
        "Referrer-Policy": "origin"
    },
    "body": null,
    "method": "GET"
    });
    var songs:Array<AudioSearchResponse> = [];
    var data:any = await body.json();
    data?.["collection"].forEach((song:any)=>{
        var formats:any = new Array();
        console.log(song.media);
        song.media.transcodings.forEach((media:any) => {
            formats.push({
                mimeType:media.format.mime_type,
                type:media.format.protocol,
                url:`${media.url}?client_id==${process.env.SCCLIENTID}&track_authorization=${song.track_authorization}`
            })
        })
        songs.push({
            url:song.permalink_url,
            author:song.user.permalink,
            duration:Math.round(song.full_duration/1000),
            title:song.title,
            thumbnail:song.artwork_url||song.user.avatar_url,
            formats:formats,
            source:"soundcloud"
        });
    });
    console.log(songs);
    //console.log(data);
    return songs;
}


//https://m.soundcloud.com/dhproduction-indonesia/hingga-tua-bersama
export async function getAudioPageInfo(url:string):Promise<AudioInfoResponse>{
    var body = await fetch(url, {
    "headers": {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-language": "en-US,en;q=0.9,id;q=0.8",
        "cache-control": "no-cache",
        "pragma": "no-cache",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
        "Referer": "https://www.google.com/",
        "Referrer-Policy": "origin"
    },
    "body": null,
    "method": "GET"
    });
    var res:string = await body.text();
    var data:any = JSON.parse(new String(/<script>window.__sc_hydration = (.+);<\/script>?/.exec(res)?.[1]).valueOf());
    console.log(data[data.length-1].data.media.transcodings);
    if(!process.env.SCCLIENTID){
        console.log("fetching ClientId");
        await setClientId();
    }
    var audiourl = await getAudioUrl(data[data.length-1].data.media.transcodings[0].url+`?client_id=${process.env.SCCLIENTID}&track_authorization=${data[data.length-1].data.track_authorization}`);
    if(audiourl == null){
        console.log(data[data.length-1]);
        throw "no audio url found";
    }
    var chunks = await getAudioChunksInfo(audiourl);
    return ({
        source:"soundcloud",
        needProxy:false,
        formats:[{urls:chunks,type:"hls"}],
        url:url,
        title:data[data.length-1].data.title,
        author: data[data.length-1].data.user.permalink,
        thumbnail:data[data.length-1].data.artwork_url||data[data.length-1].data.user.avatar_url,
        length:Math.round(data[data.length-1].data.full_duration/1000)
    });
}

//probably not needed
//baseurl: https://api-mobi.soundcloud.com/media/soundcloud:tracks:1051250587/656bcfaa-3824-4690-841d-ca9c4325b76a/stream/hls
//param1: client_id=iZIs9mchVcX5lhVRyQGGAYlNPVldzAoX
//param2: track_authorization=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJnZW8iOiJJRCIsInN1YiI6IiIsInJpZCI6IjM1NTFiY2NhLWExZjMtNDg4Yi1hZTE2LWZjYWNkMWY2MGQzZCIsImlhdCI6MTY2NjM4MDk2Mn0.a_2QBKzVe8zskorKxGDbfwaRO1BcntPRy76gCqFzFNA
export async function getAudioUrl(url:string){
    var body = await fetch(url, {
    "headers": {
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.9,id;q=0.8",
        "cache-control": "no-cache",
        "pragma": "no-cache",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "Referer": "https://m.soundcloud.com/",
        "Referrer-Policy": "origin"
    },
    "body": null,
    "method": "GET"
    }).catch(err=>{
        return err;
    })

    var res = await body.json().catch((err:any)=>{
        console.log(err);
        return null
    });
    console.log(res)
    if(res["url"]){
        return res["url"];
    }
    return null;
}


export async function getAudioChunksInfo(url:string){
    //console.log(url)
    var body = await fetch(url, {
    "headers": {
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.9,id;q=0.8",
        "cache-control": "no-cache",
        "pragma": "no-cache",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        "Referer": "https://m.soundcloud.com/",
        "Referrer-Policy": "origin"
    },
    "body": null,
    "method": "GET"
    });
    var res = await body.text();
    console.log(res);
    var regex = new RegExp(/(https:\/\/.+)\n?/,"gm");
    var matches, urls = [];
    while (matches = regex.exec(res)) {
        urls.push(matches[1]);
    }
    //console.log(urls)
    return {
        urls
    }
}