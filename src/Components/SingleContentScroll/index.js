import React, { useEffect, useState } from 'react'
import './style.css'
import { useHistory } from 'react-router-dom'
import { auth, database } from '../../firebase';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, useTheme } from '@mui/material'
import { Link } from 'react-router-dom';
import TvIcon from '@mui/icons-material/Tv';

export default function SingleContentScroll({ data, type, by, byuid, id, recom, userid, showtv, trending, index }) {

  const history = useHistory()
  const theme = useTheme()
  const [show, setShow] = useState(true)
  const [lastPlayed, setLastPlayed] = useState()

  useEffect(() => {
    if (recom) {
      database.ref(`/Users/${auth?.currentUser?.uid}/watched/${id}`).on('value', snapshot => {
        if (snapshot?.val()?.id) {
          setShow(false)
        } else {
          setShow(true)
        }
      })
    }
  }, [auth?.currentUser?.uid, recom, id])

  useEffect(() => {
    if (userid) {
      database.ref(`/Users/${userid}/watching/${id}`).on('value', snapshot => {
        if (snapshot.val()?.season && snapshot.val()?.episode) {
          setLastPlayed({ season: snapshot.val()?.season, episode: snapshot.val()?.episode })
        } else {
          setLastPlayed()
        }
      })
    }
  }, [userid, id])

  const removeSuggestion = () => {
    if (id) {
      database.ref(`/Users/${auth?.currentUser?.uid}/suggestions/${id}`).remove().then(() => {
      }).catch((e) => console.log(e))
    }
  }

  return show && data?.poster_path && (
    <div className='single_content_scroll' key={id}>
      <div className={trending && 'trending_flex_count'}>
        {trending && <div className='trending_count'>
          {index}
        </div>}
        <img
          src={data?.poster_path ? `https://image.tmdb.org/t/p/w500/${data?.poster_path}` : "https://www.movienewz.com/img/films/poster-holder.jpg"}
          alt={data?.title || data?.name}
          className="poster_scroll"
          onClick={() => history.push(`/singlecontent/${data.id}/${type ? type : data.media_type}`)}
        />
      </div>
      {by && <div className='user'>
        <IconButton style={{ backgroundColor: theme.palette.background.default }} onClick={() => removeSuggestion()}>
          <DeleteIcon color="error" style={{ cursor: 'pointer' }} fontSize='small' />
        </IconButton>
        <Link style={{ textDecoration: 'none', marginLeft: '5px', color: 'rgb(255, 167, 38)' }} to={`/user/${byuid}`}>{by?.split('@')[0]}</Link>
      </div>}
      {(userid && type === 'tv' && lastPlayed) && <div className='userlastplayed'>
        S{lastPlayed.season}&nbsp;E{lastPlayed.episode}
      </div>}
      {showtv && type === 'tv' && <div className='searchtv'><TvIcon sx={{ fontSize: '16px', color: 'rgb(255, 167, 38)' }} /></div>}
    </div>
  )
}
