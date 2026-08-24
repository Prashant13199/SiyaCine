import './style.css'
import { useHistory } from 'react-router-dom'
import Grid from '@mui/material/Unstable_Grid2';
import { Zoom } from '@mui/material';
import { useEffect, useState } from 'react';

export default function SingleContent({ data, type, setURL, index }) {

  const history = useHistory()

  const [checked, setChecked] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setChecked(true)
    }, index * 150)
  }, [index])

  return data?.poster_path && (
    <Zoom in={checked} timeout={1000}>
      <Grid xs={2} sm={4} md={4} key={data.id}>
        <div className='postersearch'>
          <img
            loading='lazy'
            src={data?.poster_path ? `https://image.tmdb.org/t/p/w342/${data?.poster_path}` : "https://moviereelist.com/wp-content/uploads/2019/07/poster-placeholder.jpg"}
            alt={data?.title || data?.name}
            className="search_img"
            onClick={() => {
              setURL && setURL()
              history.push(`/singlecontent/${data.id}/${type ? type : data.media_type}`)
            }}
          />
        </div>
      </Grid>
    </Zoom>
  )
}
