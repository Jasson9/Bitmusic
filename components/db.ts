import Dexie, { Table } from 'dexie';

export interface Song{
    url :string;
    thumbnail:string;
    author:string;
    title:string;
    videoId:string;
    needProxy:string;
}
/**
export interface User {
  name: string;
  playlist: Array<Song>;
  volume: number;
  searchHistory: Array<string>;
}

export class MySubClassedDexie extends Dexie {
  // 'friends' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  songs!: Table<Song>; 

  constructor() {
    super('myDatabase');
    this.version(1).stores({
        songs: 'url, thumbnail, author, title, videoId, needProxy'
      });
  }
}

export const db = new MySubClassedDexie();
 */
