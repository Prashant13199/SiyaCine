import React, { useEffect, useState } from 'react'
import './style.css'
import Header from '../../Containers/Header';
import { Link } from 'react-router-dom';
import SingleContentScroll from '../../Components/SingleContentScroll';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import useFetchContent from '../../hooks/useFetchContent';
import { auth } from '../../firebase'
import axios from "axios";
import Footer from '../../Containers/Footer'
import { Helmet } from 'react-helmet';
import useFetchDBData from '../../hooks/useFetchDBData';
import useFetchMyShows from '../../hooks/useFetchMyShows';
import Switch from '../../Components/switch';
import TheatersIcon from '@mui/icons-material/Theaters';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import UpcomingIcon from '@mui/icons-material/Upcoming';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StarRateIcon from '@mui/icons-material/StarRate';
import PublicIcon from '@mui/icons-material/Public';
import { IconButton } from '@mui/material';
import Providers from '../../Components/Providers/Providers';
import TvIcon from '@mui/icons-material/Tv';
import MovieIcon from '@mui/icons-material/Movie';
import Live from '../../Containers/Live/Live';
import LiveTvIcon from '@mui/icons-material/LiveTv';

export default function Trending({ scrollTop }) {

  const [recommendation, setRecommendation] = useState([])
  const [recommendationCast, setRecommendationCast] = useState([])

  const watching = useFetchDBData(auth?.currentUser?.uid, 'watching')
  const favourite = useFetchDBData(auth?.currentUser?.uid, 'favourites')
  const favouriteCast = useFetchDBData(auth?.currentUser?.uid, 'cast')

  const nowplaying = useFetchContent('now_playing', 'movie')
  const topratedmovie = useFetchContent('top_rated', 'movie')
  const topratedtv = useFetchContent('top_rated', 'tv')
  const trendingMovie = useFetchContent('trending', 'movie')
  const trendingTv = useFetchContent('trending', 'tv')
  const indianMovie = useFetchContent('discover', 'movie')
  const indianTv = useFetchContent('discover', 'tv')
  const providersMovie = useFetchContent('providers', 'movie')
  const providersTV = useFetchContent('providers', 'tv')
  const myShows = useFetchMyShows()

  const [trending, setTrending] = useState('movie')
  const [indian, setIndian] = useState('movie')
  const [topRated, setTopRated] = useState('movie')
  const [providerType, setProviderType] = useState('movie')

  useEffect(() => {
    scrollTop()
  }, []);

  useEffect(() => {
    fetchRecommendation();
    fetchRecommendationCast();
  }, [favourite])

  useEffect(() => {

  }, [])

  const fetchRecommendation = async () => {
    try {
      if (favourite[0]?.type) {
        const { data } = await axios.get(
          `https://api.themoviedb.org/3/${favourite[0]?.type}/${favourite[0]?.id}/recommendations?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&sort_by=popularity.desc&include_video=false`
        );
        setRecommendation(data.results.splice(0, 10));
      }
    }
    catch (e) {
      console.log(e)
    }
  };

  const fetchRecommendationCast = async () => {
    try {
      if (favourite[0]?.type) {
        const { data } = await axios.get(
          `https://api.themoviedb.org/3/person/${favouriteCast[0]?.id}/combined_credits?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
        );
        setRecommendationCast(data.cast.splice(0, 10));
      }
    }
    catch (e) {
      console.log(e)
    }
  };

  return (
    <>

      <Helmet>
        <title>SiyaCine</title>
      </Helmet>

      <div className='trending'>

        <Header />

        {watching?.length !== 0 && auth?.currentUser?.uid && <><br />
          <div className='trending_flex'>
            <div className='trending_title'><PlayArrowIcon /> Continue Watching</div>
          </div>
          <div className='trending_scroll' >
            {watching && watching.map((data, index) => {
              return <SingleContentScroll index={index} data={data.data} id={data.id} key={data.id} type={data.type} userid={auth?.currentUser?.uid} />
            })}
          </div></>}

        {nowplaying?.length !== 0 && <><br />
          <div className='trending_flex'>
            <div className='trending_title'><TheatersIcon /> Playing in Theatres
              <Link to={`/singlecategory/now_playing/movie/Now Playing in Theatres/$$/@@`} className="viewall">
                <IconButton><ChevronRightIcon /></IconButton>
              </Link>
            </div>
          </div>
          <div className='trending_scroll' >
            {nowplaying?.slice(0, 10)?.map((data, index) => {
              return <SingleContentScroll index={index} data={data} id={data.id} key={data?.id} type="movie" />
            })}
          </div>
        </>}

        <>
          <br />
          <div className='trending_flex'>
            <div className='trending_title'><LiveTvIcon /> Live TV</div>
          </div>
          <Live />
        </>

        {myShows?.length !== 0 && <><br />
          <div className='trending_flex'>
            <div className='trending_title'><UpcomingIcon /> Upcoming Episodes</div>
          </div>
          <div className='trending_scroll'>
            {myShows?.map((data, index) => {
              return <SingleContentScroll index={index} data={data} id={data?.id} key={data?.id} type="tv" />
            })}
          </div>
        </>}

        {recommendation?.length !== 0 && <><br />
          <div className='trending_flex'>
            <img src={favourite[0]?.data?.poster_path ? `https://image.tmdb.org/t/p/w342/${favourite[0]?.data?.poster_path}` : "https://moviereelist.com/wp-content/uploads/2019/07/poster-placeholder.jpg"} className='trending_img' />
            <div>
              <div className='trending_title_small'>Because You Watched</div>
              <Link to={`/singlecontent/${favourite[0]?.data.id}/${favourite[0]?.type}`} style={{ textDecoration: 'none' }}>
                <div className='trending_title_subtitle'>
                  {favourite[0]?.data?.name || favourite[0]?.data?.title || favourite[0]?.data?.original_name}
                </div>
              </Link>
            </div>
          </div>
          <div className='trending_scroll' >
            {recommendation?.map((data, index) => {
              return <SingleContentScroll index={index} data={data} id={data.id} key={index} type={data?.media_type} recom={true} />
            })}
          </div></>}

        {(indianMovie?.length !== 0 || indianTv?.length !== 0) && <><br />
          <div className='trending_flex'>
            <div className='trending_title'><PublicIcon /> Indian Origin <Switch data={indian} setData={setIndian} />
              <Link to={indian === 'movie' ? `/singlecategory/discover/movie/Indian Origin Movie/$$/@@` : `/singlecategory/discover/tv/Indian Origin TV/$$/@@`} className="viewall"><IconButton><ChevronRightIcon /></IconButton></Link></div>
          </div>
          <div className='trending_scroll' >
            {indian === "movie" && indianMovie?.slice(0, 10)?.map((data, index) => {
              return <SingleContentScroll index={index} data={data} id={data.id} key={data?.id} type="movie" />
            })}
            {indian === "tv" && indianTv?.slice(0, 10)?.map((data, index) => {
              return <SingleContentScroll index={index} data={data} id={data.id} key={data?.id} type="tv" />
            })}
          </div>
        </>}

        {(trendingMovie?.length !== 0 || trendingTv?.length !== 0) && <><br />
          <div className='trending_flex'>
            <div className='trending_title'><TrendingUpIcon /> Trending <Switch data={trending} setData={setTrending} />
              <Link to={trending === "movie" ? `/singlecategory/trending/movie/Trending Movie/$$/@@` : `/singlecategory/trending/tv/Trending TV/$$/@@`} className="viewall"><IconButton><ChevronRightIcon /></IconButton></Link></div>
          </div>
          <div className='trending_scroll' >
            {trending === "movie" && trendingMovie?.slice(0, 10)?.map((data, index) => {
              return <SingleContentScroll data={data} id={data.id} key={data?.id} type="movie" trending={true} index={index + 1} />
            })}
            {trending === "tv" && trendingTv?.slice(0, 10)?.map((data, index) => {
              return <SingleContentScroll data={data} id={data.id} key={data?.id} type="tv" trending={true} index={index + 1} />
            })}
          </div></>}

        {recommendationCast?.length !== 0 && <><br />
          <div className='trending_flex'>
            <img src={favouriteCast[0]?.data?.profile_path ? `https://image.tmdb.org/t/p/w342/${favouriteCast[0]?.data?.profile_path}` : "https://moviereelist.com/wp-content/uploads/2019/07/poster-placeholder.jpg"} className='trending_img' />
            <div>
              <div className='trending_title_small'>Because You Liked </div>
              <Link to={`/singlecast/${favouriteCast[0]?.id}/${favouriteCast[0]?.data?.name}`} style={{ textDecoration: 'none' }}>
                <div className='trending_title_subtitle'>{favouriteCast[0]?.data?.name}</div>
              </Link>
            </div>
          </div>
          <div className='trending_scroll'>
            {recommendationCast?.map((data, index) => {
              return <SingleContentScroll index={index} data={data} id={data.id} key={index} type={data?.media_type} recom={true} showtv={true} />
            })}
          </div></>}

        {(topratedmovie?.length !== 0 || topratedtv?.length !== 0) && <><br />
          <div className='trending_flex'>
            <div className='trending_title'><StarRateIcon /> Top Rated <Switch data={topRated} setData={setTopRated} />
              <Link to={topRated === "movie" ? `/singlecategory/top_rated/movie/Top Rated Movie/$$/@@` : `/singlecategory/top_rated/tv/Top Rated TV/$$/@@`} className="viewall"><IconButton><ChevronRightIcon /></IconButton></Link></div>
          </div>
          <div className='trending_scroll'>
            {topRated === "movie" && topratedmovie?.slice(0, 10)?.map((data, index) => {
              return <SingleContentScroll index={index} data={data} id={data.id} key={data?.id} type="movie" />
            })}
            {topRated === "tv" && topratedtv?.slice(0, 10)?.map((data, index) => {
              return <SingleContentScroll index={index} data={data} id={data.id} key={data?.id} type="tv" />
            })}
          </div></>}

        {(providersMovie?.length !== 0 || providersTV?.length !== 0) && <><br />
          <div className='trending_flex'>
            <div className='trending_title'>{providerType === "movie" ? <MovieIcon /> : <TvIcon />} Browse By Platform <Switch data={providerType} setData={setProviderType} /></div>
          </div>
          <div className='trending_scroll' >
            {providerType === "movie" && providersMovie?.map((data) => {
              return <Providers key={data?.provider_id} data={data} type={"movie"} />
            })}
            {providerType === "tv" && providersTV?.map((data) => {
              return <Providers key={data?.provider_id} data={data} type={"tv"} />
            })}
          </div>
        </>}

        <Footer />

      </div>
    </>
  )
}
