import { Link } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import './style.css';
import { Grow } from '@mui/material';

export default function SingleSlide({ data, index }) {

    const [title, setTitle] = useState('')
    const [checked, setChecked] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            setChecked(true)
        }, index * 400)
    }, [index])

    useEffect(() => {
        if (data?.id) {
            axios.get(`https://api.themoviedb.org/3/movie/${data?.id}/images?api_key=${process.env.REACT_APP_API_KEY}&include_image_language=en`)
                .then(response => {
                    setTitle(response.data?.backdrops[0]?.file_path);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    }, [index, data?.id])

    return title && (
        <Grow in={checked} timeout={1000}>
            <div className="embla__slide" key={index}>
                <Link to={`/singlecontent/${data?.id}/movie`} style={{ textDecoration: 'none' }}>
                    <img
                        className="embla__slide__img"
                        src={`https://image.tmdb.org/t/p/original/${title}`}
                        alt="Your alt text"
                    />
                </Link>
            </div>
        </Grow>
    )
}
