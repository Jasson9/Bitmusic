/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Sheet from '@mui/joy/Sheet';
import List from '@mui/joy/List';
import ListDivider from '@mui/joy/ListDivider';
import ListItem from '@mui/joy/ListItem';
import ListItemContent from '@mui/joy/ListItemContent';
import ListItemButton from '@mui/joy/ListItemButton';
import { getPlaylist, deleteSong } from './db';
import styles from '../styles/player.module.scss';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/ClearRounded';
import $ from 'jquery';
import Slide from '@mui/material/Slide';
var reg = new RegExp(/[?]v=(.+)/);
export default class PlaylistComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            songs: getPlaylist(),
            onMobile: null,
            lyrics: [],
            displayLyrics: "nothing here",
            option: <div></div>,
            title: "",
            showPlaylist: false
        }
        this.componentDidMount = this.componentDidMount.bind(this);
        this.refreshSongs = this.refreshSongs.bind(this);
        this.switchToLyrics = this.switchToLyrics.bind(this);
        this.switchToPlaylist = this.switchToPlaylist.bind(this);
        this.refreshLyrics = this.refreshLyrics.bind(this);
        this.toggleDisplayLyrics = this.toggleDisplayLyrics.bind(this);
        this.handlePlaylistToggle = this.handlePlaylistToggle.bind(this);
        this.onResizerDrag = this.onResizerDrag.bind(this);
    }
    refreshSongs() {
        this.setState({
            songs: getPlaylist(),
        })
    }
    async refreshLyrics() {
        var pl = getPlaylist();
        this.setState({
            title: pl?.length > 0 ? pl[0].title + "\r\n" : "",
            lyrics: new Array(),
            option: <div></div>
        })
        if (pl?.length > 0) {
            this.setState({
                displayLyrics: "loading"
            })
            console.log("getting lyrics");
            try {
                var id = reg.exec(pl[0].url)[1];
                var res = await fetch("/api/getLyrics", {
                    method: "POST",
                    body: JSON.stringify({ id: id })
                })
                var lyrics = await res.json();
                console.log(lyrics.data)
                this.setState({
                    lyrics: lyrics.data,
                    displayLyrics: lyrics.data.length>0?lyrics.data[0].text:"no lyrics found",
                    option: lyrics.data ?
                        lyrics.data.map((res, key) =>
                            <div className={styles.lyricsLanguangeOption} key={key} onClick={() => this.toggleDisplayLyrics(key)}>{res.lang}</div>
                        ) : <div></div>
                })
            } catch (err) {
                this.setState({
                    displayLyrics: "error when getting lyrics"
                })
                console.error(err);
            }
        } else {
            this.setState({
                displayLyrics: "no song"
            })
        }
    }

    handlePlaylistToggle(){
        this.setState({
            showPlaylist: !this.state.showPlaylist
        }) ;
      };
    onResizerDrag(elm){
        console.log("move");
        if (document.getElementById("resizer")) {
            document.getElementById("resizer").onmousedown = console.log("move");
          } else {
            elm.onmousedown = dragMouseDown;
          }
        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            //pos3 = e.clientX;
            // pos4 = e.clientY;
            // document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            // document.onmousemove = elementDrag;
          }
    }

    componentDidMount() {
        //peformace wise???
        window.addEventListener("addSong", this.refreshSongs);
        window.addEventListener("deleteSong", this.refreshSongs);
        window.addEventListener("songChange", this.refreshLyrics);
        window.addEventListener("togglePlaylist", this.handlePlaylistToggle);
        this.refreshLyrics();
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 540) {
            $("#sidecontainer").removeClass(styles.playlistcontainer);
            $("#sidecontainer").addClass(styles.playlistcontainermobile);
            $("."+styles.playlistContents).attr("style","max-width:100%;")
            this.setState({ onMobile: true });
        } else {
            $("#sidecontainer").removeClass(styles.playlistcontainermobile);
            $("#sidecontainer").addClass(styles.playlistcontainer);
            this.setState({ onMobile: false });
        }
        var elm = document.getElementById("resizer");
        /**
        document.addEventListener("mousedown",(event)=>{
            //elm.onmousedown = this.onResizerDrag();
            event.preventDefault();
            if(event?.target?.id == "resizer" && event.clientX != 0 ){
                console.log(event)
                var page = document.getElementById("resultcontainer");
                var playlist = document.getElementById("sidecontainer");
                page?.setAttribute("style",`width: ${Math.max(event.clientX,window.innerWidth-400)}px`);
                playlist?.setAttribute("style",`width: ${window.innerWidth-event.clientX}px`)
            }
        }); */
    }
    switchToLyrics() {
        document.getElementById("playlistcontainer").setAttribute("hidden", "");
        document.getElementById("lyricscontainer").removeAttribute("hidden");
        document.getElementById("lyricsToggle").classList.add(styles.toggleActive);
        document.getElementById("playlistToggle").classList.remove(styles.toggleActive);
    }

    switchToPlaylist() {
        document.getElementById("lyricscontainer").setAttribute("hidden", "");
        document.getElementById("playlistcontainer").removeAttribute("hidden");
        document.getElementById("lyricsToggle").classList.remove(styles.toggleActive);
        document.getElementById("playlistToggle").classList.add(styles.toggleActive);
    }

    toggleDisplayLyrics(index) {
        this.setState({
            displayLyrics: this.state.lyrics[index].text
        });
    }

    render() {
        return (
            <Slide direction="up" in={this.state.onMobile?this.state.showPlaylist:true} mountOnEnter>
            <div id="sidecontainer" className={[this.state.onMobile?styles.playlistcontainermobile:styles.playlistcontainer].join(" ")}>
                <div className={styles.resizeBar} id="resizer" title={""} ></div>
                <div className={styles.playlistContents}>
                    <div className={styles.playlistHeadNav}>
                        <div className={[styles.playlistNavButton,styles.toggleActive].join(" ")} id="playlistToggle" onClick={() => this.switchToPlaylist()}>
                            <h2>Playlist</h2>
                        </div>
                        <div style={{width:"1px",height:"40px",backgroundColor:"#06060661"}}></div>
                        <div className={styles.playlistNavButton} id="lyricsToggle" onClick={() => this.switchToLyrics()}>
                            <h2>Lyric</h2>
                        </div>
                    </div>
                    <div className={styles.playlistSongsContainer} id="playlistcontainer">
                        <Sheet
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1,
                                borderRadius: 'sm',
                            }}
                        >
                            <List sx={{ py: 'var(--List-divider-gap)' }}>
                                {this.state.songs ? this.state.songs.map((item, index) => (
                                    <React.Fragment key={item.title + "-" + index}>
                                        <ListItem>
                                            <ListItemButton sx={{ gap: 1 }}>
                                                <div className={styles.playlistThumbcontainer}>
                                                    <img
                                                        className={styles.playlistThumb}
                                                        src={`${item.thumbnail}`}
                                                        srcSet={`${item.thumbnail}`}
                                                        alt={item.title}
                                                    />
                                                </div>
                                                <ListItemContent>
                                                    <p className={this.state.onMobile ? styles.playlistSongTitleAlt : styles.playlistSongTitle}>{item.title}</p>
                                                    <p className={this.state.onMobile ? styles.playlistSongAuthorAlt : styles.playlistSongAuthor}>{item.author}</p>
                                                </ListItemContent>
                                                {index == 0 ? "" :
                                                    <IconButton onClick={() => deleteSong(index)}>
                                                        <ClearIcon />
                                                    </IconButton>
                                                }
                                            </ListItemButton>
                                        </ListItem>
                                        {index !== this.state.songs.length - 1 && <ListDivider />}
                                    </React.Fragment>
                                )) : ""}
                            </List>
                        </Sheet>
                    </div>
                    <div className={styles.lyricsContainer} id="lyricscontainer" hidden>
                        <div className={styles.lyricsLanguangeChooser}>
                            {this.state.option}
                        </div>
                        <span className={styles.lyrics} style={{ "whiteSpace": "pre-line" }}>{this.state.title}{this.state.displayLyrics}</span>
                    </div>
                </div>
            </div>
            </Slide>

        )
    };
}