class YtVideoResponse{
    videoId:string
    title:string
    length:string
    thumbnail:string
    author:string
    formats:Array<any>
    needProxy:boolean
    constructor(videoId:string,title:string,length:string,thumbnail:string,author:string,formats:Array<any>,needProxy:boolean){
        this.videoId = videoId
        this.title = title
        this.length = length
        this.thumbnail = thumbnail
        this.author = author
        this.formats = formats
        this.needProxy = needProxy
    }
}

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
    
}


export { YtVideoResponse};
