import React, { useEffect } from 'react'
import './style.css'
import { Link } from 'react-router-dom'
import Grid from '@mui/material/Unstable_Grid2';

export default function User({ user }) {

  return (
    <Grid xs={2} sm={4} md={4} key={user.uid}>
      <Link to={`/user/${user.uid}`} style={{ textDecoration: 'none' }}>
        <div className='single_user'>
          <img src={`${user?.photo}`} className="users_image" />
          <div className='user_username'>
            {user.username.split('@')[0]}
          </div>
        </div>
      </Link>
    </Grid>
  )
}
