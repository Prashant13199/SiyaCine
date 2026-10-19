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
import { IconButton } from '@mui/material';
import Providers from '../../Components/Providers/Providers';
import Live from '../../Containers/Live/Live';

export default function Trending({ scrollTop }) {

  const [recommendation, setRecommendation] = useState([])

  const watching = useFetchDBData(auth?.currentUser?.uid, 'watching')
  const favourite = useFetchDBData(auth?.currentUser?.uid, 'favourites')
  const dbGenres = useFetchDBData(auth?.currentUser?.uid, 'genres')

  const nowplaying = useFetchContent('now_playing', 'movie')
  const topratedmovie = useFetchContent('top_rated', 'movie')
  const topratedtv = useFetchContent('top_rated', 'tv')
  const trendingMovie = useFetchContent('trending', 'movie')
  const trendingTv = useFetchContent('trending', 'tv')
  const providersMovie = useFetchContent('providers', 'movie')
  const providersTV = useFetchContent('providers', 'tv')
  const genres = useFetchContent('genres', 'movie')
  const myShows = useFetchMyShows()

  const [trending, setTrending] = useState('movie')
  const [topRated, setTopRated] = useState('movie')
  const [providerType, setProviderType] = useState('movie')
  const [languageType, setLanguageType] = useState('movie')
  const [number, setNumber] = useState(0)

  useEffect(() => {
    scrollTop()
  }, []);

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  useEffect(() => {
    setNumber(getRandomInt(0, favourite?.length))
  }, [favourite])

  useEffect(() => {
    fetchRecommendation();
  }, [number])

  const fetchRecommendation = async () => {
    try {
      if (favourite[number]?.type) {
        const { data } = await axios.get(
          `https://api.themoviedb.org/3/${favourite[number]?.type}/${favourite[number]?.id}/recommendations?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&sort_by=popularity.desc&include_video=false`
        );
        setRecommendation(data.results.splice(0, 10));
      }
    }
    catch (e) {
      console.log(e)
    }
  };

  return (
    <>

      <Helmet>
        <title>Siyacine</title>
      </Helmet>

      <div className='trending'>

        <Header />

        {watching?.length !== 0 && auth?.currentUser?.uid && <><br />
          <div className='trending_flex'>
            <div className='trending_title'>Continue Watching
              {watching?.length > 10 && <Link to={`/singlecategory/watching/Trending/Watching/${auth?.currentUser?.uid}/@@`} className="viewall"><IconButton><ChevronRightIcon /></IconButton></Link>}
            </div>
          </div>
          <div className='trending_scroll' >
            {watching?.slice(0, 10)?.map((data, index) => {
              return <SingleContentScroll index={index} data={data.data} id={data.id} key={data.id} type={data.type} userid={auth?.currentUser?.uid} />
            })}
          </div></>}

        {nowplaying?.length !== 0 && <><br />
          <div className='trending_flex'>
            <div className='trending_title'>New Releases
              <Link to={`/singlecategory/now_playing/movie/New Releases/$$/@@`} className="viewall">
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
            <div className='trending_title'>IP TV</div>
          </div>
          <Live />
        </>

        {myShows?.length !== 0 && <><br />
          <div className='trending_flex'>
            <div className='trending_title'>Coming This Week</div>
          </div>
          <div className='trending_scroll'>
            {myShows?.map((data, index) => {
              return <SingleContentScroll index={index} data={data} id={data?.id} key={data?.id} type="tv" />
            })}
          </div>
        </>}

        {recommendation?.length !== 0 && <><br />
          <div className='trending_flex'>
            <img src={favourite[0]?.data?.poster_path ? `https://image.tmdb.org/t/p/w342/${favourite[number]?.data?.poster_path}` : "https://moviereelist.com/wp-content/uploads/2019/07/poster-placeholder.jpg"} className='trending_img' />
            <div>
              <div className='trending_title_small'>Because You Liked</div>
              <Link to={`/singlecontent/${favourite[number]?.data.id}/${favourite[number]?.type}/${favourite[number]?.data?.name || favourite[number]?.data?.title}`} style={{ textDecoration: 'none' }}>
                <div className='trending_title_subtitle'>
                  {favourite[number]?.data?.name || favourite[number]?.data?.title || favourite[number]?.data?.original_name}
                </div>
              </Link>
            </div>
          </div>
          <div className='trending_scroll' >
            {recommendation?.map((data, index) => {
              return <SingleContentScroll index={index} data={data} id={data.id} key={index} type={data?.media_type} recom={true} />
            })}
          </div></>}

        <>
          <br />
          <div className='trending_flex'>
            <div className='trending_title'>Explore By Language <Switch data={languageType} setData={setLanguageType} /></div>
          </div>
          <div className='trending_scroll' >
            <Link className="link" to={`/singlecategory/language/${languageType}/English ${languageType === "tv" ? "TV Shows" : "Movies"}/$$/en`}>
              <img className='languageImage' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-pBL41g7c9xL-W79fReGo1wsGtVQmvP8XNrTuBF1IR3avQclBwnVLZ7tW&s=10" />
            </Link>
            <Link className="link" to={`/singlecategory/language/${languageType}/Hindi ${languageType === "tv" ? "TV Shows" : "Movies"}/$$/hi`}>
              <img className='languageImage' src="https://img.jagranjosh.com/images/2022/September/1492022/compress_hindi_diwas_2022.jpg" />
            </Link>
            <Link className="link" to={`/singlecategory/language/${languageType}/Marathi ${languageType === "tv" ? "TV Shows" : "Movies"}/$$/mr`}>
              <img className='languageImage' src="https://akm-img-a-in.tosshub.com/indiatoday/images/story/202606/marathi-language-294517122-16x9_0.jpeg?VersionId=YsQAZmS.sphTKfI7HsbjA156yndqxc5z&size=690:388" />
            </Link>
            <Link className="link" to={`/singlecategory/language/${languageType}/Korean ${languageType === "tv" ? "TV Shows" : "Movies"}/$$/ko`}>
              <img className='languageImage' src="https://www.shutterstock.com/image-vector/south-korea-word-outline-icon-260nw-2571146977.jpg" />
            </Link>
          </div>
        </>

        {genres?.length !== 0 && <><br />
          <div className='trending_flex'>
            <div className='trending_title'>Your Next Watch
              <Link to={`/movies?values=${JSON.stringify(dbGenres).replaceAll('&', ':')}&pageM=${1}`} className="viewall">
                <IconButton><ChevronRightIcon /></IconButton>
              </Link>
            </div>
          </div>
          <div className='trending_scroll' >
            {genres?.slice(0, 10)?.map((data, index) => {
              return <SingleContentScroll index={index} data={data} id={data.id} key={data?.id} type="movie" />
            })}
          </div>
        </>}

        {(trendingMovie?.length !== 0 || trendingTv?.length !== 0) && <><br />
          <div className='trending_flex'>
            <div className='trending_title'>Top 10 <Switch data={trending} setData={setTrending} />
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

        {(topratedmovie?.length !== 0 || topratedtv?.length !== 0) && <><br />
          <div className='trending_flex'>
            <div className='trending_title'>Top Rated <Switch data={topRated} setData={setTopRated} />
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
            <div className='trending_title'>Browse By Platform <Switch data={providerType} setData={setProviderType} /></div>
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
