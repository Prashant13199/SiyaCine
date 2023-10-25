import React, { useEffect, useState } from 'react'
import './style.css'
import { useHistory } from 'react-router-dom'
import { auth, database } from '../../firebase';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme, IconButton } from '@mui/material'
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import FeaturedVideoIcon from '@mui/icons-material/FeaturedVideo';
import DoneIcon from '@mui/icons-material/Done';

export default function SingleContentScroll({ data, type, by, byuid, id }) {

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

  const removeSuggestion = () => {
    if (id) {
      database.ref(`/Users/${auth?.currentUser?.uid}/suggestions/${id}`).remove().then(() => {
        console.log('Suggestion Removed')
      }).catch((e) => console.log(e))
    }
  }

  return (
    <div>
      <div className='poster_relative'>
        <img
          src={data?.poster_path ? `https://image.tmdb.org/t/p/w500/${data?.poster_path}` : "https://www.movienewz.com/img/films/poster-holder.jpg"}
          alt={data?.title || data?.name}
          className="poster_scroll"
          onClick={() => history.push(`/singlecontent/${data.id}/${type ? type : data.media_type}`)}
        />
        {watchlist && <div className='watchlist_icon'><IconButton style={{ backgroundColor: theme.palette.background.default, padding: '4px' }}><DoneIcon style={{ fontSize: '14px' }} color="warning" /></IconButton></div>}
        {watched && <div className='watched_icon'><IconButton style={{ backgroundColor: theme.palette.background.default, padding: '4px' }}><FeaturedVideoIcon style={{ fontSize: '14px' }} color="warning" /></IconButton></div>}
      </div>
      {by && <div className='user'>
        <DeleteIcon color="error" style={{ cursor: 'pointer' }} onClick={() => removeSuggestion()} />
        <Link style={{ color: theme.palette.text.primary, textDecoration: 'none' }} to={`/user/${byuid}`}>{by}</Link>
      </div>}
    </div>
  )
}
