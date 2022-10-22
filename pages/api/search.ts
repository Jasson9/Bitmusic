import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import { SearchKeyword , searchMusicKeyword} from "../../lib/SearchYoutubeAPI";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    //var id = new String(req.cookie('id'))?.toString();
    var body = JSON.parse(req.body);
    console.log(body.query)
    var ytmusic:any = await searchMusicKeyword(body.query);
    var yt:any = await SearchKeyword(body.query);
    if(ytmusic!=null||yt!=null){
        var results = []
        for(var i = 0; i < 20; i++){
            ytmusic?.[i]?results.push(ytmusic[i]):null;
            yt?.[i]?results.push(yt[i]):null;
        }
        res.status(200).json({data:results,source:[yt?.[0]?.source,ytmusic?.[0]?.source]});
    }else{
        res.status(500);
    }
}