/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import Head from 'next/head';
import type { NextPage } from 'next'
import styles from '../styles/player.module.scss'
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import { parseTimeFromSeconds } from '../lib/timeparser';
import Input from '@mui/material/Input';
import SearchIcon from '@mui/icons-material/Search';
import CircularProgress from '@mui/material/CircularProgress';
import { SongMetaData } from '../lib/interfaces';
//import {SearchResultComponent} from '../components/search.js'
import dynamic from 'next/dynamic';
export const Home: NextPage = (props:any) => {
const SearchResultComponent = dynamic(()=> import('../components/search.js'));
const PlayerComponent = dynamic(() => import('../components/player.js'));
const PlaylistComponent = dynamic(() => import('../components/playlist.js'));
const [hasMounted, setHasMounted] = React.useState(false);
React.useEffect(() => {
  setHasMounted(true);
}, [])
const [onMobile, setOnMobile] = React.useState<boolean>(false);
const [playList, setPlaylist] = React.useState<SongMetaData[]>([]);
const [playlistElement,setPlaylistElement] = React.useState<any>(<PlaylistComponent/>);
const [searchResult,setsearchResult] = React.useState<any>(<SearchResultComponent/>);
const [player,setPlayer] = React.useState<any>(<PlayerComponent url={props.url}/>);

/**
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
 */

//var searchResult = [];

const stop = ()=>{
    
}

function addplaylist(song:SongMetaData){
    var newLength = playList.length+1;
    console.log(newLength)
    setPlaylist(songs=>[...songs,song]);
    console.log(playList);
    return null;
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
        document.getElementById("playlistcontainer")?.setAttribute("hidden","");
        document.querySelector("#resultpad")?.setAttribute("style","padding-top:50px");
        //setPlayer(<PlayerComponent onMobile={true}/>)
        //document.getElementById("volumeon")?.setAttribute("onClick",`${changeVolume.name}(null,0)`);
        console.log("on mobile");
        setOnMobile(true);
       }else{//on desktop
            setOnMobile(false);//songMetaDataContainerAlt
            document.getElementById("resultpad")?.removeAttribute("style");
            document.getElementById("playlistcontainer")?.removeAttribute("hidden");
            //setPlayer(<PlayerComponent onMobile={false}/>)
        }
    console.log(window.innerHeight)
    console.log(window.innerWidth)
})

function Search(){
    var query:any = document.getElementById("searchinput");
    console.log("search query "+query.value);
    //console.log(<SearchResultComponent keyword={query.value}/>);
    setsearchResult(<SearchResultComponent keyword={query.value}/>);
    //return <SearchResultComponent keyword={query.value}/>
}


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
                                <div  onClick={Search}>
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
                  {searchResult}
                    <div id="playlistcontainer" className={[styles.playlistcontainer].join(" ")}>
                        <a className={styles.resizeBar} id="resizer" title={""} href={"javascript:void(0)"}></a>
                        {playlistElement}
                    </div>
                </div>
                {player}
            </div>
        </body>

    </div>
    
  )
  
}
export default Home
