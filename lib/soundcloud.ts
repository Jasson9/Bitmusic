import fetch from 'node-fetch';
import {load} from 'cheerio';
import { AudioSearchResponse } from './classes';

export async function searchSong(keyword:string){
    var body = await fetch(`https://api-v2.soundcloud.com/search/tracks?q=${encodeURIComponent(keyword)}&facet=genre&client_id=1TLciEOiKE0PThutYu5Xj0kc8R4twD9p&limit=20&offset=0&linked_partitioning=1&app_version=1666362116&app_locale=en`, {
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
    var data = await body.json();
}


//https://m.soundcloud.com/dhproduction-indonesia/hingga-tua-bersama
export async function getAudioPageInfo(author:string,title:string){
    var body = await fetch(`https://m.soundcloud.com/${author}/${title}`, {
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
    var res = await body.text();
    var $ = load(res);
    var data:any = JSON.parse($("#__NEXT_DATA__").text());
    console.log(data);
}

//probably not needed
//baseurl: https://api-mobi.soundcloud.com/media/soundcloud:tracks:1051250587/656bcfaa-3824-4690-841d-ca9c4325b76a/stream/hls
//param1: client_id=iZIs9mchVcX5lhVRyQGGAYlNPVldzAoX
//param2: track_authorization=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJnZW8iOiJJRCIsInN1YiI6IiIsInJpZCI6IjM1NTFiY2NhLWExZjMtNDg4Yi1hZTE2LWZjYWNkMWY2MGQzZCIsImlhdCI6MTY2NjM4MDk2Mn0.a_2QBKzVe8zskorKxGDbfwaRO1BcntPRy76gCqFzFNA
export async function getAudioUrl(baseurl:string,clientid:string,trackauth:string){
    var body = await fetch(`${baseurl}?client_id=${clientid}&track_authorization=${trackauth}`, {
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
        return null
    });
    console.log(res)
    if(res["url"]){
        return res["url"];
    }
    return null;
}


export async function getAudioChunksInfo(url:string){
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
    var urls = /(https:\/\/.+)+/.exec(res);
    var length = urls?.length;
    console.log(urls);
    console.log(length);
    return {
        length,urls
    }
}