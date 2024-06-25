import './style.css'
import { useHistory } from 'react-router-dom'
import Grid from '@mui/material/Unstable_Grid2';

export default function SingleContent({ data, type, showtv }) {

  const history = useHistory()

  return data?.poster_path && (
    <Grid xs={2} sm={4} md={4} key={data.id}>
      <div className='postersearch'>
        <img
          src={data?.poster_path ? `https://image.tmdb.org/t/p/w500/${data?.poster_path}` : "https://www.movienewz.com/img/films/poster-holder.jpg"}
          alt={data?.title || data?.name}
          className="search_img"
          onClick={() => history.push(`/singlecontent/${data.id}/${type ? type : data.media_type}`)}
        />
        {type === 'tv' && showtv && <div className='searchtv'>TV</div>}
      </div>
    </Grid>
  )
}
