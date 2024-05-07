import React from 'react'
import './style.css'
import { useHistory } from 'react-router-dom'
import Grid from '@mui/material/Unstable_Grid2';

export default function SingleContent({ data }) {

    const history = useHistory()

    return (
        <Grid xs={2} sm={4} md={4} key={data.id}>
            <img
                src={data?.poster_path ? `https://image.tmdb.org/t/p/w500/${data?.poster_path}` : "https://www.movienewz.com/img/films/poster-holder.jpg"}
                alt={data?.title || data?.name}
                className="poster"
                onClick={() => history.push(`/singlecontent/${data.id}/${data.media_type}`)}
            />
        </Grid>
    )
}
