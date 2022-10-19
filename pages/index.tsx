/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import Head from 'next/head';
import type { NextPage } from 'next'
import styles from '../styles/player.module.scss'
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import SearchIcon from '@mui/icons-material/Search';
import CircularProgress from '@mui/material/CircularProgress';
import { SongMetaData } from '../lib/interfaces';
//import {SearchResultComponent} from '../components/search.js'
import dynamic from 'next/dynamic';
export const Home: NextPage = (props:any) => {
const SearchResultComponent = dynamic(()=> import('../components/search.js'));
const PlaylistComponent = dynamic(() => import('../components/playlist.js'));
const PlayerComponent = dynamic(() => import('../components/player.js'));

const [hasMounted, setHasMounted] = React.useState(false);
React.useEffect(() => {
  setHasMounted(true);
}, [])
const [playlistElement,setPlaylistElement] = React.useState<any>(<PlaylistComponent/>);
const [searchResult,setsearchResult] = React.useState<any>(<SearchResultComponent/>);
const [player,setPlayer] = React.useState<any>(<PlayerComponent url={props.url}/>);

React.useEffect(()=>{
    document.addEventListener("drag",(res:any)=>{
        if(res?.target?.id == "resizer" && res.clientX != 0 ){
            var page = document.getElementById("resultcontainer");
            var playlist = document.getElementById("sidecontainer");
            page?.setAttribute("style",`width: ${Math.max(res.clientX,window.innerWidth-400)}px`)
            playlist?.setAttribute("style",`width: ${window.innerWidth-res.clientX}px`)
        }
    });
})

function Search(){
    var query:any = document.getElementById("searchinput");
    console.log("search query "+query.value);
    setsearchResult(<SearchResultComponent keyword={query.value}/>);
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
                  {playlistElement}
                </div>
                {player}
            </div>
        </body>

    </div>
    
  )
  
}
export default Home
