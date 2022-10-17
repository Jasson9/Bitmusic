/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import Head from 'next/head';
import type { NextPage } from 'next'
import styles from '../styles/player.module.scss'
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import VolumeUp from '@mui/icons-material/VolumeUp';
import VolumeOff from '@mui/icons-material/VolumeOff';
import IconButton from '@mui/material/IconButton';
import PlayIcon from '@mui/icons-material/PlayCircle';
import PauseIcon from '@mui/icons-material/PauseCircle';
import NextIcon from '@mui/icons-material/SkipNextRounded';
import PreviousIcon from '@mui/icons-material/SkipPreviousRounded';
import YouTubeIcon from '@mui/icons-material/YouTube';
import Grid from '@mui/material/Grid';
import { parseTimeFromSeconds } from '../lib/timeparser';
import Input from '@mui/material/Input';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/FileDownloadRounded';
import { YtVideoResponse } from '../lib/yt';
import CircularProgress from '@mui/material/CircularProgress';
import DownloadDoneIcon from '@mui/icons-material/DownloadDoneRounded';
import Popper from '@mui/material/Popper';
import Fade from '@mui/material/Fade';
import QueueMusicIcon from '@mui/icons-material/QueueMusicRounded';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { SongMetaData } from '../lib/interfaces';
import $ from 'jquery';
import dynamic from 'next/dynamic'
import {searchSong} from '../components/searchres.js'

