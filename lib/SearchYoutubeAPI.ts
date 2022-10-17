import {parseYTTimeFromString} from './timeparser'
import fetch from 'node-fetch'

async function SearchKeyword(keyword:string):Promise<Array<any>> {
    console.log(keyword)
    var res:Response = await fetch("https://www.youtube.com/youtubei/v1/search?key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8&prettyPrint=false",{
            method: "POST",
            body: `{"context":{"client":{"hl":"en","gl":"GB","remoteHost":"","deviceMake":"","deviceModel":"","visitorData":"","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36,gzip(gfe)","clientName":"WEB","clientVersion":"2.20220921.08.00","osName":"Windows","osVersion":"10.0","originalUrl":"https://www.youtube.com/results","platform":"DESKTOP","clientFormFactor":"UNKNOWN_FORM_FACTOR","configInfo":{"appInstallData":""},"userInterfaceTheme":"USER_INTERFACE_THEME_DARK","timeZone":"","browserName":"Chrome","browserVersion":"105.0.0.0","screenWidthPoints":950,"screenHeightPoints":932,"screenPixelDensity":1,"screenDensityFloat":1,"utcOffsetMinutes":420,"memoryTotalKbytes":"4000","mainAppWebInfo":{"graftUrl":"/results","pwaInstallabilityStatus":"PWA_INSTALLABILITY_STATUS_CAN_BE_INSTALLED","webDisplayMode":"WEB_DISPLAY_MODE_BROWSER","isWebNativeShareAvailable":true}},"user":{"lockedSafetyMode":false},"request":{"useSsl":true,"internalExperimentFlags":[],"consistencyTokenJars":[]},"clickTracking":{"clickTrackingParams":""}},"query":"${keyword}","category":"music","params": "EgIQAQ%3D%3D"}`,
            headers: {
                "accept": "*/*",
                "accept-language": "en-US",
                "content-type": "application/json",
                "sec-ch-ua": "\" Not;A Brand\";v=\"99\", \"Chromium\";v=\"105\", \"Google Chrome\";v=\"105.0.5195.127\"",
                "sec-ch-ua-arch": "\"x86\"",
                "sec-ch-ua-bitness": "\"64\"",
                "sec-ch-ua-full-version": "\"105.0.1343.42\"",
                "sec-ch-ua-full-version-list": "\"Microsoft Edge\";v=\"105.0.1343.42\", \" Not;A Brand\";v=\"99.0.0.0\", \"Chromium\";v=\"105.0.5195.127\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-model": "",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-ch-ua-platform-version": "\"15.0.0\"",
                "sec-ch-ua-wow64": "?0",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "same-origin",
                "sec-fetch-site": "same-origin",
                "x-goog-authuser": "0",
                "x-origin": "https://www.youtube.com",
                "x-youtube-bootstrap-logged-in": "true",
                "x-youtube-client-name": "1",
                "x-youtube-client-version": "2.20220921.08.00",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            }
        }).catch(err=>{
            console.log(err);
            return err;
        });
    var rendercontents = (await res.json()).contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents;
    var result:any;
    
    for(var i = 0; i < rendercontents?.length;i++){
        if(rendercontents[i]?.itemSectionRenderer?.contents){
            for(var k = 0; k < Object.keys(rendercontents[i]?.itemSectionRenderer?.contents)?.length; k++){
                if(rendercontents[i]?.itemSectionRenderer?.contents[k]?.videoRenderer){
                    result = rendercontents[i].itemSectionRenderer.contents;
                }
            }
        }
    }
    var videos = [];
    console.log(rendercontents);
    console.log(rendercontents[0]?.itemSectionRenderer?.contents);
    for(var i = 0; i < result.length; i++){
    if(result[i]?.videoRenderer?.title?.runs[0]?.text&&result[i]?.videoRenderer?.thumbnail?.thumbnails[0]?.url&&result[i]?.videoRenderer?.ownerText?.runs[0]?.text&&result[i]?.videoRenderer?.videoId&&result[i]?.videoRenderer?.lengthText?.simpleText){
        videos.push({
            title : result[i].videoRenderer.title.runs[0].text,
            thumbnail : result[i].videoRenderer.thumbnail.thumbnails[0].url,
            author:result[i].videoRenderer.ownerText.runs[0].text,
            url: "https://www.youtube.com/watch?v="+result[i].videoRenderer.videoId,
            duration: parseYTTimeFromString(result[i].videoRenderer.lengthText.simpleText)
            })
    }else{
        console.log("Null on\n"+result[i].videoRenderer);
    }
    }
    return videos;
}

export  {SearchKeyword}
