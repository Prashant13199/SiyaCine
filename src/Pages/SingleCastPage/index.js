import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './style.css'
import axios from "axios";
import { IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { database } from '../../firebase'
import Tooltip from '@mui/material/Tooltip';
import SingleContentScroll from '../../Components/SingleContentScroll';
import Grow from '@mui/material/Grow';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function SingleCastPage() {

  const { id } = useParams()
  const [data, setData] = useState([])
  const [favourite, setFavourite] = useState(false)
  const [movie, setMovie] = useState([])
  const [tv, setTv] = useState([])
  const [readMore, setReadMore] = useState(false)
  const [checked, setChecked] = useState(false);
  const [switchC, setSwitchC] = useState(0)
  const currentuid = localStorage.getItem('uid')

  useEffect(() => {
    AOS.init({ duration: 800, })
  }, [])

  useEffect(() => {
    database.ref(`/Users/${currentuid}/cast/${id}`).on('value', snapshot => {
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
    setChecked(true)
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
    window.scroll(0, 0);
    fetchDetails();
    fetchMovieCredits();
    fetchTvCredits();
  }, [id])

  const handleFavourite = () => {
    if (!favourite) {
      database.ref(`/Users/${currentuid}/cast/${id}`).set({
        id: id, data: data,
      }).then(() => {
        console.log("Set to cast")
        setFavourite(true)
      })
    } else {
      database.ref(`/Users/${currentuid}/cast/${id}`).remove().then(() => {
        console.log("Removed from cast")
        setFavourite(false)
      })
    }
  }

  return (
    <Grow in={checked} {...(checked ? { timeout: 1000 } : {})} style={{ transformOrigin: '0 0 0' }}>
      <div className='singlecastpage'>
        <div className='singlecontent_responsive_cast'>
          <div className='singlecontentposter_responsive'>
            <img alt="" src={data.profile_path ? `https://image.tmdb.org/t/p/w500/${data.profile_path}` : "https://www.movienewz.com/img/films/poster-holder.jpg"} className='singlecontentposter' />
          </div>
          <div className='details'>
            <h2 style={{ fontWeight: 'bold' }}>{data.name}</h2>
            <div className='actions'>
              {currentuid && <div>
                <Tooltip title="Favourite">
                  <IconButton style={{ backgroundColor: '#3385ff' }} onClick={() => handleFavourite()}>
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
              <span className='readmore' onClick={() => setReadMore(!readMore)}>{data.biography && data.biography?.length > 200 && (!readMore ? 'read more.' : 'Less')}</span>
            </div>}
          </div>
        </div>
        <br />
        <div className='trending_title' data-aos="fade-right"><div className='switch' onClick={() => setSwitchC(switchC === 0 ? 1 : 0)}>
          <div className={switchC === 0 ? 'switch_span_active' : 'switch_span'}>Movie</div>
          <div className={switchC === 1 ? 'switch_span_active' : 'switch_span'}>TV</div>
        </div>
        </div>
        <div style={{ marginTop: '10px' }}></div>
        <div className='trending_scroll' data-aos="fade-left">
          {movie && switchC === 0 && movie.map((data) => {
            return <SingleContentScroll data={data} key={data.id} type="movie" />
          })}
          {tv && switchC === 1 && tv.map((data) => {
            return <SingleContentScroll data={data} key={data.id} type="tv" />
          })}
        </div>
      </div>
    </Grow>
  )
}
