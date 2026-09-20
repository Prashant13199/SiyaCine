import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './style.css'
import axios from "axios";
import { IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { auth, database } from '../../firebase'
import Tooltip from '@mui/material/Tooltip';
import SingleContentScroll from '../../Components/SingleContentScroll';
import { useTheme } from '@mui/material';
import { CircularProgress, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { Helmet } from 'react-helmet';
import { useLayoutEffect } from 'react';
import MovieIcon from '@mui/icons-material/Movie';
import TvIcon from '@mui/icons-material/Tv';

export default function SingleCastPage({ scrollTop }) {

  const { id } = useParams()
  const [data, setData] = useState([])
  const [favourite, setFavourite] = useState(false)
  const [movie, setMovie] = useState([])
  const [tv, setTv] = useState([])
  const theme = useTheme()
  const [loading, setLoading] = useState(true)
  const [backdrop, setBackdrop] = useState('')
  const [sortBy, setSortby] = useState('popularity')
  const [sortByTv, setSortbyTv] = useState('popularity')

  useEffect(() => {
    database.ref(`/Users/${auth?.currentUser?.uid}/cast/${id}`).on('value', snapshot => {
      if (snapshot.val()?.id === id) {
        setFavourite(true)
      }
    })
  }, [auth?.currentUser?.uid])

  useEffect(() => {
    let sortedArr = [...movie];
    if (sortBy === "popularity") {
      sortedArr.sort((a, b) => b.popularity - a.popularity);
    } else if (sortBy === "rating") {
      sortedArr.sort((a, b) => b.vote_average - a.vote_average);
    } else {
      sortedArr.sort((a, b) => b.release_date.localeCompare(a.release_date));
    }
    setMovie(sortedArr)
  }, [sortBy, movie])

  useEffect(() => {
    let sortedArr = [...tv];
    if (sortByTv === "popularity") {
      sortedArr.sort((a, b) => b.popularity - a.popularity);
    } else if (sortByTv === "rating") {
      sortedArr.sort((a, b) => b.vote_average - a.vote_average);
    } else {
      sortedArr.sort((a, b) => b.first_air_date.localeCompare(a.first_air_date));
    }
    setTv(sortedArr)
  }, [sortByTv, tv])

  useLayoutEffect(() => {
    scrollTop()
    fetchDetails();
    fetchMovieCredits();
    fetchTvCredits();
  }, [id])

  const addBackdrop = () => {
    setBackdrop(window.innerWidth > 900 ? movie[0]?.backdrop_path : '');
  }

  useLayoutEffect(() => {
    addBackdrop()
    window.addEventListener('resize', addBackdrop)
  }, [movie])

  const fetchDetails = async () => {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/person/${id}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
      );
      setData(data);
      setLoading(false);
    }
    catch (e) {
      console.log(e)
    }
  };

  const fetchMovieCredits = async () => {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
      );
      setMovie(data.cast);
    }
    catch (e) {
      console.log(e)
    }
  };

  const fetchTvCredits = async () => {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/person/${id}/tv_credits?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
      );
      setTv(data.cast);
      console.log(data.cast)
    }
    catch (e) {
      console.log(e)
    }
  };

  const handleFavourite = () => {
    if (!favourite) {
      database.ref(`/Users/${auth?.currentUser?.uid}/cast/${id}`).set({
        id: id, data: data,
      }).then(() => {
        setFavourite(true)
      })
    } else {
      database.ref(`/Users/${auth?.currentUser?.uid}/cast/${id}`).remove().then(() => {
        setFavourite(false)
      })
    }
  }

  return (
    <>
      <Helmet>
        <title>SiyaCine - Cast{data?.name ? ` - ${data?.name}` : ''}</title>
      </Helmet>
      {!loading ?
        <div className='singlecastpage'>
          <div className='singlecontent_responsive_cast' style={{ backgroundImage: backdrop && `url(https://image.tmdb.org/t/p/original/${backdrop})` }}>
            <div className={window?.innerWidth > 900 ? 'profile_backdrop' : ''}>
              <div className='pic_container'>
                <img alt="" src={data.profile_path ? `https://image.tmdb.org/t/p/w342/${data.profile_path}` : "https://moviereelist.com/wp-content/uploads/2019/07/poster-placeholder.jpg"} className='singlecontentposter' />
              </div>
              <div className='details'>
                <div className='mobile_center'>
                  <h1>{data.name}</h1>
                  <div className='actions'>
                    {auth?.currentUser?.uid && <div>
                      <Tooltip title="Favourite">
                        <IconButton style={{ backgroundColor: theme.palette.action.disabledBackground }} onClick={() => handleFavourite()}>
                          {favourite ? <FavoriteIcon style={{ color: 'red' }} /> : <FavoriteIcon style={{ color: 'white' }} />}
                        </IconButton>
                      </Tooltip>
                    </div>}
                  </div>
                </div>
                {data.birthday && <div className='overview'>
                  <h4>Birthday</h4>
                  {data.birthday}
                </div>}
                {data.place_of_birth && <div className='overview'>
                  <h4>Place of Birth</h4>
                  {data.place_of_birth}
                </div>}
                {data.known_for_department && <div className='overview'>
                  <h4>Known for department</h4>
                  {data.known_for_department}
                </div>}
                {data.biography && <div className='overview animateBelow'>
                  <h4>Biography</h4>
                  <div className='overviewHeight'>
                    {data.biography}
                  </div>
                </div>}
              </div>
            </div>
          </div>
          {movie?.length !== 0 && <><br />
            <div className='trending_flex'>
              <div className='trending_title' ><MovieIcon /> Movie</div>
              <div className='sortByContainerCast'>
                <FormControl variant="standard" color="warning" sx={{ m: 1, minWidth: 80 }} size="small">
                  <InputLabel id="demo-simple-select-label">Sort By</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={sortBy}
                    onChange={(e) => setSortby(e.target.value)}
                  >
                    <MenuItem value={"popularity"}>Popularity</MenuItem>
                    <MenuItem value={"date"}>Release Date</MenuItem>
                    <MenuItem value={"rating"}>Rating</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>

            <div style={{ marginTop: '10px' }}></div>
            <div className='trending_scroll' >
              {movie?.map((data, index) => {
                return <SingleContentScroll data={data} id={data.id} key={index} type="movie" />
              })}
            </div>
          </>}

          {tv?.length !== 0 && <><br />
            <div className='trending_flex'>
              <div className='trending_title' ><TvIcon /> TV</div>
              <div className='sortByContainerCast'>
                <FormControl variant="standard" color="warning" sx={{ m: 1, minWidth: 80 }} size="small">
                  <InputLabel id="demo-simple-select-label">Sort By</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={sortByTv}
                    onChange={(e) => setSortbyTv(e.target.value)}
                  >
                    <MenuItem value={"popularity"}>Popularity</MenuItem>
                    <MenuItem value={"date"}>Release Date</MenuItem>
                    <MenuItem value={"rating"}>Rating</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
            <div style={{ marginTop: '10px' }}></div>
            <div className='trending_scroll' >
              {tv?.map((data, index) => {
                return <SingleContentScroll data={data} id={data.id} key={index} type="tv" />
              })}
            </div>
          </>}

        </div>
        : <div className="loading">
          <CircularProgress color='warning' />
        </div>
      }
    </>
  )

}
