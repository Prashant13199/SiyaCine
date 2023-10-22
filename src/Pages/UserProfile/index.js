import React, { useEffect, useState } from 'react'
import { database } from '../../firebase'
import './style.css'
import { useParams } from 'react-router-dom'
import SingleContentScroll from '../../Components/SingleContentScroll'
import empty from '../../assets/empty.png'
import Cast from '../../Components/Cast'

export default function UserProfile({ setBackdrop, scrollTop }) {

  const { uid } = useParams()
  const [username, setUsername] = useState('')
  const [photo, setPhoto] = useState('')
  const [watchlist, setWatchlist] = useState([])
  const [watched, setWatched] = useState([])
  const [favourite, setFavourite] = useState([])
  const [watching, setWatching] = useState([])
  const [cast, setCast] = useState([])
  const [number, setNumber] = useState(null)

  useEffect(() => {
    scrollTop()
  }, [])

  useEffect(() => {
    setBackdrop(window.innerWidth > 600 ? favourite[number]?.data?.backdrop_path : favourite[number]?.data?.poster_path)
  }, [favourite, number])

  useEffect(() => {
    setNumber(Math.floor(Math.random() * favourite.length))
  }, [favourite.length])

  useEffect(() => {
    database.ref(`/Users/${uid}`).on('value', snapshot => {
      setUsername(snapshot.val()?.username)
      setPhoto(snapshot.val()?.photo)
    })
    database.ref(`/Users/${uid}/watchlist`).on('value', snapshot => {
      let arr = []
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, data: snap.val().data, type: snap.val().type })
      })
      setWatchlist(arr)
    })
    database.ref(`/Users/${uid}/watched`).on('value', snapshot => {
      let arr = []
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, data: snap.val().data, type: snap.val().type })
      })
      setWatched(arr)
    })
    database.ref(`/Users/${uid}/favourites`).on('value', snapshot => {
      let arr = []
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, data: snap.val().data, type: snap.val().type })
      })
      setFavourite(arr)
    })
    database.ref(`/Users/${uid}/watching`).on('value', snapshot => {
      let arr = []
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, data: snap.val().data, type: snap.val().type })
      })
      setWatching(arr)
    })
    database.ref(`/Users/${uid}/cast`).on('value', snapshot => {
      let arr = []
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, data: snap.val().data })
      })
      setCast(arr)
    })
  }, [uid])

  return (

    <div className='Profile'>
      <div className='profile_header'>
        <div>
          <img alt="" src={photo ? photo : `https://api.dicebear.com/6.x/thumbs/png?seed=Spooky`} className='profile_image' />
        </div>
        <div className="profile_actions">
          <div className='profile_username' style={{ maxWidth: window.innerWidth - 100 }}>{username ? username : 'Loading...'}</div>
        </div>
      </div>
      {watching.length !== 0 && <>
        <div className='trending_title' >Watching Now ({watching?.length})</div>
        <div className='trending_scroll' >
          {watching && watching.map((data) => {
            return <SingleContentScroll data={data.data} key={data.id} type={data.type} />
          })}
        </div><br /></>}
      {watchlist.length !== 0 && <>
        <div className='trending_title' >Watchlist ({watchlist?.length})</div>
        <div className='trending_scroll' >
          {watchlist && watchlist.map((data) => {
            return <SingleContentScroll data={data.data} key={data.id} type={data.type} />
          })}
        </div><br /></>}
      {watched.length !== 0 && <>
        <div className='trending_title' >Watched ({watched?.length})</div>
        <div className='trending_scroll' >
          {watched && watched.map((data) => {
            return <SingleContentScroll data={data.data} key={data.id} type={data.type} />
          })}
        </div><br /></>}
      {favourite.length !== 0 && <>
        <div className='trending_title' >Favourites ({favourite?.length})</div>
        <div className='trending_scroll' >
          {favourite && favourite.map((data) => {
            return <SingleContentScroll data={data.data} key={data.id} type={data.type} />
          })}
        </div><br /></>}
      {cast.length !== 0 && <>
        <div className='trending_title' >Favourite Cast</div>
        <div className='trending_scroll' >
          {cast && cast.map((c) => {
            return <Cast c={c} />
          })}
        </div><br /></>}
      {favourite.length === 0 && cast.length === 0 && watchlist.length === 0 && watching.length === 0 && <center><br />
        <img src={empty} className='empty' alt="" />
        <h6 style={{ color: 'gray' }}>Nothing to show here</h6></center>}
    </div>

  )
}
