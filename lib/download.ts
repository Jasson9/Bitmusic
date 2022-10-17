import internal from 'stream';
import ytdl from 'ytdl-core'
async function downloadMediaFrom(url:string,options:RequestInit){
    var res = await fetch(url,options)
    var buffer = await res.arrayBuffer();
    return buffer;
}

async function YtdownloadFromItag(url:string,itag:any):Promise<internal.Readable>{
    var res = await ytdl(url,{filter:format=>format.itag==itag})
    return res
}

export {downloadMediaFrom,YtdownloadFromItag}