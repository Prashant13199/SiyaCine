import React from 'react'
import { Link } from 'react-router-dom'
import './style.css'

export default function Cast({ c }) {
    console.log(c.data)
    return (
        <Link to={`/singlecast/${c.id}`} style={{ textDecoration: 'none', color: 'black' }}>
            <div className='cast_single'>
                <img alt="" src={c.data?.profile_path ? `https://image.tmdb.org/t/p/w500/${c.data.profile_path}` : "https://upload.wikimedia.org/wikipedia/en/6/60/No_Picture.jpg"} className='cast_image' />
                <div style={{ marginTop: '5px' }}>
                    <div style={{ fontWeight: '500', maxWidth: '150px', color: 'white' }}>{c.data?.name}</div>
                </div>
            </div>
        </Link>
    )
}
