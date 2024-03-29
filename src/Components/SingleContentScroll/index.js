import React, { useEffect, useState } from 'react'
import './style.css'
import { useHistory } from 'react-router-dom'
import { auth, database } from '../../firebase';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '@mui/material'
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

export default function SingleContentScroll({ data, type, by, byuid, id, recom }) {

  const history = useHistory()
  const theme = useTheme()
  const [show, setShow] = useState(true)

  useEffect(() => {
    if (recom) {
      database.ref(`/Users/${auth?.currentUser?.uid}/watched/${data.id}`).on('value', snapshot => {
        if (snapshot?.val()) {
          setShow(false)
        } else {
          setShow(true)
        }
      })
    }
  }, [auth?.currentUser?.uid])

  const removeSuggestion = () => {
    if (id) {
      database.ref(`/Users/${auth?.currentUser?.uid}/suggestions/${id}`).remove().then(() => {
        console.log('Suggestion Removed')
      }).catch((e) => console.log(e))
    }
  }

  return data?.poster_path && show && (
    <div>
      <img
        src={data?.poster_path ? `https://image.tmdb.org/t/p/w500/${data?.poster_path}` : "https://www.movienewz.com/img/films/poster-holder.jpg"}
        alt={data?.title || data?.name}
        className="poster_scroll"
        onClick={() => history.push(`/singlecontent/${data.id}/${type ? type : data.media_type}`)}
      />
      {by && <div className='user'>
        <DeleteIcon color="error" style={{ cursor: 'pointer' }} onClick={() => removeSuggestion()} />
        <Link style={{ color: theme.palette.text.primary, textDecoration: 'none' }} to={`/user/${byuid}`}>{by}</Link>
      </div>}
    </div>
  )
}
