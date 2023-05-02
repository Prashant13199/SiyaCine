import React, { useEffect, useState } from 'react'
import axios from "axios";
import './style.css'
import Header from '../../Components/Header';
import { Link } from 'react-router-dom';
import { database } from '../../firebase';
import SingleContentScroll from '../../Components/SingleContentScroll';

export default function Trending() {

  const [trendingMovie, setTrendingMovie] = useState([]);
  const [trendingTv, setTrendingTv] = useState([]);
  const [upcoming, setUpcoming] = useState([])
  const [topratedmovie, setTopratedmovie] = useState([])
  const [topratedtv, setTopratedtv] = useState([])
  const [popularmovie, setPopularmovie] = useState([])
  const [populartv, setPopulartv] = useState([])
  const [nowplaying, setNowplaying] = useState([])
  const [watchlist, setWatchlist] = useState([])

  const uid = localStorage.getItem('uid')

  useEffect(() => {
    database.ref(`/Users/${uid}/watchlist`).on('value', snapshot => {
      let arr = []
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, data: snap.val().data, type: snap.val().type })
      })
      setWatchlist(arr)
    })
  }, [])

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
      <br />
      <div className='trending_title'>Now Playing in Theatres<Link to={`/singlecategory/now_playing/movie/Now Playing in Theatres`} className="viewall">View all</Link></div>
      <div className='trending_scroll'>
        {nowplaying && nowplaying.map((data) => {
          return <SingleContentScroll data={data} key={data.id} type="movie" />
        })}
      </div>
      {watchlist.length !== 0 && uid && <><br />
        <div className='trending_title'>Watchlist<Link to={`/profile`} className="viewall">View all</Link></div>
        <div className='trending_scroll'>
          {watchlist && watchlist.map((data) => {
            return <SingleContentScroll data={data.data} key={data.id} type={data.type} />
          })}
        </div></>}
      <br />
      <div className='trending_title'>Upcoming<Link to={`/singlecategory/upcoming/movie/Upcoming`} className="viewall">View all</Link></div>
      <div className='trending_scroll'>
        {upcoming && upcoming.map((data) => {
          return <SingleContentScroll data={data} key={data.id} type="movie" />
        })}
      </div>
      <br />
      <div className='trending_title'>Trending Movies<Link to={`/singlecategory/trending/movie/Trending Movie`} className="viewall">View all</Link></div>
      <div className='trending_scroll'>
        {trendingMovie && trendingMovie.map((data) => {
          return <SingleContentScroll data={data} key={data.id} type="movie" />
        })}
      </div>
      <br />
      <div className='trending_title'>Trending TV<Link to={`/singlecategory/trending/tv/Trending TV`} className="viewall">View all</Link></div>
      <div className='trending_scroll'>
        {trendingTv && trendingTv.map((data) => {
          return <SingleContentScroll data={data} key={data.id} type="tv" />
        })}
      </div>
      <br />
      <div className='trending_title'>Top Rated Movie<Link to={`/singlecategory/top_rated/movie/Top Rated Movie`} className="viewall">View all</Link></div>
      <div className='trending_scroll'>
        {topratedmovie && topratedmovie.map((data) => {
          return <SingleContentScroll data={data} key={data.id} type="movie" />
        })}
      </div>
      <br />
      <div className='trending_title'>Top Rated TV<Link to={`/singlecategory/top_rated/tv/Top Rated TV`} className="viewall">View all</Link></div>
      <div className='trending_scroll'>
        {topratedtv && topratedtv.map((data) => {
          return <SingleContentScroll data={data} key={data.id} type="tv" />
        })}
      </div>
      <br />
      <div className='trending_title'>Popular Movie<Link to={`/singlecategory/popular/movie/Popular Movie`} className="viewall">View all</Link></div>
      <div className='trending_scroll'>
        {popularmovie && popularmovie.map((data) => {
          return <SingleContentScroll data={data} key={data.id} type="movie" />
        })}
      </div>
      <br />
      <div className='trending_title'>Popular TV<Link to={`/singlecategory/popular/tv/Polpular TV`} className="viewall">View all</Link></div>
      <div className='trending_scroll'>
        {populartv && populartv.map((data) => {
          return <SingleContentScroll data={data} key={data.id} type="tv" />
        })}
      </div>
    </div>
  )
}
