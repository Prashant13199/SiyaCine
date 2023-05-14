import React, { useEffect } from 'react'
import './style.css'
import { Link } from 'react-router-dom'
import Grid from '@mui/material/Unstable_Grid2';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function User({ user }) {

  useEffect(() => {
    AOS.init({ duration: 800 })
  }, [])

  return (
    <Grid xs={2} sm={4} md={4} key={user.uid} data-aos="fade-up">
      <Link to={`/user/${user.uid}`} style={{ textDecoration: 'none' }}>
        <div className='User'>
          <img className='user_image' src={user ? user.photo : `https://api.dicebear.com/6.x/thumbs/png?seed=Spooky`} />
          <div className='user_back'>
            <div className='user_username'>
              {user.username.length > 12 ? user.username.substring(0, 12).concat('...') : user.username}
            </div>
          </div>
        </div>
      </Link>
    </Grid>
  )
}
