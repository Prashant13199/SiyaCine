import React, { useEffect, useState } from 'react'
import './style.css'
import Header from '../../Containers/Header';
import { Link } from 'react-router-dom';
import SingleContentScroll from '../../Components/SingleContentScroll';
import { IconButton, useTheme } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import useFetchContent from '../../hooks/useFetchContent';
import { auth } from '../../firebase'
import axios from "axios";
import Footer from '../../Containers/Footer'
import { Helmet } from 'react-helmet';
import useFetchDBData from '../../hooks/useFetchDBData';

export default function Trending({ setBackdrop, scrollTop }) {

  const theme = useTheme()

  const [switchTrending, setSwitchTrending] = useState(0)
  const [switchTopRated, setSwitchTopRated] = useState(0)
  const [switchPopular, setSwitchPopular] = useState(0)
  const [switchIndian, setSwitchIndian] = useState(0)
  const [recommendation, setRecommendation] = useState([])
  const [number, setNumber] = useState(null)
  const [recommendationCast, setRecommendationCast] = useState([])
  const [numberCast, setNumberCast] = useState(null)

  const watching = useFetchDBData(auth?.currentUser?.uid, 'watching')
  const favourite = useFetchDBData(auth?.currentUser?.uid, 'favourites')
  const favouriteCast = useFetchDBData(auth?.currentUser?.uid, 'cast')

  const nowplaying = useFetchContent('now_playing', 'movie')
  const popularmovie = useFetchContent('popular', 'movie')
  const populartv = useFetchContent('popular', 'tv')
  const topratedmovie = useFetchContent('top_rated', 'movie')
  const topratedtv = useFetchContent('top_rated', 'tv')
  const upcoming = useFetchContent('upcoming', 'movie')
  const trendingMovie = useFetchContent('trending', 'movie')
  const trendingTv = useFetchContent('trending', 'tv')
  const indianMovie = useFetchContent('discover', 'movie')
  const indianTv = useFetchContent('discover', 'tv')

  useEffect(() => {
    scrollTop()
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
        <title>SiayCine</title>
      </Helmet>

      <div className='trending'>

        <Header setBackdrop={setBackdrop} />

        {watching?.length !== 0 && <><br />
          <div className='trending_title' >Resume Playing</div>
          <div className='trending_scroll' >
            {watching && watching.map((data) => {
              return <SingleContentScroll data={data.data} key={data.id} type={data.type} />
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

        {recommendation?.length !== 0 && <><br />
          <div className='trending_title' >Because You Watched</div>
          <div className='searchresultfor' >{favourite[number]?.data?.name || favourite[number]?.data?.title || favourite[number]?.data?.original_name}</div>
          <div className='trending_scroll' >
            {recommendation?.map((data, index) => {
              return <SingleContentScroll data={data} key={index} type={data?.media_type} recom={true} />
            })}
          </div></>}

        {(indianMovie?.length !== 0 || indianTv?.length !== 0) && <><br />
          <div className='trending_title' >Indian Origin&nbsp;&nbsp;<div className='switch' onClick={() => setSwitchIndian(switchIndian === 0 ? 1 : 0)}>
            <div className={switchIndian === 0 ? 'switch_span_active' : 'switch_span'} style={{ backgroundColor: switchIndian === 0 && theme.palette.warning.main, color: switchIndian === 0 && theme.palette.warning.contrastText }}>Movie</div>
            <div className={switchIndian === 1 ? 'switch_span_active' : 'switch_span'} style={{ backgroundColor: switchIndian === 1 && theme.palette.warning.main, color: switchIndian === 1 && theme.palette.warning.contrastText }}>TV</div>
          </div><Link to={`/singlecategory/discover/${switchIndian === 0 ? 'movie' : 'tv'}/Indian ${switchIndian === 0 ? 'Movie' : 'TV'}/$$`} className="viewall"><IconButton><ChevronRightIcon /></IconButton></Link></div>
          <div className='trending_scroll' >
            {switchIndian === 0 && indianMovie?.map((data) => {
              return <SingleContentScroll data={data} key={data?.id} type="movie" />
            })}
            {switchIndian === 1 && indianTv?.map((data) => {
              return <SingleContentScroll data={data} key={data?.id} type="tv" />
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

        {recommendationCast?.length !== 0 && <><br />
          <div className='trending_title' >Because You Liked</div>
          <div className='searchresultfor' >{favouriteCast[numberCast]?.data?.name}</div>
          <div className='trending_scroll' >
            {recommendationCast?.map((data, index) => {
              return <SingleContentScroll data={data} key={index} type={data?.media_type} recom={true} />
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

        <Footer />

      </div>
    </>
  )
}
