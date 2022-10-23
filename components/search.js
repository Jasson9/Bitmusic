
import styles from "../styles/player.module.scss";
import DownloadDoneIcon from "@mui/icons-material/DownloadDoneRounded";
import { useState, useEffect } from "react";
import DownloadIcon from "@mui/icons-material/FileDownloadRounded";
import YouTubeIcon from "@mui/icons-material/YouTube";
import IconButton from "@mui/material/IconButton";
import PlayIcon from "@mui/icons-material/PlayCircle";
import CircularProgress from "@mui/material/CircularProgress";
import { parseTimeFromSeconds } from "../lib/timeparser";
import { getAudioInfo, fetchAudio } from './util'
import { deleteSong, getPlaylist, setPlaylist, addSong } from './db'

async function downloadSong(url,event) {
    event.preventDefault();
    event.stopPropagation();
    document.getElementById("DownloadIcon-" + url)?.setAttribute("hidden", "");
    document.getElementById("DownloadProgressIcon-" + url)?.removeAttribute("hidden");
    if (url) {
        var res = await getAudioInfo(url);
        var audiourl = null;
        if (!res) {
            throw "Request ajax request failed\n" + res;
        }
        if (res.needProxy) {
            audiourl = await fetchAudio(res.videoId, res.formats[res.formats.length - 1].itag);
        } else {
            res.formats.forEach(format => {
                if (/audio\/mp4/.test(format.mimeType)) {
                    audiourl = format.url;
                }
            })
        }
        if (audiourl) {
            document.getElementById("DownloadProgressIcon-" + url)?.setAttribute("hidden", "");
            document.getElementById("DownloadDoneIcon-" + url)?.removeAttribute("hidden");
            document.getElementById("DownloadDoneIcon-" + url)?.setAttribute("download", res.title + ".mp3");
            document.getElementById("DownloadDoneIcon-" + url)?.setAttribute("href", audiourl);
            document.getElementById("DownloadDoneIcon-" + url)?.click();
        }
        return {
            url: audiourl
        };

    }
}

const UseSearchSong = (props) => {
    const [keyword, setKeyword] = useState("");
    const [results, setResults] = useState();
    const [sources,setSources] = useState([]);
    const [sourceOption,setSourceoption] = useState([]);
    if (keyword != props.keyword) {
        setKeyword(props.keyword);
    }
    async function addToPlaylist(index, event) {
        console.log("play called " + index);
        event.preventDefault();
        event.stopPropagation();
        addSong(results[index].url, results[index].title, results[index].author, results[index].thumbnail, results[index].duration, results[index].source)        
        return
    }

    useEffect(() => {
        const getVideo = async (keyword) => {
            if (keyword) {
                document.getElementById("searchIcon")?.setAttribute("hidden", "");
                document.getElementById("searchingIcon")?.removeAttribute("hidden");
                var data = await fetch("/api/search", {
                    method: "POST",
                    body: JSON.stringify({
                        "query": keyword
                    }),
                }).catch(err => {
                    throw err;
                })
                var res = await data.json();
                document.getElementById("searchingIcon")?.setAttribute("hidden", "");
                document.getElementById("searchIcon")?.removeAttribute("hidden");
                setResults(res.data);
                setSources(res.source);
                setSourceoption(res.source);
                //console.log(res.data[0]);
                //setResultDisplay( res.data[Object.keys(res.data)[0]]);
            }
            // on mobile
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 540) {
                document.querySelector("#resultpad")?.setAttribute("style", "padding-top:50px");
                console.log("on mobile");
            } else {//on desktop
                document.getElementById("resultpad")?.removeAttribute("style");
            }
            return;
        }
        getVideo(keyword);
    }, [keyword]);
    console.log(results);
    function toggleSearchSource(source){
        var index = sourceOption.indexOf(source);
        var elm = document.getElementsByClassName(source);
        var toggle = document.getElementById(source);
        // if the source is displayed , remove
        if(index !== -1){
            for(var i = 0 ; i < elm.length; i ++){
                elm[i].setAttribute("hidden","");
                toggle.classList.remove(styles.toggleActive);
            }
            sourceOption.splice(index,1);
        }else{// if the source is not displayed , add
            for(var i = 0 ; i < elm.length; i ++){
                elm[i].removeAttribute("hidden");
                toggle.classList.add(styles.toggleActive);
            }
            sourceOption.push(source);
        } 
    }

    return (
        <div id="resultcontainer" className={[styles.pagecontent, "container-xl"].join(" ")}>
            <div className={[styles.searchresults].join(" ")}>
                {props.keyword ?
                    <h3 style={{ marginTop: "5px",color: "aliceblue", fontSize: "3vmin" }}>Search Result for {props.keyword} 
                    <div className={styles.searchResultSourceToggle}>
                        {sources?sources.map((source,index)=><><p id={source} className={[styles.searchResultSource,sourceOption.includes(source)?styles.toggleActive:""].join(" ")} key={index} onClick={()=>toggleSearchSource(source)}>{source.replaceAll("-"," ")}</p>{index != results.length-1?<div className={styles.searchResultToggleSeparator}></div>:""}</>):""}
                    </div>
                    {results ? results.map((res, key) => <div key={key} className={[styles.resultcontainer, res.source].join(" ")} >
                        <div className={styles.thumbnailcontainer}>
                            <img className={styles.resultthumbnail} src={res.thumbnail} onClick={(event) => addToPlaylist(key, event)} ></img>
                            <div className={styles.resultdurationtext}>{parseTimeFromSeconds(res.duration)}</div>
                        </div>
                        <div className={styles.resultdata}>
                            <div className={styles.resulttext}>
                                <div className={styles.resultTitle} onClick={(event) => addToPlaylist(key, event)} >{res.title}</div>
                                <div className={styles.resultAuthor}>{res.author}</div>
                            </div>
                            <div className={styles.resulticons}>
                                <div onClick={(event) => addToPlaylist(key, event)} style={{zIndex:"9"}}>
                                    <IconButton>
                                        <PlayIcon sx={{color:"white"}} />
                                    </IconButton>
                                </div>
                                <div onClick={(event) => downloadSong(res.url,event)} style={{zIndex:"9"}}  id={"DownloadIcon-" + res.url}>
                                    <IconButton>
                                        <DownloadIcon sx={{color:"white"}} />
                                    </IconButton>
                                </div>
                                <div id={"DownloadProgressIcon-" + res.url} style={{zIndex:"5"}}  hidden>
                                    <CircularProgress />
                                </div>
                                <a id={"DownloadDoneIcon-" + res.url} style={{zIndex:"5"}} hidden target={"_blank"} rel={"noreferrer"}>
                                    <IconButton>
                                        <DownloadDoneIcon sx={{color:"white"}} />
                                    </IconButton>
                                </a>
                                <a href={res.url} style={{zIndex:"5"}} target={"_blank"} rel={"noreferrer"}>
                                    <IconButton>
                                        <YouTubeIcon sx={{color:"white"}} />
                                    </IconButton>
                                </a>
                            </div>
                        </div>
                    </div>
                    ) : ""}</h3> : ""}
                <div className={styles.resultcontainer} id="resultpad" style={{ height: "0px" }}></div>
            </div>
        </div>
    )
}
export default function SearchResultComponent(props) {
    return (
        <UseSearchSong keyword={props?.keyword} />
    )
}
