import React, { useEffect, useState } from 'react'
import './style.css'
import { useHistory } from 'react-router-dom'
import Grid from '@mui/material/Unstable_Grid2';
import Grow from '@mui/material/Grow';

export default function SingleContent({ data, type }) {
  const history = useHistory()
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    setChecked(true)
  }, [])
  return data?.poster_path && (
    <Grow in={checked} {...(checked ? { timeout: 1000 } : {})} style={{ transformOrigin: '0 0 0' }}>
      <Grid xs={2} sm={4} md={4} key={data.id}>
        <img
          src={data?.poster_path ? `https://image.tmdb.org/t/p/w500/${data?.poster_path}` : "https://www.movienewz.com/img/films/poster-holder.jpg"}
          alt={data?.title || data?.name}
          className="poster"
          onClick={() => history.push(`/singlecontent/${data.id}/${type ? type : data.media_type}`)}
        />
      </Grid>
    </Grow>
  )
}
