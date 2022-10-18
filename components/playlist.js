/* eslint-disable @next/next/no-img-element */
import React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import List from '@mui/joy/List';
import ListDivider from '@mui/joy/ListDivider';
import ListItem from '@mui/joy/ListItem';
import ListItemContent from '@mui/joy/ListItemContent';
import ListItemButton from '@mui/joy/ListItemButton';
import {getPlaylist} from './db'
export default class PlaylistComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            songs : getPlaylist()
        }
        this.componentDidMount = this.componentDidMount.bind(this);
        this.refreshSongs = this.refreshSongs.bind(this);
    }
    refreshSongs(){
        this.setState({
            songs : getPlaylist()
        })
    }
    componentDidMount(){
        window.addEventListener("addSong",this.refreshSongs)
        window.addEventListener("deleteSong",this.refreshSongs)
    }

    render(){
        return(
        <Sheet
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            width: 500,
            borderRadius: 'sm',
          }}
        >
          <List sx={{ py: 'var(--List-divider-gap)' }}>
          <Typography fontWeight="h2">Playlist</Typography>
            {this.state.songs?this.state.songs.map((item, index) => (
              <React.Fragment key={item.title}>
                <ListItem>
                  <ListItemButton sx={{ gap: 1 }}>
                    <AspectRatio
                      sx={{ flexBasis: 120, borderRadius: 'sm', overflow: 'auto' }}
                    >
                      <img
                        src={`${item.thumbnail}?w=80&fit=crop&auto=format`}
                        srcSet={`${item.thumbnail}?w=80&fit=crop&auto=format&dpr=2 2x`}
                        alt={item.title}
                      />
                    </AspectRatio>
                    <ListItemContent>
                      <Typography fontWeight="body2">{item.title}</Typography>
                      <Typography level="body3">{item.author}</Typography>
                    </ListItemContent>
                  </ListItemButton>
                </ListItem>
                {index !== this.state.songs.length - 1 && <ListDivider />}
              </React.Fragment>
            )):""}
          </List>
        </Sheet>
      )};
}