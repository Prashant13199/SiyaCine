import React from 'react'
import './style.css'
import { Link } from 'react-router-dom'

export default function User({user}) {
  return (
    <Link to={`/user/${user.uid}`} style={{ textDecoration: 'none' }}>
        <div className='User'>
            <div>
                <img className='user_image' src={user.photo} />
            </div>
            <div className='user_username'>
                {user.username}
            </div>
        </div>
    </Link>
  )
}
