import React, { useContext, useEffect, useState } from 'react'
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
import { RecommendContext } from '../../Services/RecommendContext';

export default function Trending({ scrollTop }) {

  const { recommendation, favouriteData, nowplaying,
    topratedmovie, topratedtv, trendingMovie,
    trendingTv, providersMovie, providersTV, genres } = useContext(RecommendContext);

  const watching = useFetchDBData(auth?.currentUser?.uid, 'watching')
  const dbGenres = useFetchDBData(auth?.currentUser?.uid, 'genres')
  const myShows = useFetchMyShows()

  const [trending, setTrending] = useState('movie')
  const [topRated, setTopRated] = useState('movie')
  const [providerType, setProviderType] = useState('movie')
  const [languageType, setLanguageType] = useState('movie')

  useEffect(() => {
    scrollTop()
  }, []);

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
            <img src={favouriteData?.data?.poster_path ? `https://image.tmdb.org/t/p/w342/${favouriteData?.data?.poster_path}` : "https://moviereelist.com/wp-content/uploads/2019/07/poster-placeholder.jpg"} className='trending_img' />
            <div>
              <div className='trending_title_small'>Because You Liked</div>
              <Link to={`/singlecontent/${favouriteData?.data.id}/${favouriteData?.type}/${favouriteData?.data?.name || favouriteData?.data?.title}`} style={{ textDecoration: 'none' }}>
                <div className='trending_title_subtitle'>
                  {favouriteData?.data?.name || favouriteData?.data?.title || favouriteData?.data?.original_name}
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
            <Link className="link" to={`/singlecategory/language/${languageType}/Telugu ${languageType === "tv" ? "TV Shows" : "Movies"}/$$/te`}>
              <img className='languageImage' src="https://upload.wikimedia.org/wikipedia/commons/f/f4/తెలుగు.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original" />
            </Link>
            <Link className="link" to={`/singlecategory/language/${languageType}/Tamil ${languageType === "tv" ? "TV Shows" : "Movies"}/$$/ta`}>
              <img className='languageImage' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6P8IkuwtH2G8AjnjLg3tXwc0pSZXbZZKsraz3TbQWcw&s=10" />
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
              return <SingleContentScroll index={index} data={data} id={data.id} key={data?.id} type="movie" recom={true} />
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
