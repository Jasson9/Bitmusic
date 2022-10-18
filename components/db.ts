import Dexie, { Table } from 'dexie';

export interface Song{
    url :string;
    thumbnail:string;
    author:string;
    title:string;
    duration:number;
}

export function getPlaylist():Array<Song>|null{
  var data:any = localStorage.getItem("playlist");
  if(!data){
    return null
  }
  try{
  var playlist:Array<Song> = JSON.parse(data);
  }catch(err){
    console.error(err);
    return null;
  }
  if(playlist){
    return playlist;
  }
  return null;
}

export function createPlaylist(){
  try{
    localStorage.setItem("playlist",JSON.stringify([]));
  }catch(err){
    console.error(err);
    return false;
  }
  return true;
}

export function setPlaylist(Playlist:Array<Song>|null){
  if(Playlist == null){
    return null;
  }
  localStorage.setItem("playlist",JSON.stringify(Playlist));
  return Playlist;
} 

export function addSong(url:string,title:string,author:string,thumbnail:string,duration:string){
  var playlist:Array<Song>|null;
  playlist = getPlaylist();
  if(playlist == null){
    createPlaylist();
  }
  playlist = getPlaylist();
  playlist?.push({url:url,title:title,author:author,thumbnail:thumbnail,duration:parseInt(duration)});
  setPlaylist(playlist);
  window.dispatchEvent( new Event('addSong') )
  return playlist;
}

export function deleteSong(index:number){
  var playlist:Array<Song>|null = getPlaylist();
  if(playlist==null){
    return
  }
  playlist.splice(index,1);
  setPlaylist(playlist);
  window.dispatchEvent( new Event('deleteSong') )
  return playlist;
}
