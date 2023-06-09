import React, { useEffect, useState } from 'react'
import axios from "axios";
import './style.css'
import Header from '../../Components/Header';
import { Link } from 'react-router-dom';
import SingleContentScroll from '../../Components/SingleContentScroll';
import Grow from '@mui/material/Grow';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Trending() {

  const [trendingMovie, setTrendingMovie] = useState([]);
  const [trendingTv, setTrendingTv] = useState([]);
  const [upcoming, setUpcoming] = useState([])
  const [topratedmovie, setTopratedmovie] = useState([])
  const [topratedtv, setTopratedtv] = useState([])
  const [popularmovie, setPopularmovie] = useState([])
  const [populartv, setPopulartv] = useState([])
  const [nowplaying, setNowplaying] = useState([])
  const [checked, setChecked] = useState(false);
  const [switchTrending, setSwitchTrending] = useState(0)
  const [switchTopRated, setSwitchTopRated] = useState(0)
  const [switchPopular, setSwitchPopular] = useState(0)

  const fetchNowplaying = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.REACT_APP_API_KEY}`
    );

    setNowplaying(data.results);
  };

  useEffect(() => {
    AOS.init({ duration: 800 })
  }, [])

  const fetchPopularmovie = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.REACT_APP_API_KEY}`
    );

    setPopularmovie(data.results);
    setChecked(true)
  };

  const fetchPopulartv = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/tv/popular?api_key=${process.env.REACT_APP_API_KEY}`
    );

    setPopulartv(data.results);
  };

  const fetchTopratedmovie = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.REACT_APP_API_KEY}`
    );

    setTopratedmovie(data.results);
  };

  const fetchTopratedtv = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/tv/top_rated?api_key=${process.env.REACT_APP_API_KEY}`
    );

    setTopratedtv(data.results);
  };

  const fetchUpcoming = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.REACT_APP_API_KEY}`
    );

    setUpcoming(data.results);
  };

  const fetchTrendingMovie = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/trending/movie/day?api_key=${process.env.REACT_APP_API_KEY}`
    );

    setTrendingMovie(data.results);
  };

  const fetchTrendingTv = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/trending/tv/day?api_key=${process.env.REACT_APP_API_KEY}`
    );

    setTrendingTv(data.results);
  };

  useEffect(() => {
    window.scroll(0, 0)
    fetchNowplaying();
    fetchPopularmovie();
    fetchPopulartv();
    fetchTopratedtv();
    fetchTopratedmovie();
    fetchUpcoming();
    fetchTrendingMovie();
    fetchTrendingTv();
  }, []);

  return (
    <Grow in={checked} {...(checked ? { timeout: 1000 } : {})} style={{ transformOrigin: '0 0 0' }}>
      <div className='trending'>
        <Header />
        <>
          <br />
          <div className='trending_title' data-aos="fade-right">
            Now Playing in Theatres
            <Link to={`/singlecategory/now_playing/movie/Now Playing in Theatres`} className="viewall">
              View all
            </Link>
          </div>
          <div className='trending_scroll' data-aos="fade-left">
            {nowplaying && nowplaying.map((data) => {
              return <SingleContentScroll data={data} key={data.id} type="movie" />
            })}
          </div>
          <br />
          <div className='trending_title' data-aos="fade-right">Upcoming
            <Link to={`/singlecategory/upcoming/movie/Upcoming`} className="viewall">
              View all
            </Link>
          </div>
          <div className='trending_scroll' data-aos="fade-left">
            {upcoming && upcoming.map((data) => {
              return <SingleContentScroll data={data} key={data.id} type="movie" />
            })}
          </div>
          <br />
          <div className='trending_title' data-aos="fade-right">Trending&nbsp;&nbsp;<div className='switch' onClick={() => setSwitchTrending(switchTrending === 0 ? 1 : 0)}>
            <div className={switchTrending === 0 ? 'switch_span_active' : 'switch_span'}>Movie</div>
            <div className={switchTrending === 1 ? 'switch_span_active' : 'switch_span'}>TV</div>
          </div><Link to={`/singlecategory/trending/${switchTrending === 0 ? 'movie' : 'tv'}/Trending ${switchTrending === 0 ? 'Movie' : 'TV'}`} className="viewall">View all</Link></div>
          <div className='trending_scroll' data-aos="fade-left">
            {trendingMovie && switchTrending === 0 && trendingMovie.map((data) => {
              return <SingleContentScroll data={data} key={data.id} type="movie" />
            })}
            {trendingTv && switchTrending === 1 && trendingTv.map((data) => {
              return <SingleContentScroll data={data} key={data.id} type="tv" />
            })}
          </div>
          <br />
          <div className='trending_title' data-aos="fade-right">Top Rated&nbsp;&nbsp;<div className='switch' onClick={() => setSwitchTopRated(switchTopRated === 0 ? 1 : 0)}>
            <div className={switchTopRated === 0 ? 'switch_span_active' : 'switch_span'}>Movie</div>
            <div className={switchTopRated === 1 ? 'switch_span_active' : 'switch_span'}>TV</div>
          </div><Link to={`/singlecategory/top_rated/${switchTopRated === 0 ? 'movie' : 'tv'}/Top Rated ${switchTopRated === 0 ? 'Movie' : 'TV'}`} className="viewall">View all</Link></div>
          <div className='trending_scroll' data-aos="fade-left">
            {topratedmovie && switchTopRated === 0 && topratedmovie.map((data) => {
              return <SingleContentScroll data={data} key={data.id} type="movie" />
            })}
            {topratedtv && switchTopRated === 1 && topratedtv.map((data) => {
              return <SingleContentScroll data={data} key={data.id} type="tv" />
            })}
          </div>
          <br />
          <div className='trending_title' data-aos="fade-right">Popular&nbsp;&nbsp;<div className='switch' onClick={() => setSwitchPopular(switchPopular === 0 ? 1 : 0)}>
            <div className={switchPopular === 0 ? 'switch_span_active' : 'switch_span'}>Movie</div>
            <div className={switchPopular === 1 ? 'switch_span_active' : 'switch_span'}>TV</div>
          </div><Link to={`/singlecategory/popular/${switchPopular === 0 ? 'movie' : 'tv'}/Popular ${switchPopular === 0 ? 'Movie' : 'TV'}`} className="viewall">View all</Link></div>
          <div className='trending_scroll' data-aos="fade-left">
            {popularmovie && switchPopular === 0 && popularmovie.map((data) => {
              return <SingleContentScroll data={data} key={data.id} type="movie" />
            })}
            {populartv && switchPopular === 1 && populartv.map((data) => {
              return <SingleContentScroll data={data} key={data.id} type="tv" />
            })}
          </div>
        </>
      </div>
    </Grow>
  )
}
