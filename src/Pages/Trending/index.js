import React, { useEffect, useState } from 'react'
import './style.css'
import Header from '../../Containers/Header';
import { Link } from 'react-router-dom';
import SingleContentScroll from '../../Components/SingleContentScroll';
import { IconButton, useTheme } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import useFetchContent from '../../hooks/useFetchContent';
import { auth, database } from '../../firebase'
import axios from "axios";
import Footer from '../../Containers/Footer'
import { Helmet } from 'react-helmet';
import useFetchDBData from '../../hooks/useFetchDBData';

export default function Trending({ setBackdrop, scrollTop }) {

  const theme = useTheme()

  const [recommendation, setRecommendation] = useState([])
  const [number, setNumber] = useState(null)
  const [recommendationCast, setRecommendationCast] = useState([])
  const [numberCast, setNumberCast] = useState(null)
  const [premium, setPremium] = useState(false)

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

  useEffect(() => {
    scrollTop()
    setBackdrop()
  }, []);

  useEffect(() => {
    database.ref(`/Users/${auth?.currentUser?.uid}/premium`).on('value', snapshot => {
      setPremium(snapshot.val())
    })
  }, [auth?.currentUser?.uid])

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
              return <SingleContentScroll data={data.data} id={data.id} key={data.id} type={data.type} />
            })}
          </div></>}
        {nowplaying?.length !== 0 && <><br />
          <div className='trending_title' >
            Now Playing in Theatres
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

        {recommendation?.length !== 0 && <><br />
          <div className='trending_title gray' >Because You Watched</div>
          <div className='searchresultfor' >{favourite[number]?.data?.name || favourite[number]?.data?.title || favourite[number]?.data?.original_name}</div>
          <div className='trending_scroll' >
            {recommendation?.map((data, index) => {
              return <SingleContentScroll data={data} id={data.id} key={index} type={data?.media_type} recom={true} />
            })}
          </div></>}

        {indianMovie?.length !== 0 && <><br />
          <div className='trending_title' >Indian Origin Movie
            <Link to={`/singlecategory/discover/movie/Indian Origin Movie/$$`} className="viewall"><IconButton><ChevronRightIcon /></IconButton></Link></div>
          <div className='trending_scroll' >
            {indianMovie?.map((data) => {
              return <SingleContentScroll data={data} id={data.id} key={data?.id} type="movie" />
            })}
          </div></>}

        {indianTv?.length !== 0 && <><br />
          <div className='trending_title' >Indian Origin TV
            <Link to={`/singlecategory/discover/tv/Indian Origin TV/$$`} className="viewall"><IconButton><ChevronRightIcon /></IconButton></Link></div>
          <div className='trending_scroll' >
            {indianTv?.map((data) => {
              return <SingleContentScroll data={data} id={data.id} key={data?.id} type="tv" />
            })}
          </div></>}

        {trendingMovie?.length !== 0 && <><br />
          <div className='trending_title' >Trending Movie
            <Link to={`/singlecategory/trending/movie/Trending Movie/$$`} className="viewall"><IconButton><ChevronRightIcon /></IconButton></Link></div>
          <div className='trending_scroll' >
            {trendingMovie?.map((data) => {
              return <SingleContentScroll data={data} id={data.id} key={data?.id} type="movie" />
            })}
          </div></>}

        {trendingTv?.length !== 0 && <><br />
          <div className='trending_title' >Trending TV
            <Link to={`/singlecategory/trending/tv/Trending TV/$$`} className="viewall"><IconButton><ChevronRightIcon /></IconButton></Link></div>
          <div className='trending_scroll' >
            {trendingTv?.map((data) => {
              return <SingleContentScroll data={data} id={data.id} key={data?.id} type="tv" />
            })}
          </div></>}

        {recommendationCast?.length !== 0 && <><br />
          <div className='trending_title gray' >Because You Liked</div>
          <div className='searchresultfor' >{favouriteCast[numberCast]?.data?.name}</div>
          <div className='trending_scroll' >
            {recommendationCast?.map((data, index) => {
              return <SingleContentScroll data={data} id={data.id} key={index} type={data?.media_type} recom={true} showtv={true} />
            })}
          </div></>}

        {topratedmovie?.length !== 0 && <><br />
          <div className='trending_title' >Top Rated Movie
            <Link to={`/singlecategory/top_rated/movie/Top Rated Movie/$$`} className="viewall"><IconButton><ChevronRightIcon /></IconButton></Link></div>
          <div className='trending_scroll' >
            {topratedmovie?.map((data) => {
              return <SingleContentScroll data={data} id={data.id} key={data?.id} type="movie" />
            })}
          </div></>}

        {topratedtv?.length !== 0 && <><br />
          <div className='trending_title' >Top Rated TV
            <Link to={`/singlecategory/top_rated/tv/Top Rated TV/$$`} className="viewall"><IconButton><ChevronRightIcon /></IconButton></Link></div>
          <div className='trending_scroll' >
            {topratedtv?.map((data) => {
              return <SingleContentScroll data={data} id={data.id} key={data?.id} type="tv" />
            })}
          </div></>}

        {premium && <Footer />}

      </div>
    </>
  )
}
