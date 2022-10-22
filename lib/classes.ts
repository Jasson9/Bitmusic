class AudioSearchResponse{
    videoId:string
    title:string
    length:string
    thumbnail:string
    author:string
    source :string
    constructor(videoId:string,title:string,length:string,thumbnail:string,author:string,source:string){
        this.videoId = videoId
        this.title = title
        this.length = length
        this.thumbnail = thumbnail
        this.author = author
        this.source = source
    }
}


export {AudioSearchResponse}