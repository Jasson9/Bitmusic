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
            title: ""
        }
        this.componentDidMount = this.componentDidMount.bind(this);
        this.refreshSongs = this.refreshSongs.bind(this);
        this.switchToLyrics = this.switchToLyrics.bind(this);
        this.switchToPlaylist = this.switchToPlaylist.bind(this);
        this.refreshLyrics = this.refreshLyrics.bind(this);
        this.toggleDisplayLyrics = this.toggleDisplayLyrics.bind(this);
    }
    refreshSongs() {
        this.setState({
            songs: getPlaylist(),
        })
    }
    async refreshLyrics() {
        var pl = getPlaylist();
        this.setState({
            title: pl[0] ? pl[0].title + "\r\n" : "",
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
                    displayLyrics: lyrics.data[0].text,
                    option: lyrics.data ?
                        lyrics.data.map((res, key) =>
                            <div className={styles.lyricsLanguangeOption} key={key} onClick={() => this.toggleDisplayLyrics(key)}>{res.lang}</div>
                        ) : <div></div>
                })
            } catch (err) {
                this.setState({
                    displayLyrics: "cannot found the lyrics"
                })
                console.error(err);
            }
        } else {
            this.setState({
                displayLyrics: "no song"
            })
        }
    }

    componentDidMount() {
        //peformace wise???
        window.addEventListener("addSong", this.refreshSongs);
        window.addEventListener("deleteSong", this.refreshSongs);
        window.addEventListener("songChange", this.refreshLyrics);
        this.refreshLyrics();
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 540) {
            $("#sidecontainer").removeClass(styles.playlistcontainer);
            $("#sidecontainer").addClass(styles.playlistcontainermobile);
            this.setState({ onMobile: true });
        } else {
            $("#sidecontainer").removeClass(styles.playlistcontainermobile);
            $("#sidecontainer").addClass(styles.playlistcontainer);
            this.setState({ onMobile: false });
        }
    }
    switchToLyrics() {
        document.getElementById("playlistcontainer").setAttribute("hidden", "");
        document.getElementById("lyricscontainer").removeAttribute("hidden");
    }
    switchToPlaylist() {
        document.getElementById("lyricscontainer").setAttribute("hidden", "");
        document.getElementById("playlistcontainer").removeAttribute("hidden");
    }
    toggleDisplayLyrics(index) {
        this.setState({
            displayLyrics: this.state.lyrics[index].text
        });
    }

    render() {
        return (
            <div id="sidecontainer" className={[styles.playlistcontainer].join(" ")}>
                <a className={styles.resizeBar} id="resizer" title={""} href={"javascript:void(0)"}></a>
                <div className={styles.playlistContents}>
                    <div className={styles.playlistHeadNav}>
                        <div className={styles.playlistNavButton} onClick={() => this.switchToPlaylist()}>
                            <h2>Playlist</h2>
                        </div>
                        <div className={styles.playlistNavButton} onClick={() => this.switchToLyrics()}>
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
                        <span style={{ "whiteSpace": "pre-line" }}>{this.state.title}{this.state.displayLyrics}</span>
                    </div>
                </div>
            </div>


        )
    };
}