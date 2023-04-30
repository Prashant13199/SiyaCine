import React, { useEffect, useState } from 'react';
import './style.css';
import axios from "axios";
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

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
    <Link to={`/singlecontent/${upcoming[number]?.id}/movie`} style={{ textDecoration: 'none' }}>
      <div className='welcome' style={{ backgroundImage: upcoming.length !== 0 ? `url(https://image.tmdb.org/t/p/original/${upcoming[number].backdrop_path})` : 'transparent', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', borderRadius: '10px' }}>
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