const Home: NextPage = () => {
const SearchPage = dynamic(() => import('../components/searchres.js'))
const [hasMounted, setHasMounted] = React.useState(false);
React.useEffect(() => {
  setHasMounted(true);
}, [])
const [volume, setVolume] = React.useState<number>(30);
const [playing, setPlay] = React.useState(0);
const [songLength, setSongLength] = React.useState<number>(0)
const [elapsedTime, setElapsedTime] = React.useState<number>(0)
const [isStopped, setStop] = React.useState(1);//for playlist later
const [searchResult, setSearchResult] = React.useState<any>();
const [onMobile, setOnMobile] = React.useState<boolean>(false);
const [open, setOpen] = React.useState(false);
const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
const [currentTitle, setCurrentTitle] = React.useState<string>("");
const [currentAuthor, setCurrentAuthor] = React.useState<string>("");
const [currentThumbnail, setCurrentThumbnail] = React.useState<string>("");
const [playList, setPlaylist] = React.useState<SongMetaData[]>([]);
const [playListIndex, setPlaylistIndex] = React.useState<number>(0);
const [playlistElement,setPlaylistElement] = React.useState<any>(null);
const handleClick = (event: React.MouseEvent<HTMLElement>) => {
  setAnchorEl(event.currentTarget);
  setOpen((previousOpen) => !previousOpen);
};

React.useEffect(()=>{
    console.log(playList);
    setPlaylistElement(<div id="playlistcontent" className={styles.playlist}>
    <h3 style={{color:"aliceblue"}}>Playlist</h3>
    {playList?.map((res,index)=><div key={index} className={styles.playlistSongDataContainer}>
        <div className={styles.playlistSongBasicInfo}>
            <p>{res.title}</p>
            <p>{res.author}</p>
        </div>
        <div className={styles.playlistSongRightSide}>
            <p>{parseTimeFromSeconds(res.duration)}</p>
        </div>
    </div>)}
    
</div>)
},[playList])

const canBeOpen = open && Boolean(anchorEl);
const id = canBeOpen ? 'transition-popper' : undefined;
//var searchResult = [];
const changeVolume = (event:Event|null, newValue: any) => {
    var elm:any = document.querySelector("#audioSource");
    if(newValue == 0){
        document.getElementById("volumeon")?.setAttribute("hidden","")
        document.getElementById("volumeoff")?.removeAttribute("hidden")
    }else{
        document.getElementById("volumeoff")?.setAttribute("hidden","")
        document.getElementById("volumeon")?.removeAttribute("hidden")
    }
    elm.volume = newValue/100;
    setVolume(newValue as number);
};

const changePlaybackTime = (event:Event|null, Value: any)=>{
    var time = (songLength)*Value/100;
    var elm:any = document.querySelector("#audioSource");
    elm.pause();
    elm.currentTime = time;
    setElapsedTime(time);
    setTimeout(()=>{
            if(playing){
                play();
            }
    },500)  
    
}

const updateSongLength = (event:any)=>{
    setSongLength(event.target.duration);
}

const updateElapseTime = (event:any)=>{
    setElapsedTime(event.target.currentTime);
}

const toggleMuteOrUnmute = (event:any)=>{
    if(onMobile){
        handleClick(event);
    }else{
        if(volume==0){
            changeVolume(null,50);
        }else{
            changeVolume(null,0);
        }
    }
}

const play = ()=>{
    document.getElementById("play")?.setAttribute("hidden","")
    document.getElementById("pause")?.removeAttribute("hidden")
    var elm:any = document.querySelector("#audioSource");
    elm.play();
    elm.volume = volume/100;
    setPlay(1);
}

const pause = ()=>{
    document.getElementById("pause")?.setAttribute("hidden","")
    document.getElementById("play")?.removeAttribute("hidden")
    var elm:any = document.querySelector("#audioSource");
    elm.pause();
    setPlay(0);
}

const stop = ()=>{
    
}

async function downloadSong(url:string){
    document.getElementById("DownloadIcon-"+url)?.setAttribute("hidden","");
    document.getElementById("DownloadProgressIcon-"+url)?.removeAttribute("hidden");
    if(url){
        $.ajax({method:"POST",url:"/api/getAudioInfo",data:{"url":url},dataType:"json"}).then(async(data:any)=>{
            var res:YtVideoResponse = data.data;
            var audiourl:string|null = null;
            if(!res){
                throw "Request ajax request failed\n"+res;
            }
            if(res.needProxy){
                var fetchaudio:Response = await fetch("/api/downloadfromitag",{
                    method:"POST",
                    headers:{
                        'Cache-Control':'no-cache'
                    },
                    body:JSON.stringify({"url":"https://www.youtube.com/watch?v="+res.videoId,"itag":res.formats[res.formats.length-1].itag})
                }).catch(err=>{
                    console.log(err);
                    throw err;
                })
                var blob = await fetchaudio.blob();
                audiourl = URL.createObjectURL(blob);
            }else{
                res.formats.forEach(format=>{
                    if(/audio\/mp4/.test(format.mimeType)){
                        audiourl = format.url;
                    }
                })
            }
            if(audiourl){
                document.getElementById("DownloadProgressIcon-"+url)?.setAttribute("hidden","");
                document.getElementById("DownloadDoneIcon-"+url)?.removeAttribute("hidden");
                document.getElementById("DownloadDoneIcon-"+url)?.setAttribute("download",res.title+".mp3");
                document.getElementById("DownloadDoneIcon-"+url)?.setAttribute("href",audiourl);
                document.getElementById("DownloadDoneIcon-"+url)?.click();
                return;
            }
        })
    }

}
 
/**
async function searchSong(){
    var query:any = document.getElementById("searchinput");
    console.log(query.value)
    if(query.value){
        document.getElementById("searchIcon")?.setAttribute("hidden","");
        document.getElementById("searchingIcon")?.removeAttribute("hidden");
        $.ajax({method:"POST",url:"/api/searchYt",data:{"query":query.value},dataType:"json"}).then((res:any)=>{
        var results:Array<any>= res.data;
        console.log(results)
        //setSearchResult(res.data);
        //searchResult = new Array;
        setSearchResult(<h3 style={{color:"aliceblue",fontSize:"3vmin"}}>Search Result for {query.value} { results.map((res:SongMetaData,key)=><div key={key} className={styles.resultcontainer}>
            <div className={styles.thumbnailcontainer}>
                <img className={styles.resultthumbnail} src={res.thumbnail}></img>
                <div className={styles.resultdurationtext}>{parseTimeFromSeconds(res.duration)}</div>
            </div>
            <div className={styles.resultdata}>
            <div className={styles.resulttext}>
                <div className={styles.resultTitle}>{res.title}</div>
                <div className={styles.resultAuthor}>{res.author}</div>
                </div>
            <div className={styles.resulticons}>
            <div id={"StartplayButton-"+res.url} onClick={()=>addAndPlay(res,false)}>
                <IconButton>
                    <PlayIcon/>
                </IconButton>
            </div>
            <div id={"LoadingPlayIcon-"+res.url} hidden>
                <CircularProgress size={"24px"}/>
            </div>
            <div onClick={()=>downloadSong(res.url) } id={"DownloadIcon-"+res.url}>
                <IconButton>
                    <DownloadIcon/>
                </IconButton>
            </div>
            <div id={"DownloadProgressIcon-"+res.url} hidden>
                <CircularProgress/>
            </div>
            <a id={"DownloadDoneIcon-"+res.url} hidden target={"_blank"} rel={"noreferrer"}>
                <IconButton>
                    <DownloadDoneIcon />
                </IconButton>
            </a>
            <a href={res.url} target={"_blank"} rel={"noreferrer"}>
                <IconButton>
                    <YouTubeIcon/>
                </IconButton>
            </a>
            </div>
            </div>
            </div>
            )}</h3>)
        document.getElementById("searchingIcon")?.setAttribute("hidden","");
        document.getElementById("searchIcon")?.removeAttribute("hidden");
    }).catch((err:any)=>{
        document.getElementById("searchingIcon")?.setAttribute("hidden","");
        document.getElementById("searchIcon")?.removeAttribute("hidden");
        console.log(err)
    })
    }

    
} */

async function fetchSongData(url:string):Promise<any>{
    if(url){
        document?.getElementById("StartplayButton-"+url)?.setAttribute("hidden","");
        document?.getElementById("LoadingPlayIcon-"+url)?.removeAttribute("hidden");
        var data =await fetch("/api/getAudioInfo",{method:"POST",body:JSON.stringify({url:url})})
            var res:YtVideoResponse = (await data.json()).data; 
            var webm:Array<any> = [];
            var mp4:any;
            res.formats.forEach((format:any)=>{
                if(/audio\/webm/.test(format.mimeType)){
                    webm.push(format);
                }else{
                    if(/audio\/mp4/.test(format.mimeType)){
                        mp4 = format;
                    }
                }
            })
            var audioelm:any = document.querySelector("#audioSource");
            var sourceurl:any;
            //console.log(webm)
            //res.needProxy
            if(res.needProxy){
                console.log("using Proxy "+res.videoId);
                var audioitag;
                var source:any;
                if(audioelm?.canPlayType('audio/webm')&&webm.length>=1){
                    audioitag = webm[webm.length-1].itag;
                    source = document.getElementById("webmSource");
                }else{
                    audioitag = mp4.itag;
                    source = document.querySelector("mp4Source");
                }
                var fetchaudio:Response = await fetch("/api/downloadfromitag",{
                    method:"POST",
                    headers:{
                        'Cache-Control':'no-cache'
                    },
                    body:JSON.stringify({"url":"https://www.youtube.com/watch?v="+res.videoId,"itag":audioitag})
                }).catch(err=>{
                    console.log(err);
                    throw err;
                })
                var blob = await fetchaudio.blob();
                sourceurl = URL.createObjectURL(blob);
                source.setAttribute("src",sourceurl);
            }else{
                console.log("Direct Download "+res.videoId);
                var source:any;
                if(audioelm?.canPlayType('audio/webm')&&webm.length>=1){
                    source = document.getElementById("webmSource");
                    if(webm[1]){
                        source.setAttribute("src",webm[1].url);
                    }else{
                        source.setAttribute("src",webm[0].url);
                    }
                }else{
                    if(mp4){
                        source = document.querySelector("mp4Source");
                        source.setAttribute("src",mp4.url);
                    }else{
                        console.error("No audio found on this video");
                        return null
                    }
                }
            }
            //will be changed for better logic
               
            document.getElementById("LoadingPlayIcon-"+url)?.setAttribute("hidden","");
            document.getElementById("StartplayButton-"+url)?.removeAttribute("hidden");
            console.log(res)
            return res;
        
    }else{
        throw "no url"
    }
    
}

function addplaylist(song:SongMetaData){
    var newLength = playList.length+1;
    console.log(newLength)
    setPlaylist(songs=>[...songs,song]);
    console.log(playList);
    return null;
}

async function addAndPlay(song:SongMetaData,onlyAdd:boolean){
    var length:any = addplaylist(song);
    console.log(playList);
    console.log(playListIndex);
    //console.log(length);
    if(length==playListIndex+1 && !onlyAdd){
        var res:YtVideoResponse|null = await fetchSongData(song.url);
        console.log("res"+res);
        if(res!=null){
            var audioelm:any = document.querySelector("#audioSource");
            audioelm.load();
            setCurrentAuthor(res.author);
            setCurrentTitle(res.title);
            setCurrentThumbnail(res.thumbnail);
            play(); 
        }
    }
}

function preventHorizontalKeyboardNavigation(event: React.KeyboardEvent) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
    }
  }



