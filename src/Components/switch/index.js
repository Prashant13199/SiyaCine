import React from 'react'
import './style.css'

export default function Switch({ data, setData }) {
    return (
        <div className="switch-container">
            <div className={`sliding-pill ${data === 'tv' ? 'slide-to-tv' : 'slide-to-movie'}`}></div>
            <button onClick={() => setData('movie')} className={`content-button ${data === 'movie' ? 'active-button' : ''}`}>
                Movies
            </button>
            <button onClick={() => setData('tv')} className={`content-button ${data === 'tv' ? 'active-button' : ''}`}>
                TV
            </button>
        </div>
    )
}
