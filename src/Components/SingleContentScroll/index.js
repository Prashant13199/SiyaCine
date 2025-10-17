import React, { useEffect, useState } from 'react'
import './style.css'
import { useHistory } from 'react-router-dom'
import { auth, database } from '../../firebase';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from '@mui/material'
import { Link } from 'react-router-dom';
import { Zoom } from '@mui/material';
import TvIcon from '@mui/icons-material/Tv';
import axios from "axios";

export default function SingleContentScroll({ data, type, by, byuid, id, recom, userid, showIcon, trending, index }) {

  const history = useHistory()
  const [checked, setChecked] = useState(false)
  const [show, setShow] = useState(true)
  const [lastPlayed, setLastPlayed] = useState()
  const [watchprovider, setWatchProvider] = useState({})

  useEffect(() => {
    fetchProvider()
  }, [id])

  useEffect(() => {
    setTimeout(() => {
      setChecked(true)
    }, index * 100)
  }, [index])

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

  const fetchProvider = async () => {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/${type}/${id}/watch/providers?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
      );
      if (data.results?.IN?.flatrate) {
        setWatchProvider({ path: data.results?.IN?.flatrate[0] ? data.results?.IN?.flatrate[0]?.logo_path : '', link: data.results?.IN ? data.results?.IN?.link : '' });
      }
    }
    catch (e) {
      console.log(e)
    }
  };

  return show && data?.poster_path && (
    <Zoom in={checked} {...({ timeout: 800 })}>
      <div className='single_content_scroll'>
        <div className={trending && 'trending_flex_count'}>
          {trending && <div className='trending_count'>
            {index}
          </div>}
          <img
            loading='lazy'
            src={data?.poster_path ? `https://image.tmdb.org/t/p/w500/${data?.poster_path}` : "https://www.movienewz.com/img/films/poster-holder.jpg"}
            alt={data?.title || data?.name}
            className={trending ? "poster_scroll_trending" : "poster_scroll"}
            onClick={() => history.push(`/singlecontent/${data.id}/${type ? type : data.media_type}`)}
          />
        </div>
        {by && <div>
          <div className='user'>
            <Link style={{ textDecoration: 'none', marginLeft: '5px', color: 'rgb(255, 167, 38)' }} to={`/user/${byuid}`}>{by?.split('@')[0]}</Link>
          </div>
          <Button startIcon={<DeleteIcon />} size='small' onClick={() => removeSuggestion()} className='button_suggestion' variant='contained'>remove</Button>
        </div>}
        {(userid && type === 'tv' && lastPlayed) && <div className='userlastplayed'>
          S{lastPlayed.season}&nbsp;E{lastPlayed.episode}
        </div>}
        {watchprovider && !trending && <div className='platform'><img alt="" src={`https://image.tmdb.org/t/p/w500/${watchprovider.path}`} className='platform_icon' /></div>}
        {showIcon &&
          <>
            {type === 'tv' && data && <div className='searchtv'><TvIcon sx={{ fontSize: '14px', color: 'rgb(255, 167, 38)' }} /></div>}
          </>
        }
      </div>
    </Zoom>
  )
}
