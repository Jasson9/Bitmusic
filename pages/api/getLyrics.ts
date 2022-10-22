import { getLyricsFromYTMusicId } from '../../lib/lyrics';
import { NextApiResponse, NextApiRequest } from "next";
import {translateAutoEn} from '../../lib/gtranslate'
import {romanize} from '../../lib/romaji'
//@ts-ignore
import Kuroshiro from "kuroshiro";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    var data = new Array();
    var body = JSON.parse(req.body);
    var original = await getLyricsFromYTMusicId(body.id).catch(err=>{
        res.status(200).json({ data:[] });
        console.log(err);
        return;
    });
    //console.log(original)
    if(!original){
        res.status(200).json({ data:[] });
        return;
    } 
    data.push({lang:"original",text:original})
    var translate = await translateAutoEn(original);
    if(translate!="undefined")data.push({lang:'English',text: translate+"\r\n\r\ntranslated with google translate"});
    if(Kuroshiro.Util.hasJapanese(original)){
        var romaji = await romanize(original);
        if(romaji)data.push({lang:'romaji',text:romaji});
    }
    res.status(200).json({data})
}