import React, { useEffect, useState } from 'react';
import './style.css';
import axios from "axios";

export default function Header() {

  const [upcoming, setUpcoming] = useState([])
  const [number, setNumber] = useState('')

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
    <div className='welcome' style={{ backgroundImage: upcoming.length !== 0 ? `url(https://image.tmdb.org/t/p/original/${upcoming[number].backdrop_path})` : 'transparent', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', borderRadius: '10px' }}>
      <div className='welcome_backdrop'>
        <div style={{ width: '100%' }}>
          <div className='welcomeText'>Welcome.</div>
          <div className='welcomeDesc'>Millions of Movies and TV shows to discover. Explore now.</div>
        </div>
      </div>
    </div>
  )
}
