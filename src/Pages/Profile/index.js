import React, { useEffect, useState } from 'react';
import { database, auth } from '../../firebase';
import './style.css';
import { IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useHistory } from 'react-router-dom';
import SingleContentScroll from '../../Components/SingleContentScroll';
import DeleteIcon from '@mui/icons-material/Delete';
import empty from '../../assets/empty.png'
import Cast from '../../Components/Cast';
import { useTheme } from '@mui/material';
import Button from '@mui/material/Button';
import { CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import useFetchDB from '../../hooks/useFetchDB'
import Count from '../../Components/Count';
import Premium from '../../Components/Premium';

export default function Profile({ setBackdrop, scrollTop }) {

  const [watchlist, setWatchlist] = useState([])
  const [watched, setWatched] = useState([])
  const [favourite, setFavourite] = useState([])
  const [cast, setCast] = useState([])
  const history = useHistory()
  const [number, setNumber] = useState(null)
  const theme = useTheme()
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [premium, setPremium] = useState(false)

  useEffect(() => {
    scrollTop()
  }, [])

  useEffect(() => {
    setBackdrop(window.innerWidth > 900 ? favourite[number]?.data?.backdrop_path : favourite[number]?.data?.poster_path)
  }, [favourite, number, window.innerWidth])

  useEffect(() => {
    randomNumber()
  }, [favourite.length])

  const randomNumber = () => {
    setNumber(Math.floor(Math.random() * favourite.length))
  }

  const signOut = () => {
    auth.signOut().then(() => {
      history.push('/')
    })
  }

  const currentPhoto = useFetchDB('photo')
  const currentUsername = useFetchDB('username')

  useEffect(() => {
    database.ref(`/Users/${auth?.currentUser?.uid}/premium`).on('value', snapshot => {
      setPremium(snapshot.val())
    })
    database.ref(`/Users/${auth?.currentUser?.uid}/watchlist`).on('value', snapshot => {
      let arr = []
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, data: snap.val().data, type: snap.val().type })
      })
      setWatchlist(arr)
    })
    database.ref(`/Users/${auth?.currentUser?.uid}/watched`).on('value', snapshot => {
      let arr = []
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, data: snap.val().data, type: snap.val().type })
      })
      setWatched(arr)
    })
    database.ref(`/Users/${auth?.currentUser?.uid}/favourites`).on('value', snapshot => {
      let arr = []
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, data: snap.val().data, type: snap.val().type })
      })
      setFavourite(arr)
    })
    database.ref(`/Users/${auth?.currentUser?.uid}/cast`).on('value', snapshot => {
      let arr = []
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, data: snap.val().data })
      })
      setCast(arr)
    })
    database.ref(`/Users/${auth?.currentUser?.uid}/suggestions`).on('value', snapshot => {
      let arr = []
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, data: snap.val().data, type: snap.val().type, by: snap.val().by, byuid: snap.val().byuid })
      })
      setSuggestions(arr)
    })
    setLoading(false)
  }, [auth?.currentUser?.uid])

  return !loading ? (
    <>
      <div className='Profile'>
        <div className='profile_header'>
          <div style={{ position: 'relative', width: 'fit-content' }}>
            <img src={currentPhoto ? currentPhoto : `https://api.dicebear.com/6.x/thumbs/png?seed=Bubba`} className='profile_image' />
          </div>
          <div className='profile_right'>
            <h1 className='profile_username'>{currentUsername ? currentUsername : 'Loading...'}</h1>
            <Premium premium={premium} />
            <Button
              startIcon={<LogoutIcon style={{ fontSize: '30px' }} />}
              className='button'
              target="__blank"
              onClick={() => signOut()}
              variant='contained'
              style={{ backgroundColor: theme.palette.background.default, color: theme.palette.text.primary, marginRight: '10px' }}
            >
              Sign Out
            </Button>
          </div>
        </div>
        {watchlist?.length !== 0 && <>
          <div className='trending_title' ><Count value={watchlist?.length} />Watchlist<Link to={`/singlecategory/watchlist/Trending/Watchlist/${auth?.currentUser?.uid}`} className="viewall"><IconButton><ChevronRightIcon /></IconButton></Link></div>
          <div className='trending_scroll' >
            {watchlist && watchlist.map((data) => {
              return <SingleContentScroll data={data.data} key={data.id} type={data.type} />
            })}
          </div><br /></>}
        {watched?.length !== 0 && <>
          <div className='trending_title' ><Count value={watched?.length} />Watched<Link to={`/singlecategory/watched/Trending/Watched/${auth?.currentUser?.uid}`} className="viewall"><IconButton><ChevronRightIcon /></IconButton></Link></div>
          <div className='trending_scroll' >
            {watched && watched.map((data) => {
              return <SingleContentScroll data={data.data} key={data.id} type={data.type} />
            })}
          </div><br /></>}
        {suggestions?.length !== 0 && <>
          <div className='trending_title' ><Count value={suggestions?.length} />Suggestions</div>
          <div className='trending_scroll' >
            {suggestions && suggestions.map((data) => {
              return <div>
                <SingleContentScroll data={data.data} key={data.id} type={data.type} by={data.by} byuid={data.byuid} id={data.id} />
              </div>
            })}
          </div><br /></>}
        {favourite?.length !== 0 && <>
          <div className='trending_title' ><Count value={favourite?.length} />Favourites<Link to={`/singlecategory/favourites/Trending/Favourites/${auth?.currentUser?.uid}`} className="viewall"><IconButton><ChevronRightIcon /></IconButton></Link></div>
          <div className='trending_scroll' >
            {favourite && favourite.map((data) => {
              return <SingleContentScroll data={data.data} key={data.id} type={data.type} />
            })}
          </div><br /></>}
        {cast?.length !== 0 && <>
          <div className='trending_title' ><Count value={cast?.length} />Favourite Cast</div>
          <div className='trending_scroll' >
            {cast && cast.map((c) => {
              return <Cast c={c} key={c.id} />
            })}
          </div><br /></>}
        {favourite?.length === 0 && cast?.length === 0 && watchlist?.length === 0 && <center><br />
          <img src={empty} className='empty' alt="" />
          <h6 style={{ color: 'gray' }}>Nothing to show here</h6></center>}
      </div>

    </>
  ) : <div className="loading">
    <CircularProgress color='warning' />
  </div>
}
