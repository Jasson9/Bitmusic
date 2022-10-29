import ytdl from 'ytdl-core'
import {AudioInfoResponse} from './interfaces'

export async function fetchAudioInfoYtdl(url:string):Promise<AudioInfoResponse>{
    var info:ytdl.videoInfo = await ytdl.getInfo(url); 
    let audioFormats = ytdl.filterFormats(info.formats,'audioonly');
    var needProxy = false;
    for(var i = 0; i < audioFormats.length ; i++){
        if(/gcr=/.test(audioFormats[i].url)){
            needProxy = true;
            break;
        }
    }
    return  ({
        url:"https://www.youtube.com/watch?v="+info.videoDetails.videoId,
        title:info.videoDetails.title,
        length:info.videoDetails.lengthSeconds,
        thumbnail:info.videoDetails.thumbnails[info.videoDetails.lengthSeconds,info.videoDetails.thumbnails.length-1].url,
        author:info.videoDetails.author.name,
        formats:audioFormats,
        source:"youtube",
        needProxy
    })
}

//signedchipher issue
/**
export async function fetchAudioInfo(url:string):Promise<YtVideoResponse>{
    var InitialDataRegex = new RegExp(/ytInitialPlayerResponse = ({.+});</);
    var res = await fetch(url,{
        method:"GET",
        mode:"cors",
        redirect:"manual",
        headers:{
            'Redirect':"www.google.com",
            'Origin':"www.google.com",
            'Access-Control-Allow-Origin':'*',
            'accept':'application/json',
            'Access-Control-Allow-Methods':'POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization'    
        }
    })

    var body:string = await res.text();
    try {
        var regexres:any = InitialDataRegex.exec(body)
        var data:any = JSON.parse(regexres[1]);
    } catch (error) {
        console.log(error);
        throw error
    }
    var formats:any = [];
    //console.log(data.videoDetails);
    data.streamingData.formats.forEach((res:any)=>{
        if(res?.type == "FORMAT_STREAM_TYPE_OTF"){
            return res.itag+" not downloadable"
        }else{
            formats.push(res);
        }
    })

    data.streamingData.adaptiveFormats.forEach((res:any)=>{
        if(res?.type == "FORMAT_STREAM_TYPE_OTF"){
            //FORMAT_STREAM_TYPE_OTF on type means undownloadable / sequential type 
            //Solution ???
            return res.itag+" not downloadable"
        }else{
            formats.push(res);
        }
    })
    var needProxy = false;
    for(var i = 0; i < formats.length ; i++){
        if(/gcr=/.test(formats[i].url)){
            needProxy = true;
            break;
        }
    }
    console.log(formats);
    return new YtVideoResponse(
        data.videoDetails.videoId,
        data.videoDetails.title,
        data.videoDetails.lengthSeconds,
        data.videoDetails.thumbnail?.thumbnails[data.videoDetails.thumbnail.thumbnails.length-1].url,
        data.videoDetails.author,
        formats,
        needProxy
    )
    
} */
