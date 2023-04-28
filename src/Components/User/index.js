import React from 'react'
import './style.css'
import { Link } from 'react-router-dom'
import Grid from '@mui/material/Unstable_Grid2';

export default function User({ user }) {
  return (
    <Grid xs={2} sm={4} md={4} key={user.uid}>
    <Link to={`/user/${user.uid}`} style={{ textDecoration: 'none' }}>
      <div className='User'>
        <img className='user_image' src={user.photo} />
        <div className='user_back'>
          <div className='user_username'>
            {user.username}
          </div>
        </div>
      </div>
    </Link>
    </Grid>
  )
}
