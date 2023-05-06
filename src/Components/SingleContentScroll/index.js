import React, { useEffect, useState } from 'react'
import './style.css'
import { useHistory } from 'react-router-dom'
import Grow from '@mui/material/Grow';
import { database } from '../../firebase';
import DeleteIcon from '@mui/icons-material/Delete';

export default function SingleContentScroll({ data, type, by, id }) {

  const history = useHistory()
  const [checked, setChecked] = useState(false);
  const uid = localStorage.getItem('uid')

  useEffect(() => {
    setChecked(true)
  }, [])

  const removeSuggestion = () => {
    if (id) {
      database.ref(`/Users/${uid}/suggestions/${id}`).remove().then(() => {
        console.log('Suggestion Removed')
      }).catch((e) => console.log(e))
    }
  }

  return data?.poster_path && (
    <Grow in={checked} {...(checked ? { timeout: 1000 } : {})} style={{ transformOrigin: '0 0 0' }}>
      <div>
        <img
          src={data?.poster_path ? `https://image.tmdb.org/t/p/w500/${data?.poster_path}` : "https://www.movienewz.com/img/films/poster-holder.jpg"}
          alt={data?.title || data?.name}
          className="poster_scroll"
          onClick={() => history.push(`/singlecontent/${data.id}/${type ? type : data.media_type}`)}
        />
        {by && <div className='user'>
          <DeleteIcon style={{ cursor: 'pointer' }} onClick={() => removeSuggestion()} />
          {by}
        </div>}
      </div>
    </Grow>
  )
}
