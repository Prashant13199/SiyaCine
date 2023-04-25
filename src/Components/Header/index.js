import React, { useState } from 'react'
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
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
            onKeyDown={(e) => {
              if(e.keyCode == 13 && query.length>1){
                history.push(`/search/${query}`)
              }
            }}
          />
          <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={() => query.length> 1 && history.push(`/search/${query}`)}>
            <SearchIcon />
          </IconButton>
        </Paper>
      </div>
  )
}
