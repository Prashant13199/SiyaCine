import React, { useEffect, useState } from 'react'
import './style.css'
import Header from '../../Containers/Header';
import { Link } from 'react-router-dom';
import SingleContentScroll from '../../Components/SingleContentScroll';
import { IconButton } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import useFetchContent from '../../hooks/useFetchContent';
import { auth } from '../../firebase'
import axios from "axios";
import Footer from '../../Containers/Footer'
import { Helmet } from 'react-helmet';
import useFetchDBData from '../../hooks/useFetchDBData';
import useFetchMyShows from '../../hooks/useFetchMyShows';
import { Button, ButtonGroup } from 'react-bootstrap';

export default function Trending({ setBackdrop, scrollTop }) {

  const [recommendation, setRecommendation] = useState([])
  const [number, setNumber] = useState(null)
  const [recommendationCast, setRecommendationCast] = useState([])
  const [numberCast, setNumberCast] = useState(null)

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
  const myShows = useFetchMyShows()

  const [trending, setTrending] = useState('movie')
  const [indian, setIndian] = useState('movie')
  const [topRated, setTopRated] = useState('movie')

  useEffect(() => {
    scrollTop()
    setBackdrop()
  }, []);

  useEffect(() => {
    fetchRecommendation();
  }, [number])

  useEffect(() => {
    fetchRecommendationCast();
  }, [numberCast])

  useEffect(() => {
    randomNumber()
  }, [favourite?.length])

  useEffect(() => {
    randomNumberCast()
  }, [favouriteCast?.length])

  const randomNumber = () => {
    setNumber(Math.floor(Math.random() * favourite.length))
  }

  const randomNumberCast = () => {
    setNumberCast(Math.floor(Math.random() * favouriteCast.length))
  }

  const fetchRecommendation = async () => {
    try {
      if (favourite[number]?.type) {
        const { data } = await axios.get(
          `https://api.themoviedb.org/3/${favourite[number]?.type}/${favourite[number]?.id}/recommendations?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&sort_by=popularity.desc&include_video=false`
        );
        setRecommendation(data.results);
      }
    }
    catch (e) {
      console.log(e)
    }
  };

  const fetchRecommendationCast = async () => {
    try {
      if (favourite[number]?.type) {
        const { data } = await axios.get(
          `https://api.themoviedb.org/3/person/${favouriteCast[numberCast]?.id}/combined_credits?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
        );
        setRecommendationCast(data.cast);
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

        {watching?.length !== 0 && <><br />
          <div className='trending_title' >Resume Watching</div>
          <div className='trending_scroll' >
            {watching && watching.map((data) => {
              return <SingleContentScroll data={data.data} id={data.id} key={data.id} type={data.type} showIcon={true} />
            })}
          </div></>}

        {nowplaying?.length !== 0 && <><br />
          <div className='trending_title'>Playing in Theatres
            <Link to={`/singlecategory/now_playing/movie/Now Playing in Theatres/$$`} className="viewall">
              <IconButton><ChevronRightIcon /></IconButton>
            </Link>
          </div>
          <div className='trending_scroll' >
            {nowplaying?.map((data) => {
              return <SingleContentScroll data={data} id={data.id} key={data?.id} type="movie" />
            })}
          </div>
        </>}

        {myShows?.length !== 0 && <><br />
          <div className='trending_title'>Upcoming Episodes</div>
          <div className='trending_scroll'>
            {myShows?.map((data) => {
              return <SingleContentScroll data={data} id={data?.id} key={data?.id} type="tv" />
            })}
          </div>
        </>}

        {recommendation?.length !== 0 && <><br />
          <div className='trending_title'>Because You Watched {favourite[number]?.data?.name || favourite[number]?.data?.title || favourite[number]?.data?.original_name}</div>
          <div className='trending_scroll' >
            {recommendation?.map((data, index) => {
              return <SingleContentScroll data={data} id={data.id} key={index} type={data?.media_type} recom={true} />
            })}
          </div></>}

        {(indianMovie?.length !== 0 || indianTv?.length !== 0) && <><br />
          <div className='trending_title'>Indian Origin <ButtonGroup size='sm' className='switch_btn_group'>
            <Button className={indian === 'movie' ? 'switch_btn_active' : 'switch_btn'} size='sm' onClick={() => setIndian('movie')}>Movie</Button>
            <Button className={indian === 'tv' ? 'switch_btn_active' : 'switch_btn'} size='sm' onClick={() => setIndian('tv')}>TV</Button>
          </ButtonGroup>
            <Link to={indian === 'movie' ? `/singlecategory/discover/movie/Indian Origin Movie/$$` : `/singlecategory/discover/tv/Indian Origin TV/$$`} className="viewall"><IconButton><ChevronRightIcon /></IconButton></Link></div>
          <div className='trending_scroll' >
            {indian === "movie" && indianMovie?.map((data) => {
              return <SingleContentScroll data={data} id={data.id} key={data?.id} type="movie" />
            })}
            {indian === "tv" && indianTv?.map((data) => {
              return <SingleContentScroll data={data} id={data.id} key={data?.id} type="tv" />
            })}
          </div>
        </>}

        {(trendingMovie?.length !== 0 || trendingTv?.length !== 0) && <><br />
          <div className='trending_title'>Trending <ButtonGroup size='sm' className='switch_btn_group'>
            <Button className={trending === 'movie' ? 'switch_btn_active' : 'switch_btn'} size='sm' onClick={() => setTrending('movie')}>Movie</Button>
            <Button className={trending === 'tv' ? 'switch_btn_active' : 'switch_btn'} size='sm' onClick={() => setTrending('tv')}>TV</Button>
          </ButtonGroup>
            <Link to={trending === "movie" ? `/singlecategory/trending/movie/Trending Movie/$$` : `/singlecategory/trending/tv/Trending TV/$$`} className="viewall"><IconButton><ChevronRightIcon /></IconButton></Link></div>
          <div className='trending_scroll' >
            {trending === "movie" && trendingMovie?.map((data, index) => {
              return <SingleContentScroll data={data} id={data.id} key={data?.id} type="movie" trending={true} index={index + 1} />
            })}
            {trending === "tv" && trendingTv?.map((data, index) => {
              return <SingleContentScroll data={data} id={data.id} key={data?.id} type="tv" trending={true} index={index + 1} />
            })}
          </div></>}

        {recommendationCast?.length !== 0 && <><br />
          <div className='trending_title'>Because You Liked {favouriteCast[numberCast]?.data?.name}</div>
          <div className='trending_scroll'>
            {recommendationCast?.map((data, index) => {
              return <SingleContentScroll data={data} id={data.id} key={index} type={data?.media_type} recom={true} showtv={true} />
            })}
          </div></>}

        {(topratedmovie?.length !== 0 || topratedtv?.length !== 0) && <><br />
          <div className='trending_title'>Top Rated <ButtonGroup size='sm' className='switch_btn_group'>
            <Button className={topRated === 'movie' ? 'switch_btn_active' : 'switch_btn'} size='sm' onClick={() => setTopRated('movie')}>Movie</Button>
            <Button className={topRated === 'tv' ? 'switch_btn_active' : 'switch_btn'} size='sm' onClick={() => setTopRated('tv')}>TV</Button>
          </ButtonGroup>
            <Link to={topRated === "movie" ? `/singlecategory/top_rated/movie/Top Rated Movie/$$` : `/singlecategory/top_rated/tv/Top Rated TV/$$`} className="viewall"><IconButton><ChevronRightIcon /></IconButton></Link></div>
          <div className='trending_scroll'>
            {topRated === "movie" && topratedmovie?.map((data) => {
              return <SingleContentScroll data={data} id={data.id} key={data?.id} type="movie" />
            })}
            {topRated === "tv" && topratedtv?.map((data) => {
              return <SingleContentScroll data={data} id={data.id} key={data?.id} type="tv" />
            })}
          </div></>}

        <Footer />

      </div>
    </>
  )
}
