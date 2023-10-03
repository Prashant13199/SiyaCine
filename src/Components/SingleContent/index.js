import React, { useEffect, useState } from 'react'
import './style.css'
import { useHistory } from 'react-router-dom'
import Grid from '@mui/material/Unstable_Grid2';
import { auth, database } from '../../firebase';

export default function SingleContent({ data, type }) {

  const history = useHistory()
  const [show, setShow] = useState(true)

  useEffect(() => {
    database.ref(`/Users/${auth?.currentUser?.uid}/watched/${data.id}`).on('value', snapshot => {
      if (snapshot?.val()) {
        setShow(false)
      } else {
        setShow(true)
      }
    })
  }, [])

  return data?.poster_path && show && (
    <Grid xs={2} sm={4} md={4} key={data.id}>
      <img
        src={data?.poster_path ? `https://image.tmdb.org/t/p/w500/${data?.poster_path}` : "https://www.movienewz.com/img/films/poster-holder.jpg"}
        alt={data?.title || data?.name}
        className="poster"
        onClick={() => history.push(`/singlecontent/${data.id}/${type ? type : data.media_type}`)}
      />
    </Grid>
  )
}
