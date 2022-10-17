import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import { SearchKeyword } from "../../lib/SearchYoutubeAPI";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    //var id = new String(req.cookie('id'))?.toString();
    var data:any = await SearchKeyword(req.body.query);
    if(data!=null){
        res.status(200).json({data})
    }else{
        res.status(500);
    }
}