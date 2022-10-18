import styles from "../styles/player.module.scss";
import DownloadDoneIcon from "@mui/icons-material/DownloadDoneRounded";
import {useState,useEffect} from "react";
import DownloadIcon from "@mui/icons-material/FileDownloadRounded";
import YouTubeIcon from "@mui/icons-material/YouTube";
import IconButton from "@mui/material/IconButton";
import PlayIcon from "@mui/icons-material/PlayCircle";
import CircularProgress from "@mui/material/CircularProgress";
import {parseTimeFromSeconds} from "../lib/timeparser";
import {Home} from '../pages/index'
import {db} from './db'
import {getAudioInfo, fetchAudio} from './util'

async function downloadSong(url){
    console.log(url);
    document.getElementById("DownloadIcon-"+url)?.setAttribute("hidden","");
    document.getElementById("DownloadProgressIcon-"+url)?.removeAttribute("hidden");
    if(url){
            var res = await getAudioInfo(url);
            var audiourl = null;
            if(!res){
                throw "Request ajax request failed\n"+res;
            }
            if(res.needProxy){
                audiourl = await fetchAudio(res.videoId, res.formats[res.formats.length-1].itag);
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
            }
            return {
                url:audiourl
            };
        
    }
}

async function addToPlaylist(){

}

async function UsePlay(url){
    console.log("play called "+url);
    window.localStorage.setItem("url",url)
    window.dispatchEvent( new Event('addSong') )
    return
    /**
    var dbres = await db.songs.add({
        videoId:res.videoId,
        author: res.author,
        title: res.title,
        thumbnail: res.thumbnail,
        length: res.lengthSeconds,
        needProxy :res.needProxy
    });
    console.log(dbres); */
}

const UseSearchSong=(props)=>{
    const [keyword, setKeyword] = useState("");
    const [results, setResults] = useState();

    if(keyword != props.keyword){
        setKeyword(props.keyword);
    }
    useEffect(()=>{
        const getVideo = async (keyword)=>{
            if(keyword){
                document.getElementById("searchIcon")?.setAttribute("hidden","");
                document.getElementById("searchingIcon")?.removeAttribute("hidden");
                var data = await fetch("/api/searchYt",{
                    method:"POST",
                    body:JSON.stringify({
                        "query":keyword
                    }),
                }).catch(err=>{
                    throw err;
                })
                var res = await data.json();
                document.getElementById("searchingIcon")?.setAttribute("hidden","");
                document.getElementById("searchIcon")?.removeAttribute("hidden");
                document.getElementById("searchingIcon")?.setAttribute("hidden","");
                document.getElementById("searchIcon")?.removeAttribute("hidden");
                setResults(res.data);
            }
            return;
        }
        getVideo(keyword);
    },[keyword]);
    console.log(results);

    return (
        <div id="resultcontainer" className={[styles.pagecontent, "container-xl"].join(" ")}>
        <div className={[styles.searchresults].join(" ")}>
            {props.keyword?
        <h3 style={{color:"aliceblue",fontSize:"3vmin"}}>Search Result for {props.keyword} { results?results.map((res,key)=><div key={key} className={styles.resultcontainer}>
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
            <div id={"StartplayButton-"+res.url} onClick={()=>UsePlay(res.url)}>
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
            ):""}</h3>:""}
            <div className={styles.resultcontainer} id="resultpad" style={{height:"0px"}}></div>
        </div>
    </div>
    )
}
export function SearchResultComponent(props) {
    if(props?.keyword){
        return(
            <UseSearchSong keyword={props.keyword}/>
        )
    }else{
        return (
            <UseSearchSong />
    ); 
    }
}
