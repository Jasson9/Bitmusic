
export async function getAudioInfo(url){
    var r = await fetch("/api/getAudioInfo",{method:"POST",body:JSON.stringify({"url":url})})
    var res = (await r.json()).data;
    return res;
}

export async function downloadFromChunks(urls){
    var blobs = await Promise.all(urls.map(async url => {
            let res = await fetch(url,{
                method:"GET"
            })
            .catch(err=>{
                console.log(err);
            });
            var blob = await res.blob();
            return blob;
    }))
    return URL.createObjectURL(new Blob(blobs));
}

export async function downloadSong(res,event) {
    event.preventDefault();
    event.stopPropagation();
    document.getElementById("DownloadIcon-" + url)?.setAttribute("hidden", "");
    document.getElementById("DownloadProgressIcon-" + url)?.removeAttribute("hidden");
    if (url) {
        var res = await getAudioInfo(url);
        var audiourl = null;
        if (!res) {
            throw "Request ajax request failed\n" + res;
        }
        if (res.needProxy) {
            audiourl = await fetchAudio(res.videoId, res.formats[res.formats.length - 1].itag);
        } else {
            res.formats.forEach(format => {
                if (/audio\/mp4/.test(format.mimeType)) {
                    audiourl = format.url;
                }
            })
        }
        if (audiourl) {
            document.getElementById("DownloadProgressIcon-" + url)?.setAttribute("hidden", "");
            document.getElementById("DownloadDoneIcon-" + url)?.removeAttribute("hidden");
            document.getElementById("DownloadDoneIcon-" + url)?.setAttribute("download", res.title + ".mp3");
            document.getElementById("DownloadDoneIcon-" + url)?.setAttribute("href", audiourl);
            document.getElementById("DownloadDoneIcon-" + url)?.click();
        }
        return {
            url: audiourl
        };

    }
}

export async function fetchAudio(url,itag){
    var fetchaudio = await fetch("/api/downloadFromItag",{
        method:"POST",
        headers:{
            'Cache-Control':'no-cache'
        },
        body:JSON.stringify({"url":url,"itag":itag})
    }).catch(err=>{
        console.error(err);
        throw err;
    })
    var blob = await fetchaudio.blob();
    var audiourl = URL.createObjectURL(blob);
    return audiourl;
}