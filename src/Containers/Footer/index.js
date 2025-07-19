import React from 'react'
import './style.css'

export default function Footer() {
    return (
        <div className='footer'>
            <div className='disclaimer'>Disclaimer: We does not store any files on our servers, all the videos are hosted on 3rd party services and details are fetched from The Movie Database.</div>
            <div className='copyright'>SiyaCine&copy;2025.&nbsp;All rights reserved.</div>
            <div className='tmdb_logo_container'>
                <a href="https://www.themoviedb.org" target="_blank">
                    <img className='tmdb_logo' src={process.env.PUBLIC_URL + '/tmdb.svg'} />
                </a>
            </div>
        </div>
    )
}
