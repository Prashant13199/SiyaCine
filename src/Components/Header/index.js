import React, { useEffect, useState } from 'react';
import './style.css';
import axios from "axios";
import { Link } from 'react-router-dom';

export default function Header({ setBackdrop }) {

  const [upcoming, setUpcoming] = useState([])
  const [number, setNumber] = useState(null)
  const [background, setBackground] = useState(null)

  useEffect(() => {
    setBackdrop(window.innerWidth > 900 ? upcoming[number]?.backdrop_path : upcoming[number]?.poster_path)
    setBackground(window.innerWidth > 900 ? upcoming[number]?.backdrop_path : upcoming[number]?.poster_path)
  }, [upcoming, number, window.innerWidth])

  const fetchUpcoming = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.REACT_APP_API_KEY}`
    );
    setUpcoming(data.results);
  };

  useEffect(() => {
    fetchUpcoming();
  }, [])

  useEffect(() => {
    setNumber(Math.floor(Math.random() * upcoming.length))
  }, [upcoming])

  return (
    <Link to={`/singlecontent/${upcoming[number]?.id}/movie`} style={{ textDecoration: 'none' }}>
      <div className='welcome' style={{ backgroundImage: upcoming?.length !== 0 && number ? `url(https://image.tmdb.org/t/p/original/${background})` : 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(231,145,10,1) 0%, rgba(255,0,187,1) 100%)' }}>
        <div className='welcome_backdrop'>
          <div style={{ width: '100%' }}>
            <div className='welcomeText'>{upcoming[number]?.title}</div>
            <div className='welcomeDesc'>{upcoming[number]?.overview.substring(0, 80).concat('...')}</div>
          </div>
        </div>
      </div>
    </Link>
  )
}
