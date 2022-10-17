import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import { YtdownloadFromItag } from "../../lib/download";
import { promisify } from "util";
import internal, { Stream } from "stream";
const pipeline = promisify(Stream.pipeline);
export const config = {
    api: {
        responseLimit: "16mb",
        bodyParser: {
            sizeLimit: '16mb'
        }
    }
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    //var id = new String(req.cookie('id'))?.toString();
    var body = JSON.parse(req.body);
    if(!body.itag||!body.url){
        res.status(400);
        return;
    }
    var data:internal.Readable = await YtdownloadFromItag(body.url,body.itag);
    res.setHeader('Content-Type', 'audio/webm');
    res.setHeader('Content-Disposition', `attachment; filename=result.mp3`);
    await pipeline(data,res);
    console.log("done");
    if(data!=null){
        res.status(200);
    }else{
        res.status(500);
    }
}