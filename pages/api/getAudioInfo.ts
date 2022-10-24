
import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import { fetchAudioInfoYtdl} from "../../lib/yt";
import {getAudioPageInfo} from '../../lib/soundcloud';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    //var id = new String(req.cookie('id'))?.toString();
    console.log(req.body)
    var body = JSON.parse(req.body)
    // capture index 4
    var sourceSite = /(http(s|):\/\/www\.|www\.|http(s|):\/\/|)(.+)\..+(\/|)?/.exec(body.url)?.[4];
    if(sourceSite == null){
        res.status(500);
    }
    switch(sourceSite){
        case "youtube":
            var data:any = await fetchAudioInfoYtdl(body.url);
        break;
        case "soundcloud":
            var data:any = await getAudioPageInfo(body.url);
        break;
        default:
        console.log("url: "+req.body.url," source: "+sourceSite);
        res.status(500);
        return;
    }
    // might be changed
    if(data!=null){
        res.status(200).json({data})
    }else{
        res.status(500);
    }
}