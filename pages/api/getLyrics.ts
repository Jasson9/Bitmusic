import { getLyricsFromYTMusicId } from '../../lib/lyrics';
import { NextApiResponse, NextApiRequest } from "next";
import {translateAutoEn} from '../../lib/gtranslate'
// @ts-ignore
import Kuroshiro from "kuroshiro";
// @ts-ignore
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";
import path from 'path'
const kuroshiro = new Kuroshiro();
var initialized = false;
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    return new Promise((resolve, reject) => {
        var data = new Array();
        var body = JSON.parse(req.body);
        getLyricsFromYTMusicId(body.id).then(result => {
            data.push({
                lang: "original",
                text: result
            })
            translateAutoEn(result).then(res=>{
                console.log(res);
                data.push({
                    lang:'English',
                    text: res
                });
            }) 

            if (Kuroshiro.Util.hasJapanese(result)) {
                try {
                    //console.log(path.join(process.cwd(),"files","dict"));
                    if(initialized){
                        console.log("initialized");
                        kuroshiro.convert(result, { to: "romaji", mode: "spaced" }).then(function (romaji: any) {
                            console.log(romaji);
                            data.push({ lang: "romaji", text: romaji });
                            if (data != null) {
                                resolve(res.status(200).json({ data }))
                            } else {
                                resolve(res.status(500));
                            }
                            //console.log(result);
                        })
                    }else{
                        console.log("not initialized");
                        kuroshiro.init(new KuromojiAnalyzer(process.env.PRODUCTION?{dictPath:path.join(process.cwd(),"files","dict")}:""))
                        .then(function () {
                            initialized = true;
                            return kuroshiro.convert(result, { to: "romaji", mode: "spaced" });
                        })
                        .then(function (romaji: any) {
                            //console.log(romaji);
                            data.push({ lang: "romaji", text: romaji });
                            if (data != null) {
                                resolve(res.status(200).json({ data }))
                            } else {
                                resolve(res.status(500));
                            }
                            //console.log(result);
                        })
                        
                    }

                    //wanakana.toRomaji(result,{useObsoleteKana:true,IMEMode:true});

                    //console.log(romaji);
                } catch (err) {
                    console.log(err);
                }
            } else {
                if (data != null) {
                    resolve(res.status(200).json({ data }))
                } else {
                    resolve(res.status(500));
                }
            }
        }).catch(err=>{
            resolve(res.status(200).json({ data:[] }))
            reject(err);
        })
    })
}