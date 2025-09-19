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
import { Helmet } from 'react-helmet';

export default function SingleCastPage({ scrollTop }) {

  const { id } = useParams()
  const [data, setData] = useState([])
  const [favourite, setFavourite] = useState(false)
  const [movie, setMovie] = useState([])
  const [tv, setTv] = useState([])
  const [readMore, setReadMore] = useState(false)
  const theme = useTheme()
  const [loading, setLoading] = useState(true)
  const [backdrop, setBackdrop] = useState('')

  useEffect(() => {
    database.ref(`/Users/${auth?.currentUser?.uid}/cast/${id}`).on('value', snapshot => {
      if (snapshot.val()?.id === id) {
        setFavourite(true)
      }
    })
  }, [])

  const fetchDetails = async () => {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/person/${id}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
      );
      setData(data);
    }
    catch (e) {
      console.log(e)
    }
  };

  const fetchMovieCredits = async () => {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
      );
      setMovie(data.cast);
      setBackdrop(window.innerWidth > 900 && data.cast[0]?.backdrop_path);
      setLoading(false)
    }
    catch (e) {
      console.log(e)
    }
  };

  const fetchTvCredits = async () => {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/person/${id}/tv_credits?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
      );
      setTv(data.cast);
    }
    catch (e) {
      console.log(e)
    }
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

  return (
    <>
      <Helmet>
        <title>SiyaCine - Cast{data?.name ? ` - ${data?.name}` : ''}</title>
      </Helmet>
      {!loading ?
        <div className='singlecastpage'>
          <div className='singlecontent_responsive_cast' style={{ backgroundImage: backdrop && `url(https://image.tmdb.org/t/p/original/${backdrop})` }}>
            <div className={backdrop && 'profile_backdrop'}>
              <div className='pic_container'>
                <img alt="" src={data.profile_path ? `https://image.tmdb.org/t/p/w500/${data.profile_path}` : "https://www.movienewz.com/img/films/poster-holder.jpg"} className='singlecontentposter' />
              </div>
              <div className='details'>
                <div className='mobile_center'>
                  <h1>{data.name}</h1>
                  <div className='actions'>
                    {auth?.currentUser?.uid && <div>
                      <Tooltip title="Favourite">
                        <IconButton style={{ backgroundColor: theme.palette.background.default }} onClick={() => handleFavourite()}>
                          {favourite ? <FavoriteIcon style={{ color: 'red' }} /> : <FavoriteIcon style={{ color: 'white' }} />}
                        </IconButton>
                      </Tooltip>
                    </div>}
                  </div>
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
                  <h4>Known for department</h4>
                  {data.known_for_department}
                </div>}
                {data.biography && <div className='overview animateBelow'>
                  <h4>Biography</h4>
                  {data.biography?.length > 200 && !readMore ? data.biography.substring(0, 200).concat('...') : data.biography}
                  <span className='readmore' style={{ color: theme.palette.warning.main }} onClick={() => setReadMore(!readMore)}>{data.biography && data.biography?.length > 200 && (!readMore ? 'read more' : 'less')}</span>
                </div>}
              </div>
            </div>
          </div>

          {movie?.length !== 0 && <>
            <br />
            <div className='trending_flex'>
              <div className='trending_title' >Movie</div>
            </div>
            <div style={{ marginTop: '10px' }}></div>
            <div className='trending_scroll' >
              {movie?.map((data) => {
                return <SingleContentScroll data={data} id={data.id} key={data.id} type="movie" />
              })}
            </div>
          </>}

          {tv?.length !== 0 && <>
            <br />
            <div className='trending_flex'>
              <div className='trending_title' >TV</div>
            </div>
            <div style={{ marginTop: '10px' }}></div>
            <div className='trending_scroll' >
              {tv?.map((data) => {
                return <SingleContentScroll data={data} id={data.id} key={data.id} type="tv" />
              })}
            </div>
          </>}

        </div>
        : <div className="loading">
          <CircularProgress color='warning' />
        </div>
      }
    </>
  )

}
