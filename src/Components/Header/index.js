import React, { useEffect, useState } from 'react';
import './style.css';
import axios from "axios";
import { Link } from 'react-router-dom';

export default function Header() {

  const [upcoming, setUpcoming] = useState([])
  const [number, setNumber] = useState(null)

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
      <div className='welcome' style={{ backgroundImage: upcoming.length !== 0 && number ? `url(https://image.tmdb.org/t/p/original/${upcoming[number].backdrop_path})` : 'linear-gradient(0deg, rgba(34,193,195,1) 0%, rgba(253,187,45,1) 100%)', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', borderRadius: '10px' }}>
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
