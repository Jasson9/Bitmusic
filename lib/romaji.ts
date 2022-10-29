// @ts-ignore
import Kuroshiro from "kuroshiro";
// @ts-ignore
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";
import path from 'path'
const kuroshiro = new Kuroshiro();

export async function romanize(text:string){
    if(process.env.KUROSHIRO != "true"){
        console.log("initializing kuroshiro");
        await kuroshiro.init(new KuromojiAnalyzer(process.env.PRODUCTION?{dictPath:path.join(process.cwd(),"files","dict")}:""))
        process.env.KUROSHIRO = "true";
    }
    var res = await kuroshiro.convert(text, { to: "romaji", mode: "spaced" });
    return res;
}