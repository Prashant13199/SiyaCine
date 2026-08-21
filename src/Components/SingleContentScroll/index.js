import { useEffect, useState } from 'react'
import './style.css'
import { useHistory } from 'react-router-dom'
import { auth, database } from '../../firebase';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from '@mui/material'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getCurrentDate, getRelativeDateString } from '../../Services/time';
import { Modal } from 'react-bootstrap';
import { IconButton } from '@mui/material';
import { useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { getTimeLeft } from '../../Services/utlitities';

export default function SingleContentScroll({ data, type, by, byuid, id, recom, userid, trending, index, comment }) {

  const history = useHistory()
  const theme = useTheme()
  const [show, setShow] = useState(true)
  const [lastPlayed, setLastPlayed] = useState()
  const [duration, setDuration] = useState(0)
  const [left, setLeft] = useState(0)
  const [upcoming, setUpcoming] = useState(false)
  const [show2, setShow2] = useState(false)
  const [upcomingDate, setUpcomingDate] = useState('')

  useEffect(() => {
    if (recom) {
      database.ref(`/Users/${auth?.currentUser?.uid}/watched/${id}`).once('value', snapshot => {
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
      database.ref(`/Users/${userid}/watching/${id}`).once('value', snapshot => {
        if (snapshot.val()) {
          setLastPlayed({ season: snapshot.val()?.season ? snapshot.val()?.season : 1, episode: snapshot.val()?.episode ? snapshot.val()?.episode : 1 })
          setDuration((snapshot.val()?.currentTime / snapshot.val()?.duration) * 100)
          setLeft(snapshot.val()?.duration - snapshot.val()?.currentTime)
        }
      })
    }
  }, [userid, id])

  useEffect(() => {
    type == "tv" && fetchReleaseDate()
  }, [type, id, userid, lastPlayed])

  const fetchReleaseDate = async () => {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.REACT_APP_API_KEY}`
      );
      if (data?.next_episode_to_air?.air_date > getCurrentDate() && data?.next_episode_to_air?.episode_number == lastPlayed?.episode && data?.next_episode_to_air?.season_number == lastPlayed?.season) {
        setUpcomingDate(data?.next_episode_to_air?.air_date)
        setUpcoming(true)
      }
    } catch (e) {
      console.log(e)
    }
  }

  const removeSuggestion = () => {
    if (id) {
      database.ref(`/Users/${auth?.currentUser?.uid}/suggestions/${id}`).remove().then(() => {
      }).catch((e) => console.log(e))
    }
  }

  return show && data?.poster_path && (
    <>
      <Modal size='md' show={show2} onHide={() => setShow2(false)} centered>
        <Modal.Body style={{ backgroundColor: theme.palette.background.default }}>
          <div className='modal_header'>
            {comment}
            <IconButton onClick={() => setShow2(false)}><CloseIcon style={{ color: 'red' }} /></IconButton>
          </div>
        </Modal.Body>
      </Modal>
      <div className='single_content_scroll'>
        <div className={trending && 'trending_flex_count'}>
          {trending && <div className='trending_count'>
            {index}
          </div>}
          <img
            loading='lazy'
            src={data?.poster_path ? `https://image.tmdb.org/t/p/w342/${data?.poster_path}` : "https://moviereelist.com/wp-content/uploads/2019/07/poster-placeholder.jpg"}
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
          {comment && <div onClick={() => setShow2(true)} className='suggestioncomment'>suggestion note</div>}
        </div>}
        {
          (userid && (lastPlayed || duration)) &&
          <>
            <div className='watchprogress'>
              <div className='watchprogress2' style={{ width: duration ? `${duration}%` : '0%' }}></div>
            </div>
            <div className='lastPlayDetails'>
              {type === 'tv' && (
                <div className='userlastplayed'>
                  S{lastPlayed?.season} E{lastPlayed?.episode}
                </div>
              )}
              {left > 0 ? <div className='timeleft'>{getTimeLeft(left)} Left</div>
                : !upcoming && type === 'tv' && <div className='nextEpisode'>Next Episode</div>}
              {upcoming ? <div className='timeleft'>Coming {getRelativeDateString(upcomingDate)}</div> : ""}
            </div>
          </>
        }
      </div >
    </>
  )
}