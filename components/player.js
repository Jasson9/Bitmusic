import Grid from '@mui/material/Grid';
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
import Popper from '@mui/material/Popper';
import Fade from '@mui/material/Fade';
import QueueMusicIcon from '@mui/icons-material/QueueMusicRounded';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import React from 'react';
import styles from '../styles/player.module.scss'
import { parseTimeFromSeconds } from '../lib/timeparser';
import { addSong, getPlaylist, deleteSong } from './db'
import { getAudioInfo, fetchAudio } from './util'
import $ from 'jquery';
export default class PlayerComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isPlaying: false,
            thumbnail: "",
            elapsedTime: 0,
            songLength: 0,
            url: "",
            volume: 30,
            title: "no music",
            author: "add music to playlist and start listening",
            open: false,
            anchorEl: null,
            canBeOpen: this.open && Boolean(anchorEl),
            id: this.canBeOpen ? 'transition-popper' : undefined,
            onMobile: null,
            isStopped: true,
            webmurl: "",
            mp4url: ""
        };
        this.updateSongLength = this.updateSongLength.bind(this);
        this.updateElapseTime = this.updateElapseTime.bind(this);
        this.play = this.play.bind(this);
        this.pause = this.pause.bind(this);
        this.changeVolume = this.changeVolume.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.preventHorizontalKeyboardNavigation = this.preventHorizontalKeyboardNavigation.bind(this);
        this.toggleMuteOrUnmute = this.toggleMuteOrUnmute.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        //this.directPlay = this.directPlay.bind(this);
        this.changePlaybackTime = this.changePlaybackTime.bind(this);
        this.fetchSongData = this.fetchSongData.bind(this);
        this.startPlay = this.startPlay.bind(this);
        this.onEnd = this.onEnd.bind(this);
        this.nextSong = this.nextSong.bind(this);
        this.clearSrc = this.clearSrc.bind(this);
    }
    async fetchSongData(url, autoplay) {
        if (url) {
            this.setState({ isStopped: true, title: "loading...", author: "loading...", thumbnail: "", elapsedTime: 0 });
            var res = await getAudioInfo(url).catch(err => {
                console.error(err);
            });
            var audioitag;
            var webm = [];
            var mp4;
            res.formats.forEach((format) => {
                if (/audio\/webm/.test(format.mimeType)) {
                    webm.push(format);
                } else {
                    if (/audio\/mp4/.test(format.mimeType)) {
                        mp4 = format;
                    }
                }
            })
            var audioelm = document.querySelector("#audioSource");
            var sourceurl;
            if (res.needProxy) {
                console.log("using Proxy " + res.videoId);
                var source;
                if (audioelm?.canPlayType('audio/webm') && webm.length >= 1) {
                    audioitag = webm[webm.length - 1].itag;
                    source = document.getElementById("webmSource");
                } else {
                    audioitag = mp4.itag;
                    source = document.getElementByUd("mp4Source");
                }
                var sourceurl = await fetchAudio(res.videoId, res.formats[res.formats.length - 1].itag);
                source.setAttribute("src", sourceurl);
            } else {
                console.log("Direct Download " + res.videoId);
                var source;
                if (audioelm?.canPlayType('audio/webm') && webm.length >= 1) {
                    source = document.getElementById("webmSource");
                    if (webm[1]) {
                        this.setState({ webmurl: webm[1].url });
                        //source.setAttribute("src",webm[1].url);
                    } else {
                        this.setState({ webmurl: webm[0].url });
                        //source.setAttribute("src",webm[0].url);
                    }
                } else {
                    if (mp4) {
                        this.setState({ mp4url: mp4.url });
                    } else {
                        console.error("No audio found on this video");
                        return null
                    }
                }
            }
            //will be changed for better logic
            audioelm.load();
            this.setState({
                url: sourceurl,
                author: res.author,
                title: res.title,
                thumbnail: res.thumbnail
            })
            if (autoplay == true) {
                this.play();
            }
            console.log(res);
            return res;
        } else {
            throw "no url"
        }
    }
    play(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        document.getElementById("play")?.setAttribute("hidden", "")
        document.getElementById("pause")?.removeAttribute("hidden")
        var elm = document.querySelector("#audioSource");
        elm.play();
        this.setState({
            isPlaying: true
        })
        console.log(this.state.isPlaying)
        elm.volume = this.state.volume / 100;
    }
    handleClick(event) {
        this.setState({ anchorEl: event.currentTarget });
        this.setState({ "open": !this.state.open });
    };
    static async getInitialProps() {
        return {}
    }


    pause(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        document.getElementById("pause")?.setAttribute("hidden", "")
        document.getElementById("play")?.removeAttribute("hidden")
        var elm = document.querySelector("#audioSource");
        elm.pause();
        this.setState({ isPlaying: false });
    }
    clearSrc(){
        var webm = document.getElementById("webmSource");
        var mp4 = document.getElementById("mp4Source");
        var audio = document.getElementById("audioSource");
        audio.pause();
        webm.setAttribute("src","");
        mp4.setAttribute("src","");
        audio.load();
    }

    onEnd() {
        this.pause();
        this.setState({ isStopped: true, title: "", author: "", thumbnail: "", url: "", elapsedTime: 0, songLength:0,webmurl: "" , mp4url:""});
        this.clearSrc();
        //this.setState({isStopped:true})
        console.log(this.state.isStopped)
        var playlist = deleteSong(0);
        if (playlist == null || playlist.length == 0) {
            this.setState({ isStopped: true, title: "no music", author: "add music to playlist and start listening", thumbnail: "", url: "", elapsedTime: 0, songLength:0,webmurl: "" , mp4url:""});
            return
        }
        this.fetchSongData(playlist[0]?.url, true);
        this.setState({ isStopped: false });
        window.dispatchEvent(new Event("songChange"));
    }

    startPlay(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        //&& playlist != null && playlist[0]
        console.log("is stopped: " + this.state.isStopped);
        var playlist = getPlaylist();
        if (this.state.isStopped == true && this.state.isPlaying == false && this.state.url == "") {
            console.log(playlist);
            this.fetchSongData(playlist[0]?.url, true);
            this.setState({ isStopped: false });
            window.dispatchEvent(new Event("songChange"));
        }
    }

    nextSong(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        var playlist = getPlaylist();
        this.pause();
        this.setState({ isStopped: true });
        var playlist = deleteSong(0);
        if (playlist != null && playlist.length >= 1) {
            this.setState({ isStopped: true, title: "loading...", songLength:0, author: "", thumbnail: "", url: "", elapsedTime: 0, webmurl: "" , mp4url:""});
            this.fetchSongData(playlist[0]?.url, true);
            this.setState({ isStopped: false });
            window.dispatchEvent(new Event("songChange"));
        } else {
            if (playlist?.length == 0) {
                this.clearSrc();
                this.setState({ isStopped: true, title: "no music", author: "add music to playlist and start listening", songLength:0 ,thumbnail: "", url: "", elapsedTime: 0, webmurl: "" , mp4url:""});
                //pop up message no songs left and stop player;
            }
        }
    }

    updateSongLength(event) {
        this.setState({ songLength: event.target.duration });
    }

    updateElapseTime(event) {
        this.setState({ elapsedTime: event.target.currentTime });
    }

    changePlaybackTime(event, Value) {
        var time = (this.state.songLength) * Value / 100;
        var elm = document.querySelector("#audioSource");
        elm.pause();
        elm.currentTime = time;
        this.setState({ elapsedTime: time });
        setTimeout(() => {
            if (this.state.isPlaying) {
                this.play();
            }
        }, 500)

    }

    changeVolume(event, newValue) {
        var elm = document.querySelector("#audioSource");
        if (newValue == 0) {
            document.getElementById("volumeon")?.setAttribute("hidden", "")
            document.getElementById("volumeoff")?.removeAttribute("hidden")
        } else {
            document.getElementById("volumeoff")?.setAttribute("hidden", "")
            document.getElementById("volumeon")?.removeAttribute("hidden")
        }
        if (newValue == NaN || newValue == undefined) {
            newValue = 30;
        }
        elm.volume = newValue / 100;
        this.setState({ volume: newValue });
    };

    preventHorizontalKeyboardNavigation(event) {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault();
        }
    }
    toggleMuteOrUnmute(event) {
        if (this.state?.onMobile && event.type != "keydown") {
            this.handleClick(event);
        } else {
            if (this.state.volume == 0) {
                this.changeVolume(null, 50);
            } else {
                this.changeVolume(null, 0);
            }
        }
    }
    componentDidMount() {
        window.addEventListener('addSong', (event) => this.startPlay(event));
        window.addEventListener("keydown",(event)=>{
            console.log(event);
            event.stopPropagation();
            if(event.target.id != "searchinput" && !event.repeat){
                switch(event.keyCode){
                    case 32:
                        if(this.state.isPlaying==false){
                            this.play(event);
                        }else{
                            this.pause(event);
                        }
                        break;
                    case 77:
                        this.toggleMuteOrUnmute(event);
                        break;
                }
            }
        }) 
        console.log("mount")
        var song = getPlaylist();
        if (song != null && song[0]?.url) {
            this.setState({
                url: song[0].url,
                songLength: song[0].duration,
                thumbnail: song[0].thumbnail,
                author: song[0].author,
                title: song[0].title
            });
            window.dispatchEvent(new Event("songChange"));
            this.fetchSongData(song[0].url, false);
        }
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 540) {
            this.setState({ onMobile: true });
            document.querySelector("#volumeslider")?.setAttribute("hidden", "");
            document.querySelector("." + styles.musicMetaDataContainer)?.setAttribute("hidden", "");
            document.querySelector("#songMetaDataContainerAlt")?.removeAttribute("hidden");
            document.querySelector("#sideButtonsAlt")?.removeAttribute("hidden");
            console.log("mobile")
        } else {
            console.log("desktop");
            document.querySelector("#sideButtonsAlt")?.setAttribute("hidden", "");
            document.querySelector("#songMetaDataContainerAlt")?.setAttribute("hidden", "")
            document.querySelector("." + styles.musicMetaDataContainer)?.removeAttribute("hidden")
            document.querySelector("#volumeslider")?.removeAttribute("hidden");
            this.setState({ onMobile: false });
        }
    }

    togglePlaylist(event) {
        event.preventDefault();
        event.stopPropagation();
        window.dispatchEvent(new Event("togglePlaylist"));
    }

    render() {
        return (<div id="musicplayer">
            <div className={styles.songMetaDataContainerAlt} id="songMetaDataContainerAlt" hidden>
                <div className={styles.songInfoContainer}>
                    {this.state.thumbnail?<img id={styles.thumbnailAlt} src={this.state.thumbnail} alt="thumbnail"></img>:""}
                    <div className={styles.musicInfoContainer}>
                        <div id={styles.songtitleAlt}>{this.state.title}</div>
                        <div id={styles.authorAlt}>{this.state.author}</div>
                    </div>
                </div>
                <div id="playlistbtnAlt" onClick={(event) => this.togglePlaylist(event)}>
                    <IconButton sx={{color:"white"}} aria-label="Show Playlist">
                        <QueueMusicIcon sx={{color:"white"}}/>
                    </IconButton>
                </div>
            </div>
            <div className={[styles.playercontainer].join(" ")}>
                <div className={[styles.playercontents].join(" ")}>
                    <div className={[styles.playertrack].join(" ")}>
                        <Stack spacing={1} direction="row" alignItems="center" sx={{ width: "75%" }}>
                            <output id="length">{parseTimeFromSeconds(this.state.elapsedTime.toString())}</output>
                            <Slider style={{ padding: "8px" }} id="playbackslider" size='small' aria-label="playback" value={this.state.elapsedTime?(this.state.elapsedTime / this.state.songLength) * 100:0} onChange={(event, newValue) => this.changePlaybackTime(event, newValue)} />
                            <output id="length">{parseTimeFromSeconds(this.state.songLength.toString())}</output>
                        </Stack>
                        <audio id="audioSource" hidden preload='metadata' onTimeUpdate={this.updateElapseTime} onLoadedMetadata={this.updateSongLength} onEnded={this.onEnd}>
                            <source id='webmSource' src={this.state.webmurl} type='audio/webm' />
                            <source id="mp4Source" src={this.state.mp4url} type='audio/mp4' />
                        </audio>
                    </div>
                    <Grid container spacing={0} alignContent={"center"} flexWrap={"nowrap"} alignItems={"center"} justifyContent={"center"}>
                        <div className={styles.musicMetaDataContainer}>
                            <img id={styles.thumbnail} src={this.state.thumbnail}></img>
                            <div className={styles.musicInfoContainer}>
                                <div id={styles.songtitle}>{this.state.title}</div>
                                <div id={styles.author}>{this.state.author}</div>
                            </div>
                        </div>
                        <div className={styles.sideButtonsAlt} id="sideButtonsAlt" hidden>
                            <IconButton  aria-label="More">
                                <MoreHorizIcon sx={{color:"white"}}/>
                            </IconButton>
                        </div>
                        <Grid item xs={4}>
                            <Stack spacing={0} direction="row" alignItems="center" justifyContent={"center"}>
                                <span>
                                    <IconButton sx={{ padding: "4px" }}  aria-label="Previous">
                                        <PreviousIcon sx={{color:"white"}} fontSize="large" />
                                    </IconButton>
                                </span>
                                <span id="play" onClick={(event) => this.play(event)}>
                                    <IconButton sx={{ padding: "4px" }} aria-label="Play">
                                        <PlayIcon sx={{color:"white"}} fontSize='large' />
                                    </IconButton>
                                </span>
                                <span id="pause" onClick={(event) => this.pause(event)} aria-label="Pause" hidden>
                                    <IconButton sx={{ padding: "4px" }}>
                                        <PauseIcon sx={{color:"white"}} fontSize='large' />
                                    </IconButton>
                                </span>
                                <span onClick={(event) => this.nextSong(event)}>
                                    <IconButton sx={{ padding: "4px" }} aria-label="Next">
                                        <NextIcon sx={{color:"white"}} fontSize="large" />
                                    </IconButton>
                                </span>
                            </Stack>
                        </Grid>
                        <Grid item xs={4}>
                            <Stack spacing={1} direction="row" alignItems="center" justifyContent={"flex-end"}>
                                <div onClick={this.toggleMuteOrUnmute}>
                                    <span id="volumeon" >
                                        <IconButton aria-label="Volume On">
                                            <VolumeUp sx={{color:"white"}} />
                                        </IconButton>
                                    </span>
                                    <span id="volumeoff" onClick={this.toggleMuteOrUnmute} aria-label="Volume Off" hidden>
                                        <IconButton >
                                            <VolumeOff sx={{color:"white"}} />
                                        </IconButton>
                                    </span>
                                </div>
                                <div>
                                    <Popper style={{ "z-index": "12" }} id={this.state.id} open={this.state.open} anchorEl={this.state.anchorEl} transition>
                                        {({ TransitionProps }) => (
                                            <Fade {...TransitionProps} timeout={200}>
                                                <Box sx={{ height: 200, backgroundColor: "#33296d", borderRadius: "50px", padding: "10px", paddingLeft: "5px", paddingRight: "5px" }} >
                                                    <Slider
                                                        sx={{
                                                            '& input[type="range"]': {
                                                                WebkitAppearance: 'slider-vertical',
                                                            },
                                                        }}
                                                        id="volslider"
                                                        orientation="vertical"
                                                        value={this.state.volume}
                                                        onChange={(event, newValue) => this.changeVolume(event, newValue)}
                                                        aria-label="Volume"
                                                        valueLabelDisplay="auto"
                                                        onKeyDown={(event) => this.preventHorizontalKeyboardNavigation(event)}
                                                    />
                                                </Box>
                                            </Fade>
                                        )}
                                    </Popper>
                                </div>
                                <Slider aria-label="Volume" value={this.state.volume} onChange={(event, newValue) => this.changeVolume(event, newValue)} id="volumeslider" sx={{ maxWidth: "240px" }} />
                                <output id="volume-output">{this.state.volume}</output>
                            </Stack>
                        </Grid>
                    </Grid>
                </div>
            </div>
        </div>);
    }
}