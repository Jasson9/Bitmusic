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
    for(var i = 0; i < result.length; i++){
    if(result[i]?.videoRenderer?.title?.runs[0]?.text&&result[i]?.videoRenderer?.thumbnail?.thumbnails[0]?.url&&result[i]?.videoRenderer?.ownerText?.runs[0]?.text&&result[i]?.videoRenderer?.videoId&&result[i]?.videoRenderer?.lengthText?.simpleText){
        videos.push({
            title : result[i].videoRenderer.title.runs[0].text,
            thumbnail : result[i].videoRenderer.thumbnail.thumbnails[0].url,
            author:result[i].videoRenderer.ownerText.runs[0].text,
            url: "https://www.youtube.com/watch?v="+result[i].videoRenderer.videoId,
            duration: parseYTTimeFromString(result[i].videoRenderer.lengthText.simpleText),
            source:"youtube"
            })
    }else{
        console.log("Null on\n"+result[i].videoRenderer);
    }
    }
    return videos;
}

export async function searchMusicKeyword(query:string){
    var res:any = await fetch("https://music.youtube.com/youtubei/v1/search?key=AIzaSyC9XL3ZjWddXya6X74dJoCTL-WEYFDNX30&prettyPrint=false", {
        "headers": {
          "accept": "*/*",
          "accept-language": "en-US,en;q=0.9,id;q=0.8",
          "authorization": "SAPISIDHASH 1666171399_8fda5506fb83fb03dfabd98b5182d03b9876ef1a",
          "cache-control": "no-cache",
          "content-type": "application/json",
          "pragma": "no-cache",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "same-origin",
          "sec-fetch-site": "same-origin",
          "x-goog-authuser": "0",
          "x-goog-visitor-id": "CgtQZERfcThRWTJ1ZyiYgr-aBg%3D%3D",
          "x-origin": "https://music.youtube.com",
          "x-youtube-client-name": "67",
          "x-youtube-client-version": "1.20221012.01.01",
          "cookie": "VISITOR_INFO1_LIVE=PdD_q8QY2ug; LOGIN_INFO=AFmmF2swRAIgTXxiGHisniyOM_6U5j6MoDRWZt1wGMwuEAU5PEDN1R4CIDn-UKjvMT3KtFJyS2Z2Cao-agFN_SudscGhWBkxnl_m:QUQ3MjNmeC1GZnowTEx6XzdPTW1JTmNibE5WZ1pvT1FSdy1mN25QYkRocXBWSmJGU3lUZV92dmRubDI1eS1Xd1J4cDFYSG4wT3pxQlVFaTNZck5lazFoaWpvbTV6M3oxYUJidmp2aFRWckg4NU4yZ2ZNYzVSWWtldGJBRkVjRjlPbnNPTWlOckZENUZGaV9RZ2VPZlZtU2xRWnk2bDhKMF9n; NID=511=AZM9bifpZzwyV6_QP1XNfHi4oknxJCq7UnAT_1HJiyWMrPjQkT5TiJ36w0LblEKmtLBvNaODbsFow-0VrliOiLWt0EsxU8nRIMrmvR6DoL7EaPmqC9fZ17A12xq9hklGikgVsrwqJTbnyZyy3b9czPIP8ThN87l90_ms7qSgsEM; SID=Owiu9fB-DItaoyTqpRcPAv_mDyANmiw1zhV_zKUhynONVF-ddrZ77Oj4DC9RMXlEcfIP7Q.; __Secure-1PSID=Owiu9fB-DItaoyTqpRcPAv_mDyANmiw1zhV_zKUhynONVF-d04Owwryvz5Cc-f-KrzHifQ.; __Secure-3PSID=Owiu9fB-DItaoyTqpRcPAv_mDyANmiw1zhV_zKUhynONVF-dWB_I_zCYDiVsh2J2U0Q-ZA.; HSID=ArQuYHtA0GY-cPSJC; SSID=AoY7DUGRn00ejYtn1; APISID=G-AyfmOUWK4rY6an/Aj83pnfQ1ljaULZ-q; SAPISID=itJ5DQLAqueV3TvL/AoDgTYNyOQkMf28TA; __Secure-1PAPISID=itJ5DQLAqueV3TvL/AoDgTYNyOQkMf28TA; __Secure-3PAPISID=itJ5DQLAqueV3TvL/AoDgTYNyOQkMf28TA; __utmz=27069237.1665513409.107.3.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided); _gcl_au=1.1.1269970520.1665854247; PREF=tz=Asia.Jakarta&f6=40000000&f7=1&f5=30000&gl=ID&autoplay=false&has_user_changed_default_autoplay_mode=true; YSC=rab7eqv-noI; __utmc=27069237; __utma=27069237.2068227462.1663240050.1666101177.1666101177.130; SIDCC=AEf-XMRKzD2pzw6MnfHppfQw2uf9DjnDcltzuaBNpsHDkDdBamDPCDTvREeL8rw_SM9sv294R3d-; __Secure-1PSIDCC=AEf-XMT1qx8H3N9TqAH61vvd8dQjjfMaPyBxAkqBzO2Ro0iQckzEXamPWvTtm4GPCCbLqb7-vCQ; __Secure-3PSIDCC=AEf-XMSr_x5D1l6zW8dZFXQ1WgbcgycQh5OaMuxeFxPGY4T4M5sPahYuyhFpBODP1huyGgzEqmI",
          "Referer": "https://music.youtube.com/search?q=giga",
          "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": `{\"context\":{\"client\":{\"hl\":\"id\",\"gl\":\"ID\",\"remoteHost\":\"\",\"deviceMake\":\"\",\"deviceModel\":\"\",\"visitorData\":\"CgtQZERfcThRWTJ1ZyiYgr-aBg%3D%3D\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36,gzip(gfe)\",\"clientName\":\"WEB_REMIX\",\"clientVersion\":\"1.20221012.01.01\",\"osName\":\"Windows\",\"osVersion\":\"10.0\",\"originalUrl\":\"https://music.youtube.com/\",\"platform\":\"DESKTOP\",\"clientFormFactor\":\"UNKNOWN_FORM_FACTOR\",\"configInfo\":{\"appInstallData\":\"CJiCv5oGEOrKrgUQ28quBRCUz64FEP24_RIQuIuuBRCyiP4SENSDrgUQ4rmuBRDL7P0SEL-J_hIQmcauBRDYvq0F\"},\"userInterfaceTheme\":\"USER_INTERFACE_THEME_DARK\",\"timeZone\":\"Asia/Jakarta\",\"browserName\":\"Chrome\",\"browserVersion\":\"106.0.0.0\",\"acceptHeader\":\"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9\",\"deviceExperimentId\":\"Cgt3cmVycGhxQVFPaxCYgr-aBg%3D%3D\",\"screenWidthPoints\":375,\"screenHeightPoints\":667,\"screenPixelDensity\":2,\"screenDensityFloat\":2.0000000298023224,\"utcOffsetMinutes\":420,\"musicAppInfo\":{\"pwaInstallabilityStatus\":\"PWA_INSTALLABILITY_STATUS_CAN_BE_INSTALLED\",\"webDisplayMode\":\"WEB_DISPLAY_MODE_BROWSER\",\"storeDigitalGoodsApiSupportStatus\":{\"playStoreDigitalGoodsApiSupportStatus\":\"DIGITAL_GOODS_API_SUPPORT_STATUS_UNSUPPORTED\"},\"musicActivityMasterSwitch\":\"MUSIC_ACTIVITY_MASTER_SWITCH_INDETERMINATE\",\"musicLocationMasterSwitch\":\"MUSIC_LOCATION_MASTER_SWITCH_INDETERMINATE\"}},\"user\":{\"lockedSafetyMode\":false},\"request\":{\"useSsl\":true,\"internalExperimentFlags\":[],\"consistencyTokenJars\":[]},\"clickTracking\":{\"clickTrackingParams\":\"CAsQ_V0YACITCJCGpqv76_oCFZqE2AUdBV8PoA==\"},\"adSignalsInfo\":{\"params\":[{\"key\":\"dt\",\"value\":\"1666171137228\"},{\"key\":\"flash\",\"value\":\"0\"},{\"key\":\"frm\",\"value\":\"0\"},{\"key\":\"u_tz\",\"value\":\"420\"},{\"key\":\"u_his\",\"value\":\"4\"},{\"key\":\"u_h\",\"value\":\"667\"},{\"key\":\"u_w\",\"value\":\"375\"},{\"key\":\"u_ah\",\"value\":\"667\"},{\"key\":\"u_aw\",\"value\":\"375\"},{\"key\":\"u_cd\",\"value\":\"24\"},{\"key\":\"bc\",\"value\":\"31\"},{\"key\":\"bih\",\"value\":\"667\"},{\"key\":\"biw\",\"value\":\"375\"},{\"key\":\"brdim\",\"value\":\"0,0,0,0,375,0,375,667,375,667\"},{\"key\":\"vis\",\"value\":\"1\"},{\"key\":\"wgl\",\"value\":\"true\"},{\"key\":\"ca_type\",\"value\":\"image\"}]}},\"query\":\"${query}\",\"params\":\"EgWKAQIIAWoKEAMQChAFEAQQCQ%3D%3D\"}`,
        "method": "POST"
      });
    
    var contents = (await res.json()).contents.tabbedSearchResultsRenderer.tabs;
    var songs;
    for(var i = 0; i < contents?.length ; i ++){
        if(contents[i]?.tabRenderer.content.sectionListRenderer.contents){
            var temp = contents[i]?.tabRenderer?.content?.sectionListRenderer?.contents;
            for(var k = 0 ;  k < temp.length; k ++){
                if(temp[k]?.musicShelfRenderer?.contents){
                    songs = temp[k].musicShelfRenderer.contents
                }
            }
        }
    }
    var results:any = [];
    songs.forEach((song:any) => {
        results.push({
            url:"https://www.youtube.com/watch?v="+song.musicResponsiveListItemRenderer.playlistItemData.videoId,
            title:song.musicResponsiveListItemRenderer.flexColumns[0].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text,
            author:song.musicResponsiveListItemRenderer.flexColumns[1].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text,
            duration: parseYTTimeFromString(song.musicResponsiveListItemRenderer.flexColumns[1].musicResponsiveListItemFlexColumnRenderer.text.runs[song.musicResponsiveListItemRenderer.flexColumns[1].musicResponsiveListItemFlexColumnRenderer.text.runs.length-1].text,"."),
            thumbnail: "https://i.ytimg.com/vi/"+song.musicResponsiveListItemRenderer.playlistItemData.videoId+"/maxresdefault.jpg",
            source:"youtube-music"
        })
    });
    //song.musicResponsiveListItemRenderer.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails[song.musicResponsiveListItemRenderer.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails.length-1].url
    //console.log(temp[0].musicShelfRenderer.contents);
    return results;
}

export  {SearchKeyword}
