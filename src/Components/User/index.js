import React from 'react'
import './style.css'
import { Link } from 'react-router-dom'

export default function User({ user }) {
  return (
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
  )
}
