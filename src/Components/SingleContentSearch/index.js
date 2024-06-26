import React from 'react'
import './style.css'
import { useHistory } from 'react-router-dom'
import Grid from '@mui/material/Unstable_Grid2';
import TvIcon from '@mui/icons-material/Tv';

export default function SingleContent({ data }) {

    const history = useHistory()

    return data?.poster_path && (
        <Grid xs={2} sm={4} md={4} key={data.id}>
            <div className='postersearch'>
                <img
                    src={data?.poster_path ? `https://image.tmdb.org/t/p/w500/${data?.poster_path}` : "https://www.movienewz.com/img/films/poster-holder.jpg"}
                    alt={data?.title || data?.name}
                    className="search_img"
                    onClick={() => history.push(`/singlecontent/${data.id}/${data.media_type}`)}
                />
                {data.media_type === 'tv' && <div className='searchtv'><TvIcon sx={{ fontSize: '16px', color: 'rgb(255, 167, 38)' }} /></div>}
            </div>
        </Grid>
    )
}
