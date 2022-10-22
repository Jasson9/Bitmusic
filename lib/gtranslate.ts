
export async function translateAutoEn(input:string){
    var t = JSON.stringify(input);
    //console.log(t);
     t = t.replaceAll("\\n","\\\\n");
     t = t.replaceAll("\\r","");
     t = t.replaceAll('"',"");
    console.log(t);

    var body = await  fetch("https://translate.google.co.id/_/TranslateWebserverUi/data/batchexecute?rpcids=MkEWBc&source-path=%2F&bl=boq_translate-webserver_20221018.05_p0&hl=id&soc-app=1&soc-platform=1&soc-device=1&rt=c", {
    "headers": {
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "no-cache",
        "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
        "pragma": "no-cache",
        "preferanonymous": "1",
        "sec-ch-ua": "\"Chromium\";v=\"106\", \"Not;A=Brand\";v=\"99\", \"Google Chrome\";v=\"106.0.5249.119\"",
        "sec-ch-ua-arch": "\"x86\"",
        "sec-ch-ua-bitness": "\"64\"",
        "sec-ch-ua-full-version": "\"106.0.1370.47\"",
        "sec-ch-ua-full-version-list": "\"Chromium\";v=\"106.0.5249.119\", \"Microsoft Edge\";v=\"106.0.1370.47\", \"Not;A=Brand\";v=\"99.0.0.0\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-model": "",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-ch-ua-platform-version": "\"15.0.0\"",
        "sec-ch-ua-wow64": "?0",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-same-domain": "1",
        "Referer": "https://translate.google.co.id/",
        "Referrer-Policy": "origin"
    },
    "body": `f.req=%5B%5B%5B%22MkEWBc%22%2C%22%5B%5B%5C%22${encodeURIComponent(t)}%5C%22%2C%5C%22auto%5C%22%2C%5C%22en%5C%22%2Ctrue%5D%2C%5Bnull%5D%5D%22%2Cnull%2C%22generic%22%5D%5D%5D&at=ADiessZaUoHAVezsyXuGG5Wd-5h7%3A1666282530391&`,
    "method": "POST"
    });
    var res = await body.text();
    var text:any = /null,\[\[\\"((.|\n)*)\\\"\]\]\]\]/.exec(res)?.[1].split("\\\\"+'n')
    var formattedtext = text?.join("\r\n");
    formattedtext = formattedtext.replaceAll('\\\\\\"','"');
    return formattedtext;
}