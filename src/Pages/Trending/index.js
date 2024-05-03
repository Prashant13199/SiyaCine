import React, { useEffect, useState } from 'react'
import './style.css'
import Header from '../../Components/Header';
import { Link } from 'react-router-dom';
import SingleContentScroll from '../../Components/SingleContentScroll';
import { IconButton, useTheme } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import useFetchContent from '../../hooks/useFetchContent';

export default function Trending({ setBackdrop, scrollTop }) {

  const [switchTrending, setSwitchTrending] = useState(0)
  const [switchTopRated, setSwitchTopRated] = useState(0)
  const [switchPopular, setSwitchPopular] = useState(0)
  const theme = useTheme()

  useEffect(() => {
    scrollTop()
  }, []);

  const nowplaying = useFetchContent('now_playing', 'movie')
  const popularmovie = useFetchContent('popular', 'movie')
  const populartv = useFetchContent('popular', 'tv')
  const topratedmovie = useFetchContent('top_rated', 'movie')
  const topratedtv = useFetchContent('top_rated', 'tv')
  const upcoming = useFetchContent('upcoming', 'movie')
  const trendingMovie = useFetchContent('trending', 'movie')
  const trendingTv = useFetchContent('trending', 'tv')

  return (

    <div className='trending'>
      <Header setBackdrop={setBackdrop} />
      <>
        {nowplaying?.length !== 0 && <><br />
          <div className='trending_title' >
            Now Playing in Theatres
            <Link to={`/singlecategory/now_playing/movie/Now Playing in Theatres/$$`} className="viewall">
              <IconButton><ChevronRightIcon /></IconButton>
            </Link>
          </div>
          <div className='trending_scroll' >
            {nowplaying?.map((data) => {
              return <SingleContentScroll data={data} key={data?.id} type="movie" />
            })}
          </div>
        </>}
        {upcoming?.length !== 0 && <><br />
          <div className='trending_title' >Upcoming
            <Link to={`/singlecategory/upcoming/movie/Upcoming/$$`} className="viewall" >
              <IconButton><ChevronRightIcon /></IconButton>
            </Link>
          </div>
          <div className='trending_scroll' >
            {upcoming?.map((data) => {
              return <SingleContentScroll data={data} key={data?.id} type="movie" />
            })}
          </div></>}

        {(trendingMovie?.length !== 0 || trendingTv?.length !== 0) && <><br />
          <div className='trending_title' >Trending&nbsp;&nbsp;<div className='switch' onClick={() => setSwitchTrending(switchTrending === 0 ? 1 : 0)}>
            <div className={switchTrending === 0 ? 'switch_span_active' : 'switch_span'} style={{ backgroundColor: switchTrending === 0 && theme.palette.warning.main, color: switchTrending === 0 && theme.palette.warning.contrastText }}>Movie</div>
            <div className={switchTrending === 1 ? 'switch_span_active' : 'switch_span'} style={{ backgroundColor: switchTrending === 1 && theme.palette.warning.main, color: switchTrending === 1 && theme.palette.warning.contrastText }}>TV</div>
          </div><Link to={`/singlecategory/trending/${switchTrending === 0 ? 'movie' : 'tv'}/Trending ${switchTrending === 0 ? 'Movie' : 'TV'}/$$`} className="viewall"><IconButton><ChevronRightIcon /></IconButton></Link></div>
          <div className='trending_scroll' >
            {switchTrending === 0 && trendingMovie?.map((data) => {
              return <SingleContentScroll data={data} key={data?.id} type="movie" />
            })}
            {switchTrending === 1 && trendingTv?.map((data) => {
              return <SingleContentScroll data={data} key={data?.id} type="tv" />
            })}
          </div></>}
        {(topratedmovie?.length !== 0 || topratedtv?.length !== 0) && <><br />
          <div className='trending_title' >Top Rated&nbsp;&nbsp;<div className='switch' onClick={() => setSwitchTopRated(switchTopRated === 0 ? 1 : 0)}>
            <div className={switchTopRated === 0 ? 'switch_span_active' : 'switch_span'} style={{ backgroundColor: switchTopRated === 0 && theme.palette.warning.main, color: switchTopRated === 0 && theme.palette.warning.contrastText }}>Movie</div>
            <div className={switchTopRated === 1 ? 'switch_span_active' : 'switch_span'} style={{ backgroundColor: switchTopRated === 1 && theme.palette.warning.main, color: switchTopRated === 1 && theme.palette.warning.contrastText }}>TV</div>
          </div><Link to={`/singlecategory/top_rated/${switchTopRated === 0 ? 'movie' : 'tv'}/Top Rated ${switchTopRated === 0 ? 'Movie' : 'TV'}/$$`} className="viewall"><IconButton><ChevronRightIcon /></IconButton></Link></div>
          <div className='trending_scroll' >
            {switchTopRated === 0 && topratedmovie?.map((data) => {
              return <SingleContentScroll data={data} key={data?.id} type="movie" />
            })}
            {switchTopRated === 1 && topratedtv?.map((data) => {
              return <SingleContentScroll data={data} key={data?.id} type="tv" />
            })}
          </div></>}
        {(popularmovie?.length !== 0 || populartv?.length !== 0) && <><br />
          <div className='trending_title' >Popular&nbsp;&nbsp;<div className='switch' onClick={() => setSwitchPopular(switchPopular === 0 ? 1 : 0)}>
            <div className={switchPopular === 0 ? 'switch_span_active' : 'switch_span'} style={{ backgroundColor: switchPopular === 0 && theme.palette.warning.main, color: switchPopular === 0 && theme.palette.warning.contrastText }}>Movie</div>
            <div className={switchPopular === 1 ? 'switch_span_active' : 'switch_span'} style={{ backgroundColor: switchPopular === 1 && theme.palette.warning.main, color: switchPopular === 1 && theme.palette.warning.contrastText }}>TV</div>
          </div><Link to={`/singlecategory/popular/${switchPopular === 0 ? 'movie' : 'tv'}/Popular ${switchPopular === 0 ? 'Movie' : 'TV'}/$$`} className="viewall" ><IconButton><ChevronRightIcon /></IconButton></Link></div>
          <div className='trending_scroll' >
            {popularmovie && switchPopular === 0 && popularmovie.map((data) => {
              return <SingleContentScroll data={data} key={data?.id} type="movie" />
            })}
            {populartv && switchPopular === 1 && populartv.map((data) => {
              return <SingleContentScroll data={data} key={data?.id} type="tv" />
            })}
          </div></>}
      </>
    </div>

  )
}
