import React from 'react'
import './style.css'

export default function Premium({ premium }) {
    return (
        <>
            {premium ? <div className='premium'>PREMIUM USER</div> : <div className='basic'>BASIC USER</div>}
        </>
    )
}