React.useEffect(()=>{
    document.addEventListener("drag",(res:any)=>{
        if(res?.target?.id == "resizer" && res.clientX != 0 ){
            //res.preventDefault();
            var page = document.getElementById("resultcontainer");
            var playlist = document.getElementById("playlistcontainer");
            page?.setAttribute("style",`width: ${Math.max(res.clientX,window.innerWidth-400)}px`)
            playlist?.setAttribute("style",`width: ${window.innerWidth-res.clientX}px`)
            //console.log(res.clientX);
        }
    });
    console.log(navigator.userAgent)
    //on mobile
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 540 ) {
        document.querySelector("."+styles.playlistcontainer)?.setAttribute("hidden","");
        document.querySelector("#volumeslider")?.setAttribute("hidden","");
        document.querySelector("."+styles.musicMetaDataContainer)?.setAttribute("hidden","");
        document.querySelector("#songMetaDataContainerAlt")?.removeAttribute("hidden");
        document.querySelector("#sideButtonsAlt")?.removeAttribute("hidden");
        document.querySelector("#resultpad")?.setAttribute("style","padding-top:50px")
        //document.getElementById("volumeon")?.setAttribute("onClick",`${changeVolume.name}(null,0)`);
        console.log("on mobile");
        setOnMobile(true);
       }else{//on desktop
            setOnMobile(false);//songMetaDataContainerAlt
            document.querySelector("#sideButtonsAlt")?.setAttribute("hidden","");
            document.querySelector("#songMetaDataContainerAlt")?.setAttribute("hidden","")
            document.querySelector("."+styles.musicMetaDataContainer)?.removeAttribute("hidden")
            document.querySelector("."+styles.playlistcontainer)?.removeAttribute("hidden");
            document.querySelector("#volumeslider")?.removeAttribute("hidden");
            document.querySelector("#resultpad")?.removeAttribute("style");
       }
    console.log(window.innerHeight)
    console.log(window.innerWidth)
},[onMobile])




