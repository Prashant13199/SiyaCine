import React, { useEffect, useState } from 'react'
import axios from "axios";
import SingleContent from '../../Components/SingleContent';
import './style.css'
import Header from '../../Components/Header';

export default function Trending() {

  const [trendingMovie, setTrendingMovie] = useState([]);
  const [trendingTv, setTrendingTv] = useState([]);
  const [upcoming, setUpcoming] = useState([])
  const [topratedmovie, setTopratedmovie] = useState([])
  const [topratedtv, setTopratedtv] = useState([])
  const [popularmovie, setPopularmovie] = useState([])
  const [populartv, setPopulartv] = useState([])
  const [nowplaying, setNowplaying] = useState([])
  
  const fetchNowplaying = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.REACT_APP_API_KEY}`
    );

    setNowplaying(data.results);
  };

  const fetchPopularmovie = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.REACT_APP_API_KEY}`
    );

    setPopularmovie(data.results);
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
    <div className='trending'>
      <Header />
      <br /><br />
      <div className='trending_title'>Now Playing</div>
      <div className='trending_scroll'>
        {nowplaying && nowplaying.map((data) => {
          return <SingleContent data={data} key={data.id} type="movie" />
        })}
      </div>
      <br /><br />
      <div className='trending_title'>Upcoming</div>
      <div className='trending_scroll'>
        {upcoming && upcoming.map((data) => {
          return <SingleContent data={data} key={data.id} type="movie" />
        })}
      </div>
      <br /><br />
      <div className='trending_title'>Trending TV Series</div>
      <div className='trending_scroll'>
        {trendingTv && trendingTv.map((data) => {
          return <SingleContent data={data} key={data.id} type="tv" />
        })}
      </div>
      <br /><br />
      <div className='trending_title'>Trending Movies</div>
      <div className='trending_scroll'>
        {trendingMovie && trendingMovie.map((data) => {
          return <SingleContent data={data} key={data.id} type="movie" />
        })}
      </div>
      <br /><br />
      <div className='trending_title'>Top Rated Movie</div>
      <div className='trending_scroll'>
        {topratedmovie && topratedmovie.map((data) => {
          return <SingleContent data={data} key={data.id} type="movie" />
        })}
      </div>
      <br /><br />
      <div className='trending_title'>Top Rated TV</div>
      <div className='trending_scroll'>
        {topratedtv && topratedtv.map((data) => {
          return <SingleContent data={data} key={data.id} type="tv" />
        })}
      </div>
      <br /><br />
      <div className='trending_title'>Popular Movie</div>
      <div className='trending_scroll'>
        {popularmovie && popularmovie.map((data) => {
          return <SingleContent data={data} key={data.id} type="movie" />
        })}
      </div>
      <br /><br />
      <div className='trending_title'>Popular TV</div>
      <div className='trending_scroll'>
        {populartv && populartv.map((data) => {
          return <SingleContent data={data} key={data.id} type="tv" />
        })}
      </div>
    </div>
  )
}
