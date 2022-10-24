//type for song for search Result
export interface AudioSearchResponse{
    url:string
    title:string
    duration:string|number
    thumbnail:string
    author:string
    source :string
    //formats might be changed
    formats:Array<{
        type:string,
        mimeType:string,
        url:string,
        quality:string|null
    }>|null
}
export interface AudioInfoResponse{
    url:string
    title:string
    length:string|number
    thumbnail:string
    author:string
    formats:Array<any>
    needProxy:boolean
    source :string
}