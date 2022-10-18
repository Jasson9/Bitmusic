
import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import { fetchAudioInfo,YtVideoResponse ,fetchAudioInfoYtdl} from "../../lib/yt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    //var id = new String(req.cookie('id'))?.toString();
    console.log(req.body)
    var data:any = await fetchAudioInfoYtdl(JSON.parse(req.body).url);
    if(data!=null){
        res.status(200).json({data})
    }else{
        res.status(500);
    }
}