import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import { SearchKeyword , searchMusicKeyword} from "../../lib/SearchYoutubeAPI";
import {getLyricsFromYTMusicId} from '../../lib/lyrics';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    //var id = new String(req.cookie('id'))?.toString();
    var body = JSON.parse(req.body);
    console.log(body.query)
    var data:any = await searchMusicKeyword(body.query);
    if(data!=null){
        res.status(200).json({data})
    }else{
        res.status(500);
    }
}