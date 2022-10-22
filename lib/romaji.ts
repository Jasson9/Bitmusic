// @ts-ignore
import Kuroshiro from "kuroshiro";
// @ts-ignore
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";
import path from 'path'
const kuroshiro = new Kuroshiro();
var initialized = false;


export async function romanize(text:string){
    if(!initialized){
        await kuroshiro.init(new KuromojiAnalyzer(process.env.PRODUCTION?{dictPath:path.join(process.cwd(),"files","dict")}:""))
        initialized = true;
    }
    console.log(initialized)
    var res = await kuroshiro.convert(text, { to: "romaji", mode: "spaced" });
    return res;
}