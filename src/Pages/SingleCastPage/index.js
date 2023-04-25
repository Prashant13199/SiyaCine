import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './style.css'
import axios from "axios";
import SingleContent from '../../Components/SingleContent';
import { IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { database } from '../../firebase'
import Tooltip from '@mui/material/Tooltip';

export default function SingleCastPage() {

  const { id } = useParams()
  const [data, setData] = useState([])
  const uid = localStorage.getItem('uid')
  const [favourite, setFavourite] = useState(false)
  const [movie, setMovie] = useState([])
  const [tv, setTv] = useState([])

  useEffect(() => {

    database.ref(`/Users/${uid}/cast/${id}`).on('value',  snapshot => {
      if(snapshot.val()?.id === id){
        setFavourite(true)
      }
    })
  },[])

  const fetchDetails = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/person/${id}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
    );
    setData(data);
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
    if(!favourite) {
      database.ref(`/Users/${uid}/cast/${id}`).set({
        id: id, data: data,
      }).then(() => {
        console.log("Set to cast")
        setFavourite(true)
      })
    }else{ 
      database.ref(`/Users/${uid}/cast/${id}`).remove().then(() => {
        console.log("Removed from cast")
        setFavourite(false)
      })
    }
  }

  return (
    <div className='singlecontent'>
      <div className='singlecontent_responsive'>
        <div className='singlecontentposter_responsive'>
          <img alt="" src={data.profile_path ? `https://image.tmdb.org/t/p/w500/${data.profile_path}` : "https://www.movienewz.com/img/films/poster-holder.jpg"} className='singlecontentposter' />
        </div>
        <div className='details'>
          <h2 style={{ fontWeight: 'bold' }}>{data.name}</h2>
          <div className='actions'>
            {uid && <div style={{ marginRight: '20px' }}>
            <Tooltip title="Favourite">
            <IconButton style={{ backgroundColor: '#3385ff' }} onClick={() => handleFavourite()}>
              {favourite ? <FavoriteIcon style={{ color: 'red' }} /> : <FavoriteIcon style={{ color: 'white' }} />}
            </IconButton>
            </Tooltip>
            </div>}
          </div>
          <div className='overview'>
            <h4>Birthday</h4>
            {data.birthday}
          </div>
          <div className='overview'>
            <h4>Place of Birth</h4>
            {data.place_of_birth}
          </div>
          <div className='overview'>
            <h4>Known for departmant</h4>
            {data.known_for_department}
          </div>
          <div className='overview'>
            <h4>Biography</h4>
            {data.biography}
          </div>
        </div>
      </div>
      {movie.length!==0 && <>
        <br /><br />
        <div className='trending_title'>Movies</div>
        <div className='trending_scroll'>
          {movie && movie?.map((data) => {
            return <SingleContent data={data} key={data.id} type="movie" />
          })}
        </div>
      </>}
      {tv.length!==0 && <>
        <br /><br />
        <div className='trending_title'>TV</div>
        <div className='trending_scroll'>
          {tv && tv?.map((data) => {
            return <SingleContent data={data} key={data.id} type="tv" />
          })}
        </div>
      </>}

    </div>
  )
}
