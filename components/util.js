
export async function getAudioInfo(url){
    var r = await fetch("/api/getAudioInfo",{method:"POST",body:JSON.stringify({"url":url})})
    var res = (await r.json()).data;
    return res;
}


export async function fetchAudio(id,itag){
    var fetchaudio = await fetch("/api/downloadFromItag",{
        method:"POST",
        headers:{
            'Cache-Control':'no-cache'
        },
        body:JSON.stringify({"url":"https://www.youtube.com/watch?v="+id,"itag":itag})
    }).catch(err=>{
        console.error(err);
        throw err;
    })
    var blob = await fetchaudio.blob();
    var audiourl = URL.createObjectURL(blob);
    return audiourl;
}