import React from 'react'
import './style.css'
import { useHistory } from 'react-router-dom'
import { auth, database } from '../../firebase';
import DeleteIcon from '@mui/icons-material/Delete';

export default function SingleContentScroll({ data, type, by, id }) {

  const history = useHistory()

  const removeSuggestion = () => {
    if (id) {
      database.ref(`/Users/${auth?.currentUser?.uid}/suggestions/${id}`).remove().then(() => {
        console.log('Suggestion Removed')
      }).catch((e) => console.log(e))
    }
  }

  return data?.poster_path && (
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
  )
}
