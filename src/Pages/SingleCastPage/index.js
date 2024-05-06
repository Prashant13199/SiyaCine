import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './style.css'
import axios from "axios";
import { IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { auth, database } from '../../firebase'
import Tooltip from '@mui/material/Tooltip';
import SingleContentScroll from '../../Components/SingleContentScroll';
import { useTheme } from '@mui/material';
import { CircularProgress } from '@mui/material';

export default function SingleCastPage({ scrollTop, setBackdrop }) {

  const { id } = useParams()
  const [data, setData] = useState([])
  const [favourite, setFavourite] = useState(false)
  const [movie, setMovie] = useState([])
  const [tv, setTv] = useState([])
  const [readMore, setReadMore] = useState(false)
  const [switchC, setSwitchC] = useState(0)
  const theme = useTheme()
  const [loading, setLoading] = useState(true)
  const [number, setNumber] = useState(null)

  useEffect(() => {
    randomNumber()
  }, [favourite.length])

  const randomNumber = () => {
    setNumber(Math.floor(Math.random() * movie.length))
  }

  useEffect(() => {
    setBackdrop(window.innerWidth > 600 ? movie[number]?.backdrop_path : movie[number]?.poster_path)
  }, [movie, number, window.innerWidth])

  useEffect(() => {
    database.ref(`/Users/${auth?.currentUser?.uid}/cast/${id}`).on('value', snapshot => {
      if (snapshot.val()?.id === id) {
        setFavourite(true)
      }
    })
  }, [])

  const fetchDetails = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/person/${id}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
    );
    setData(data);
    setLoading(false)
  };

  const fetchMovieCredits = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
    );
    setMovie(data.cast);
  };

  const fetchTvCredits = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/person/${id}/tv_credits?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
    );
    setTv(data.cast);
  };

  useEffect(() => {
    scrollTop()
    fetchDetails();
    fetchMovieCredits();
    fetchTvCredits();
  }, [id])

  const handleFavourite = () => {
    if (!favourite) {
      database.ref(`/Users/${auth?.currentUser?.uid}/cast/${id}`).set({
        id: id, data: data,
      }).then(() => {
        setFavourite(true)
      })
    } else {
      database.ref(`/Users/${auth?.currentUser?.uid}/cast/${id}`).remove().then(() => {
        setFavourite(false)
      })
    }
  }

  return !loading ? (

    <div className='singlecastpage'>
      <div className='singlecontent_responsive_cast'>
        <div className='pic_container'>
          <img alt="" src={data.profile_path ? `https://image.tmdb.org/t/p/w500/${data.profile_path}` : "https://www.movienewz.com/img/films/poster-holder.jpg"} className='singlecontentposter' />
        </div>
        <div className='details'>
          <h2 style={{ fontWeight: 'bold' }}>{data.name}</h2>
          <div className='actions'>
            {auth?.currentUser?.uid && <div>
              <Tooltip title="Favourite">
                <IconButton style={{ backgroundColor: theme.palette.warning.main }} onClick={() => handleFavourite()}>
                  {favourite ? <FavoriteIcon style={{ color: 'red' }} /> : <FavoriteIcon style={{ color: 'white' }} />}
                </IconButton>
              </Tooltip>
            </div>}
          </div>
          {data.birthday && <div className='overview'>
            <h4>Birthday</h4>
            {data.birthday}
          </div>}
          {data.place_of_birth && <div className='overview'>
            <h4>Place of Birth</h4>
            {data.place_of_birth}
          </div>}
          {data.known_for_department && <div className='overview'>
            <h4>Known for departmant</h4>
            {data.known_for_department}
          </div>}
          {data.biography && <div className='overview'>
            <h4>Biography</h4>
            {data.biography?.length > 200 && !readMore ? data.biography.substring(0, 200).concat('...') : data.biography}
            <span className='readmore' style={{ color: theme.palette.warning.main }} onClick={() => setReadMore(!readMore)}>{data.biography && data.biography?.length > 200 && (!readMore ? 'read more' : 'less')}</span>
          </div>}
        </div>
      </div>
      <br />
      <div className='trending_title' ><div className='switch' onClick={() => setSwitchC(switchC === 0 ? 1 : 0)}>
        <div className={switchC === 0 ? 'switch_span_active' : 'switch_span'} style={{ backgroundColor: switchC === 0 && theme.palette.warning.main, color: switchC === 0 && theme.palette.warning.contrastText }}>Movie</div>
        <div className={switchC === 1 ? 'switch_span_active' : 'switch_span'} style={{ backgroundColor: switchC === 1 && theme.palette.warning.main, color: switchC === 1 && theme.palette.warning.contrastText }}>TV</div>
      </div>
      </div>
      <div style={{ marginTop: '10px' }}></div>
      <div className='trending_scroll' >
        {movie && switchC === 0 && movie.map((data) => {
          return <SingleContentScroll data={data} key={data.id} type="movie" />
        })}
        {tv && switchC === 1 && tv.map((data) => {
          return <SingleContentScroll data={data} key={data.id} type="tv" />
        })}
      </div>
    </div>

  )
    : <div className="loading">
      <CircularProgress color='warning' />
    </div>
}
