import React, { useState } from 'react'
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import TvIcon from '@mui/icons-material/Tv';
import MovieIcon from '@mui/icons-material/Movie';
import { useHistory } from 'react-router-dom';
import './style.css'

export default function Header() {
    const history = useHistory()
    const [query, setQuery] = useState("")
  return (
    <div className='welcome'>
        <h2>Welcome.</h2>
        <h3>Millions of movies, TV shows and people to discover. Explore now.</h3>
        <br />
        <Paper
          component="form"
          sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%', borderRadius: '20px' }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search for a movie or series"
            inputProps={{ 'aria-label': 'search google maps' }}
            onChange={(e) => setQuery(e.target.value)}
          />
          <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={() => query.length> 1 && history.push(`/search/${query}/movie`)}>
            <MovieIcon />
          </IconButton>
          <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={() => query.length> 1 && history.push(`/search/${query}/tv`)}>
            <TvIcon />
          </IconButton>
        </Paper>
      </div>
  )
}
