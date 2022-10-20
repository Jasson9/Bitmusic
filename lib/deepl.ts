import fetch from 'node-fetch';
export async function translateAutoEn(text:string):Promise<any>{
    var textline = text.split("\r\n");
    var payload:any = [];
    for(var i = 0 ; i < textline.length ; i ++){
        payload.push({
            "kind": "default",
            "sentences": [
                {
                    "text": textline[0],
                    "id": i,
                    "prefix": ""
                }
            ],
            "raw_en_context_before": [textline[i-1]],
            "raw_en_context_after": [
                textline[i+1]
            ],
            "preferred_num_beams": 1
        }) 
    }

    var body:any = await fetch("https://www2.deepl.com/jsonrpc?method=LMT_handle_jobs", {
        "headers": {
          "accept": "*/*",
          "accept-language": "en-US,en;q=0.9,id;q=0.8",
          "cache-control": "no-cache",
          "content-type": "application/json",
          "pragma": "no-cache",
          "sec-ch-ua": "\"Chromium\";v=\"106\", \"Microsoft Edge\";v=\"106\", \"Not;A=Brand\";v=\"99\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Windows\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          "cookie": "dapUid=f8e14b80-3392-4ab9-9037-b88d563595f5; privacySettings=%7B%22v%22%3A%221%22%2C%22t%22%3A1666224000%2C%22m%22%3A%22LAX_AUTO%22%2C%22consent%22%3A%5B%22NECESSARY%22%2C%22PERFORMANCE%22%2C%22COMFORT%22%5D%7D; LMTBID=v2|ebde3b08-c35b-49b3-8bf0-45cbb7528d3d|6081ca2f00eccbe4f83fe3b8a461f448; dapVn=2; dapSid=%7B%22sid%22%3A%229b7be667-5870-4b8f-9ad4-67d6f100b276%22%2C%22lastUpdate%22%3A1666278368%7D",
          "Referer": "https://www.deepl.com/",
          "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": JSON.stringify({
            "jsonrpc": "2.0",
            "method": "LMT_handle_jobs",
            "params": {
                "jobs":payload,
                "lang": {
                    "preference": {
                        "weight": {},
                        "default": "default"
                    },
                    "source_lang_computed": "JA",
                    "target_lang": "EN"
                },
                "priority": 1,
                "commonJobParams": {
                    "regionalVariant": "en-US",
                    "mode": "translate",
                    "browserType": 1
                },
                "timestamp": Date.now()
            },
            "id": 1223
        }),
        "method": "POST"
      }).catch(err=>{
        return null
    });
    var res = (await body.json())//.result.translations;
    console.log(res)
    var restext = new Array();
    res.forEach((text:any)=>{
        var sentences = new Array();
        if(text.chunks.length>0){
            text.beams[0].sentences.forEach((sentence:any)=>{
                sentences.push(sentence.text);
            })
            restext.push(sentences.join(". "));
        }
    })
    console.log(res[0].beams[0].sentences[0]);
    if(restext.join("") == text){
        return null
    }else{
        return restext.join("\r\n");
    }
}