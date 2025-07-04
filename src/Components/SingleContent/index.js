import './style.css'
import { useHistory } from 'react-router-dom'
import Grid from '@mui/material/Unstable_Grid2';
import TvIcon from '@mui/icons-material/Tv';
import { useEffect, useState } from 'react';
import { Zoom } from '@mui/material';

export default function SingleContent({ data, type, showIcon, index }) {

  const [checked, setChecked] = useState(false)

  const history = useHistory()

  useEffect(() => {
    setTimeout(() => {
      setChecked(true)
    }, index * 50)
  }, [index])

  return data?.poster_path && (
    <Zoom in={checked} {...({ timeout: 800 })}>
      <Grid xs={2} sm={4} md={4} key={data.id}>
        <div className='postersearch'>
          <img
            src={data?.poster_path ? `https://image.tmdb.org/t/p/w500/${data?.poster_path}` : "https://www.movienewz.com/img/films/poster-holder.jpg"}
            alt={data?.title || data?.name}
            className="search_img"
            onClick={() => history.push(`/singlecontent/${data.id}/${type ? type : data.media_type}`)}
          />
          {showIcon &&
            <>
              {type === 'tv' && <div className='searchtv'><TvIcon sx={{ fontSize: '14px', color: 'rgb(255, 167, 38)' }} /></div>}
            </>
          }
        </div>
      </Grid>
    </Zoom>
  )
}
