import fetch from "node-fetch"


export async function getLyricsFromYTMusicId(VideoId:string){

    var res:any = await  fetch("https://music.youtube.com/youtubei/v1/next?prettyPrint=false",{
        method:"POST",
        body:JSON.stringify({
            "enablePersistentPlaylistPanel": true,
            "tunerSettingValue": "AUTOMIX_SETTING_NORMAL",
            "videoId": VideoId,
            "isAudioOnly": true,
            "context": {
                "client": {
                    "hl": "id",
                    "gl": "ID",
                    "remoteHost": "",
                    "deviceMake": "",
                    "deviceModel": "",
                    "visitorData": "",
                    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36,gzip(gfe)",
                    "clientName": "WEB_REMIX",
                    "clientVersion": "1.20221012.01.01",
                    "osName": "Windows",
                    "osVersion": "10.0",
                    "platform": "DESKTOP",
                    "clientFormFactor": "UNKNOWN_FORM_FACTOR",
                    "configInfo": {
                        "appInstallData": ""
                    },
                    "userInterfaceTheme": "USER_INTERFACE_THEME_DARK",
                    "timeZone": "Asia/Jakarta",
                    "browserName": "Chrome",
                    "browserVersion": "106.0.0.0",
                    "acceptHeader": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                    "deviceExperimentId": "",
                    "screenWidthPoints": 703,
                    "screenHeightPoints": 746,
                    "screenPixelDensity": 1,
                    "screenDensityFloat": 1.25,
                    "utcOffsetMinutes": 420,
                    "musicAppInfo": {
                        "pwaInstallabilityStatus": "PWA_INSTALLABILITY_STATUS_UNKNOWN",
                        "webDisplayMode": "WEB_DISPLAY_MODE_BROWSER",
                        "storeDigitalGoodsApiSupportStatus": {
                            "playStoreDigitalGoodsApiSupportStatus": "DIGITAL_GOODS_API_SUPPORT_STATUS_UNSUPPORTED"
                        },
                        "musicActivityMasterSwitch": "MUSIC_ACTIVITY_MASTER_SWITCH_INDETERMINATE",
                        "musicLocationMasterSwitch": "MUSIC_LOCATION_MASTER_SWITCH_INDETERMINATE"
                    }
                },
                "user": {
                    "lockedSafetyMode": false
                },
                "request": {
                    "useSsl": true,
                    "internalExperimentFlags": [],
                    "consistencyTokenJars": []
                },
                "clickTracking": {
                    "clickTrackingParams": ""
                },
                "adSignalsInfo": {
                    "params": [
                        
                    ]
                }
            }
        }),
        headers:{
            "accept":"*/*"
        }
    })
    var contents:any = (await res.json()).contents.singleColumnMusicWatchNextResultsRenderer.tabbedRenderer.watchNextTabbedResultsRenderer.tabs;
    var id:string = " null";
    for(var i = 0; i < contents.length; i ++){
        console.log(contents[i]?.tabRenderer?.endpoint?.browseEndpoint?.browseEndpointContextSupportedConfigs?.browseEndpointContextMusicConfig.pageType)
        if(contents[i]?.tabRenderer?.endpoint?.browseEndpoint?.browseEndpointContextSupportedConfigs?.browseEndpointContextMusicConfig.pageType == "MUSIC_PAGE_TYPE_TRACK_LYRICS"){
            id = contents[i].tabRenderer.endpoint.browseEndpoint.browseId;
        }
    }
    console.log(id);

    var res2:any = await fetch("https://music.youtube.com/youtubei/v1/browse?key=AIzaSyC9XL3ZjWddXya6X74dJoCTL-WEYFDNX30&prettyPrint=false", {
        "headers": {
          "accept": "*/*",
          "accept-language": "en-US,en;q=0.9,id;q=0.8",
          "cache-control": "no-cache",
          "content-type": "application/json",
          "pragma": "no-cache",
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
          "sec-fetch-mode": "same-origin",
          "sec-fetch-site": "same-origin",
          "x-goog-authuser": "0",
          "x-origin": "https://music.youtube.com",
          "x-youtube-client-name": "67",
          "x-youtube-client-version": "1.20221012.01.01",
        },
        "body": `{\"context\":{\"client\":{\"hl\":\"id\",\"gl\":\"ID\",\"remoteHost\":\"\",\"deviceMake\":\"\",\"deviceModel\":\"\",\"visitorData\":\"\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36,gzip(gfe)\",\"clientName\":\"WEB_REMIX\",\"clientVersion\":\"1.20221012.01.01\",\"osName\":\"Windows\",\"osVersion\":\"10.0\",\"originalUrl\":\"\",\"platform\":\"DESKTOP\",\"clientFormFactor\":\"UNKNOWN_FORM_FACTOR\",\"configInfo\":{\"appInstallData\":\"\"},\"userInterfaceTheme\":\"USER_INTERFACE_THEME_DARK\",\"timeZone\":\"Asia/Jakarta\",\"browserName\":\"Chrome\",\"browserVersion\":\"106.0.0.0\",\"acceptHeader\":\"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9\",\"deviceExperimentId\":\"Cgs3VnJlck9kWEpaZxDipr-aBg%3D%3D\",\"screenWidthPoints\":438,\"screenHeightPoints\":746,\"screenPixelDensity\":1,\"screenDensityFloat\":1.25,\"utcOffsetMinutes\":420,\"musicAppInfo\":{\"pwaInstallabilityStatus\":\"PWA_INSTALLABILITY_STATUS_CAN_BE_INSTALLED\",\"webDisplayMode\":\"WEB_DISPLAY_MODE_BROWSER\",\"storeDigitalGoodsApiSupportStatus\":{\"playStoreDigitalGoodsApiSupportStatus\":\"DIGITAL_GOODS_API_SUPPORT_STATUS_UNSUPPORTED\"},\"musicActivityMasterSwitch\":\"MUSIC_ACTIVITY_MASTER_SWITCH_INDETERMINATE\",\"musicLocationMasterSwitch\":\"MUSIC_LOCATION_MASTER_SWITCH_INDETERMINATE\"}},\"user\":{\"lockedSafetyMode\":false},\"request\":{\"useSsl\":true,\"internalExperimentFlags\":[],\"consistencyTokenJars\":[]},\"clickTracking\":{\"clickTrackingParams\":\"CBEQpLQFGAciEwjo0sPbjOz6AhVEknAKHccLDjI=\"},\"adSignalsInfo\":{\"params\":[{\"key\":\"dt\",\"value\":\"1666175816451\"},{\"key\":\"flash\",\"value\":\"0\"},{\"key\":\"frm\",\"value\":\"0\"},{\"key\":\"u_tz\",\"value\":\"420\"},{\"key\":\"u_his\",\"value\":\"6\"},{\"key\":\"u_h\",\"value\":\"864\"},{\"key\":\"u_w\",\"value\":\"1536\"},{\"key\":\"u_ah\",\"value\":\"816\"},{\"key\":\"u_aw\",\"value\":\"1536\"},{\"key\":\"u_cd\",\"value\":\"24\"},{\"key\":\"bc\",\"value\":\"31\"},{\"key\":\"bih\",\"value\":\"746\"},{\"key\":\"biw\",\"value\":\"438\"},{\"key\":\"brdim\",\"value\":\"0,0,0,0,1536,0,1536,816,438,746\"},{\"key\":\"vis\",\"value\":\"1\"},{\"key\":\"wgl\",\"value\":\"true\"},{\"key\":\"ca_type\",\"value\":\"image\"}]},\"activePlayers\":[{\"playerContextParams\":\"Q0FFU0FnZ0I=\"}]},\"browseId\":\"${id}\"}`,
        "method": "POST"
      });
      var lyric:any = (await res2.json()).contents.sectionListRenderer.contents[0].musicDescriptionShelfRenderer.description.runs[0].text;
      return lyric;
}