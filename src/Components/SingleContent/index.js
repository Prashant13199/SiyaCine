import React, { useEffect, useState } from 'react'
import './style.css'
import { useHistory } from 'react-router-dom'
import Grid from '@mui/material/Unstable_Grid2';
import { auth, database } from '../../firebase';
import { useTheme, IconButton } from '@mui/material'
import FeaturedVideoIcon from '@mui/icons-material/FeaturedVideo';
import DoneIcon from '@mui/icons-material/Done';

export default function SingleContent({ data, type }) {

  const history = useHistory()
  const theme = useTheme()
  const [watchlist, setWatchlist] = useState(false)
  const [watched, setWatched] = useState(false)

  useEffect(() => {
    database.ref(`/Users/${auth?.currentUser?.uid}/watched/${data.id}`).once('value', snapshot => {
      if (snapshot?.val()) {
        setWatched(true)
      }
    })
    database.ref(`/Users/${auth?.currentUser?.uid}/watchlist/${data.id}`).once('value', snapshot => {
      if (snapshot?.val()) {
        setWatchlist(true)
      }
    })
  }, [auth?.currentUser?.uid])

  return (
    <Grid xs={2} sm={4} md={4} key={data.id}>
      <div className='poster_relative'>
        <img
          src={data?.poster_path ? `https://image.tmdb.org/t/p/w500/${data?.poster_path}` : "https://www.movienewz.com/img/films/poster-holder.jpg"}
          alt={data?.title || data?.name}
          className="poster"
          onClick={() => history.push(`/singlecontent/${data.id}/${type ? type : data.media_type}`)}
        />
        {watchlist && <div className='watchlist_icon'><IconButton style={{ backgroundColor: theme.palette.background.default, padding: '4px' }}><DoneIcon style={{ fontSize: '14px' }} color="warning" /></IconButton></div>}
        {watched && <div className='watched_icon'><IconButton style={{ backgroundColor: theme.palette.background.default, padding: '4px' }}><FeaturedVideoIcon style={{ fontSize: '14px' }} color="warning" /></IconButton></div>}
      </div>
    </Grid>
  )
}