if (!hasMounted) {
    return null;
  }
  return (
    <div>
        <Head>
            <title>Music Player</title>
            <meta charSet="UTF-8"></meta>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"></meta>
        </Head>
        <body>
            <div className={[styles.background].join(" ")}>
                <div className={[styles.navbar].join(" ")}>
                    <div className = {styles.titleContainer}>
                        <h1 className={styles.title} style={{margin: "0px",fontSize:"4vmin"}}>Bitmusic</h1>
                        <span style={{fontSize:"2vmin",backgroundColor:"lightblue",borderRadius:"6px",padding:"5px",paddingTop:"2px",paddingBottom:"2px",marginLeft:"5px", fontWeight:"bold"}}>BETA</span>
                    </div>
                    <div className={styles.navigationContainer}>

                    </div>
                        <div className={styles.searchbarcontainer}>
                            <Box>
                            <Stack direction="row" alignItems="center" justifyContent="center">
                                <Input id="searchinput" sx={{width:"40vmin",color:"aliceblue",paddingLeft:"5px",fontSize:"2.5vmin"}} style={{color:"aliceblue"}}/>
                                <div  onClick={searchSong}>
                                <IconButton >
                                    <SearchIcon id="searchIcon"/>
                                </IconButton>
                                </div>
                                <div id="searchingIcon" hidden>
                                    <CircularProgress size={"24px"}/>
                                </div>
                            </Stack>
                            </Box>
                        </div>
                </div>
                <div  className={[styles.maincontainer].join(" ")} style={{display:"flex"}}>
                  <SearchPage/>
                    <div id="playlistcontainer" className={[styles.playlistcontainer].join(" ")}>
                        <a className={styles.resizeBar} id="resizer" title={""} href={"javascript:void(0)"}></a>
                        {playlistElement}
                    </div>
                </div>
                <div className={styles.songMetaDataContainerAlt} id="songMetaDataContainerAlt" hidden>
                    <div className={styles.songInfoContainer}>
                        <img id={styles.thumbnailAlt} src={currentThumbnail} ></img>
                        <div className={styles.musicInfoContainer}>
                            <div id={styles.songtitleAlt}>{currentTitle}</div>
                            <div id={styles.authorAlt}>{currentAuthor}</div>
                        </div>
                        </div>
                        <div id="playlistbtnAlt">
                            <IconButton>
                                <QueueMusicIcon/>
                            </IconButton>
                        </div>
                    </div>
                <div className={[styles.playercontainer].join(" ")}>
                    <div className={[styles.playercontents].join(" ")}>
                        <div className={[styles.playertrack].join(" ")}>
                            <Stack spacing={1} direction="row"  alignItems="center" sx={{width:"75%"}}>
                                    <output id="length">{parseTimeFromSeconds(elapsedTime.toString())}</output>
                                    <Slider style={{padding: "8px"}} id="playbackslider" size='small' aria-label="playback" value={(elapsedTime/songLength)*100} onChange={changePlaybackTime}/>
                                    <output id="length">{parseTimeFromSeconds(songLength.toString())}</output>
                            </Stack>
                            <audio id="audioSource" hidden preload='metadata' onTimeUpdate={updateElapseTime} onLoadedMetadata={updateSongLength} onEnded={pause}>
                                <source id='webmSource' src='' type='audio/webm' />
                                <source id="mp4Source" src='' type='audio/mp4' />
                            </audio>
                        </div>
                        <Grid container spacing={0} alignContent={"center"} flexWrap={"nowrap"} alignItems={"center"} justifyContent={"center"}>
                            <div className={styles.musicMetaDataContainer}>
                                        <div>
                                            <img id={styles.thumbnail} src={currentThumbnail}></img>
                                        </div>
                                        <div className={styles.musicInfoContainer}>
                                            <div id={styles.songtitle}>{currentTitle}</div>
                                            <div id={styles.author}>{currentAuthor}</div>
                                        </div>
                                    </div>
                            <div className={styles.sideButtonsAlt} id="sideButtonsAlt" hidden>
                                <IconButton >
                                    <MoreHorizIcon/>
                                </IconButton>
                            </div>
                            <Grid item xs={4}>
                                <Stack spacing={0} direction="row" alignItems="center" justifyContent={"center"}>
                                    <IconButton sx={{padding:"4px"}}>
                                        <PreviousIcon fontSize="large" />
                                    </IconButton>
                                        <span id="play" onClick={play}>
                                            <IconButton sx={{padding:"4px"}}>
                                                <PlayIcon fontSize='large'/>
                                            </IconButton>
                                        </span>
                                        <span id="pause" onClick={pause} hidden>
                                            <IconButton sx={{padding:"4px"}}>
                                                <PauseIcon fontSize='large'/>
                                            </IconButton>
                                        </span>
                                    <IconButton sx={{padding:"4px"}}>
                                        <NextIcon fontSize="large" />
                                    </IconButton>
                            </Stack>
                            </Grid>
                            <Grid item xs={4}>
                                <Stack spacing={1} direction="row"  alignItems="center" justifyContent={"flex-end"}>
                                    <div onClick={toggleMuteOrUnmute}>
                                        <span id="volumeon" >
                                            <IconButton >
                                                <VolumeUp/>
                                            </IconButton>
                                        </span>
                                        <span id="volumeoff"  hidden>
                                            <IconButton >
                                              <VolumeOff />
                                            </IconButton>  
                                        </span>
                                    </div>
                                        <div>
                                            <Popper id={id} open={open} anchorEl={anchorEl} transition>
                                                {({ TransitionProps }) => (
                                                <Fade {...TransitionProps} timeout={200}>
                                                    <Box sx={{ height: 200 ,backgroundColor:"#33296d",borderRadius:"50px",padding:"10px",paddingLeft:"5px",paddingRight:"5px"}} >
                                                    <Slider
                                                        sx={{
                                                            '& input[type="range"]': {
                                                            WebkitAppearance: 'slider-vertical',
                                                            },
                                                        }}
                                                        orientation="vertical"
                                                        value={volume}
                                                        onChange={changeVolume} 
                                                        aria-label="Volume"
                                                        valueLabelDisplay="auto"
                                                        onKeyDown={preventHorizontalKeyboardNavigation}
                                                        />
                                                    </Box>
                                                </Fade>
                                                )}
                                            </Popper>
                                        </div>
                                        <Slider aria-label="Volume" value={volume} onChange={changeVolume} id="volumeslider" sx={{maxWidth:"240px"}}/>
                                        <output id="volume-output">{volume}</output>
                                </Stack>
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </div>
        </body>

    </div>
    
  )
  
}

export default Home
