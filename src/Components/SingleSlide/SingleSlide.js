import { Link } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import useFetchContent from '../../hooks/useFetchContent';
import './style.css';

export default function SingleSlide({ data, index }) {

    const nowPlaying = useFetchContent('now_playing', 'movie')

    const [title, setTitle] = useState('')

    useEffect(() => {
        axios.get(`https://api.themoviedb.org/3/movie/${nowPlaying?.[index]?.id}/images?api_key=${process.env.REACT_APP_API_KEY}&include_image_language=en`)
            .then(response => {
                setTitle(response.data.logos[0].file_path);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, [index, nowPlaying])

    return (
        <div className="embla__slide" key={index}>
            <Link to={`/singlecontent/${data?.id}/movie`} style={{ textDecoration: 'none' }}>
                <img
                    className="embla__slide__img"
                    src={data?.length !== 0 ? `https://image.tmdb.org/t/p/original/${window.innerWidth > 900 ? data?.backdrop_path : data?.poster_path}` : 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(231,145,10,1) 0%, rgba(255,0,187,1) 100%)'}
                    alt="Your alt text"
                />
                {title && <div className='welcome_text'>
                    <img src={`https://image.tmdb.org/t/p/original/${title}`} className='title_image' />
                </div>}
            </Link>
        </div>
    )
}
