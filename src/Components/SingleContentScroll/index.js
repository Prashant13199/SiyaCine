import { useEffect, useState } from 'react'
import './style.css'
import { useHistory } from 'react-router-dom'
import { auth, database } from '../../firebase';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from '@mui/material'
import { Link } from 'react-router-dom';

export default function SingleContentScroll({ data, type, by, byuid, id, recom, userid, trending, index }) {

  const history = useHistory()
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
    </div>
  )
}
