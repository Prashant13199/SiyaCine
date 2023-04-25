import React, { useEffect, useState } from 'react'
import { database, auth } from '../../firebase'
import './style.css'
import SingleContent from '../../Components/SingleContent'
import { IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useHistory } from 'react-router-dom'
export default function Profile() {

  const uid = localStorage.getItem('uid')
  const [currentusername, setCurrentUsername] = useState('')
  const [currentPhoto, setCurrentPhoto] = useState('')
  const [watchlistMovie, setWatchlistMovie] = useState([])
  const [watchlistTV, setWatchlistTV] = useState([])
  const [favouriteMovie, setFavouriteMovie] = useState([])
  const [favouriteTV, setFavouriteTV] = useState([])
  const [watchingMovie, setWatchingMovie] = useState([])
  const [watchingTV, setWatchingTV] = useState([])
  const history = useHistory()

  const signOut = () => {
    auth.signOut().then(() => {
      history.push('/')
      localStorage.clear()
      window.location.reload()
    })
  }

  useEffect(() => {
    database.ref(`/Users/${uid}`).on('value', snapshot => {
      setCurrentUsername(snapshot.val()?.username)
      setCurrentPhoto(snapshot.val()?.photo)
    })
  }, [])

  useEffect(() => {
    let arr = []
    database.ref(`/Users/${uid}/watchlist/movie`).on('value', snapshot => {
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, data: snap.val().data })
      })
    })
    setWatchlistMovie(arr)
  }, [])

  useEffect(() => {
    let arr = []
    database.ref(`/Users/${uid}/watchlist/tv`).on('value', snapshot => {
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, data: snap.val().data })
      })
    })
    setWatchlistTV(arr)
  }, [])

  useEffect(() => {
    let arr = []
    database.ref(`/Users/${uid}/favourites/movie`).on('value', snapshot => {
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, data: snap.val().data })
      })
    })
    setFavouriteMovie(arr)
  }, [])

  useEffect(() => {
    let arr = []
    database.ref(`/Users/${uid}/favourites/tv`).on('value', snapshot => {
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, data: snap.val().data })
      })
    })
    setFavouriteTV(arr)
  }, [])

  useEffect(() => {
    let arr = []
    database.ref(`/Users/${uid}/watching/movie`).on('value', snapshot => {
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, data: snap.val().data })
      })
    })
    setWatchingMovie(arr)
  }, [])

  useEffect(() => {
    let arr = []
    database.ref(`/Users/${uid}/watching/tv`).on('value', snapshot => {
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, data: snap.val().data })
      })
    })
    setWatchingTV(arr)
  }, [])

  return (
    <div className='Profile'>
      <div className='profile_header'>
        <div>
          <img src={currentPhoto} className='profile_image' />
        </div>
        <div className="profile_actions">
          <div className='profile_username'>{currentusername}</div>
          <IconButton onClick={() => signOut()}><LogoutIcon /></IconButton>
        </div>
      </div>
      {watchingMovie.length !== 0 && <><br /><br />
        <div className='trending_title'>Watching Now (Movies)</div>
        <div className='trending_scroll'>
          {watchingMovie && watchingMovie.map((data) => {
            return <SingleContent data={data.data} key={data.id} type='movie' />
          })}
        </div></>}
        {watchingTV.length !== 0 && <><br /><br />
        <div className='trending_title'>Watching Now (TV)</div>
        <div className='trending_scroll'>
          {watchingTV && watchingTV.map((data) => {
            return <SingleContent data={data.data} key={data.id} type='tv' />
          })}
        </div></>}
      {watchlistMovie.length !== 0 && <><br /><br />
        <div className='trending_title'>Watchlist (Movies)</div>
        <div className='trending_scroll'>
          {watchlistMovie && watchlistMovie.map((data) => {
            return <SingleContent data={data.data} key={data.id} type='movie' />
          })}
        </div></>}
      {watchlistTV.length !== 0 && <> <br /><br />
        <div className='trending_title'>Watchlist (TV)</div>
        <div className='trending_scroll'>
          {watchlistTV && watchlistTV.map((data) => {
            return <SingleContent data={data.data} key={data.id} type="tv" />
          })}
        </div></>}
      {favouriteMovie.length !== 0 && <><br /><br />
        <div className='trending_title'>Favourites (Movie)</div>
        <div className='trending_scroll'>
          {favouriteMovie && favouriteMovie.map((data) => {
            return <SingleContent data={data.data} key={data.id} type='movie' />
          })}
        </div></>}
      {favouriteTV.length !== 0 && <><br /><br />
        <div className='trending_title'>Favourites (TV)</div>
        <div className='trending_scroll'>
          {favouriteTV && favouriteTV.map((data) => {
            return <SingleContent data={data.data} key={data.id} type="tv" />
          })}
        </div></>}
    </div>

  )
}
