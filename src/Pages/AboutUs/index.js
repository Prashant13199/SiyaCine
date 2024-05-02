import React, { useEffect } from 'react'
import './style.css'
import prashant from '../../assets/prashantkumar.png'
import { useTheme } from '@mui/material/styles';

export default function AboutUs({ scrollTop }) {

  const theme = useTheme()

  useEffect(() => {
    scrollTop()
  }, [])

  return (
    <div className='movies'>
      <div className='aboutus_content'>
        <div className='about_siya_dark'>
          <h2>About Siya Cine</h2>
          <br />
          <p>
            With Siya Cine, users can organize their collection of entertainment by adding movies and TV shows to their watchlists and favorites. Users can also see the libraries of other user. Users can recommend contents to others.
          </p>
        </div>
      </div>
      <div className='aboutus_content'>
        <div className='about_siya_dark'>
          <h2>About Siya Developers</h2>
          <br />
          <p>
            Siya Developers was founded in 2018. The company's main goal was to offer users personalised apps that would make their work easier. Siya Developers created a variety of apps for users with the opportunity to customise them based on their needs, including SiyaExam,
            &nbsp;<a style={{ color: theme.palette.warning.main }} target='_blank' href="https://siyacine.netlify.app">Siyacine</a>,
            &nbsp;<a style={{ color: theme.palette.warning.main }} target='_blank' href="https://beesocio.netlify.app">BeeSocio</a>,
            &nbsp;<a style={{ color: theme.palette.warning.main }} target='_blank' href="https://siyafoods.netlify.app">SiyaFoods</a>,
            &nbsp;<a style={{ color: theme.palette.warning.main }} target='_blank' href="https://siyarawg.netlify.app">SiyaRawg</a>  and
            &nbsp;<a style={{ color: theme.palette.warning.main }} target='_blank' href="https://dailyquotes4u.netlify.app">Quotes4u</a>.
          </p>
          <div className='user_row'>
            <img src={prashant} className='user_image' />
            <div className='user_details'>
              <h3 className='user_name'>Prashant Kumar</h3>
              <h5 className='user_designation'>Founder and CEO</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
