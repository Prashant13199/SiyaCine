import React from 'react'
import './style.css'

export default function Premium({ premium }) {
    return (
        <>
            {premium ? <div className='premium'>SIYACINE PREMIUM</div> : <div className='basic'>SIYACINE BASIC</div>}
        </>
    )
}
