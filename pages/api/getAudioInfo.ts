
import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import { fetchAudioInfo,YtVideoResponse } from "../../lib/yt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    //var id = new String(req.cookie('id'))?.toString();
    console.log("triggered")
    var data:any = await fetchAudioInfo(JSON.parse(req.body).url);
    console.log(data)
    if(data!=null){
        res.status(200).json({data})
    }else{
        res.status(500);
    }
}