import React, { useEffect, useState } from 'react'
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { useHistory } from 'react-router-dom';
import './style.css'
import axios from "axios";

export default function Header() {

  const history = useHistory()
  const [query, setQuery] = useState("")
  const [upcoming, setUpcoming] = useState([])

  const fetchUpcoming = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.REACT_APP_API_KEY}`
    );

    setUpcoming(data.results);
  };

  useEffect(() => {
    fetchUpcoming();
  }, [])

  return (
    <div className='welcome' style={{ backgroundImage: upcoming.length !== 0 ? `url(https://image.tmdb.org/t/p/original/${upcoming[0].backdrop_path})` : 'transparent', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}>
      <div className='welcome_backdrop'>
        <div style={{ width: '100%' }}>
        <h2>Welcome.</h2>
        <h3>Millions of Movies and TV shows to discover. Explore now.</h3>
        <br />
        <Paper
          component="form"
          sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%', borderRadius: '20px' }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search for a movie or tv show"
            inputProps={{ 'aria-label': 'search google maps' }}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.keyCode == 13 && query.length > 1) {
                history.push(`/search/${query}`)
              }
            }}
          />
          <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={() => query.length > 1 && history.push(`/search/${query}`)}>
            <SearchIcon />
          </IconButton>
        </Paper>
        </div>
      </div>
    </div>
  )
}
