import React, { useEffect, useState } from 'react'
import { database } from '../../firebase'
import './style.css'
import SingleContent from '../../Components/SingleContent'
import { useParams, Link } from 'react-router-dom'

export default function UserProfile() {

  const { uid } = useParams()
  const [username, setUsername] = useState('')
  const [photo, setPhoto] = useState('')
  const [watchlist, setWatchlist] = useState([])
  const [favourite, setFavourite] = useState([])
  const [watching, setWatching] = useState([])
  const [cast, setCast] = useState([])
  const [number, setNumber] = useState('')

  useEffect(() => {
    database.ref(`/Users/${uid}`).on('value', snapshot => {
      setUsername(snapshot.val()?.username)
      setPhoto(snapshot.val()?.photo)
    })
  }, [uid])

  useEffect(() => {
    setNumber(Math.floor(Math.random() * favourite.length))
  }, [favourite.length])

  useEffect(() => {
    let arr = []
    database.ref(`/Users/${uid}/watchlist`).on('value', snapshot => {
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, data: snap.val().data, type: snap.val().type })
      })
    })
    setWatchlist(arr)
  }, [uid])

  useEffect(() => {
    let arr = []
    database.ref(`/Users/${uid}/favourites`).on('value', snapshot => {
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, data: snap.val().data, type: snap.val().type })
      })
    })
    setFavourite(arr)
  }, [uid])

  useEffect(() => {
    let arr = []
    database.ref(`/Users/${uid}/watching`).on('value', snapshot => {
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, data: snap.val().data, type: snap.val().type })
      })
    })
    setWatching(arr)
  }, [uid])

  useEffect(() => {
    let arr = []
    database.ref(`/Users/${uid}/cast`).on('value', snapshot => {
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, data: snap.val().data })
      })
    })
    setCast(arr)
  }, [uid])

  return (
    <div className='Profile'>
      <div className='welcome' style={{ backgroundImage: favourite.length !== 0 ? `url(https://image.tmdb.org/t/p/original/${favourite[number].data.backdrop_path})` : 'linear-gradient(0deg, rgba(34,193,195,1) 0%, rgba(253,187,45,1) 100%)', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}>
        <div className='welcome_backdrop'>
          <div style={{ width: '100%' }}>
            <div className='profile_header'>
              <div>
                <img alt="" src={photo} className='profile_image' />
              </div>
              <div className="profile_actions">
                <div className='profile_username'>{username}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
      {watching.length !== 0 && <><br />
        <div className='trending_title'>Watching Now</div>
        <div className='trending_scroll'>
          {watching && watching.map((data) => {
            return <SingleContent data={data.data} key={data.id} type={data.type} />
          })}
        </div></>}
      {watchlist.length !== 0 && <><br />
        <div className='trending_title'>Watchlist</div>
        <div className='trending_scroll'>
          {watchlist && watchlist.map((data) => {
            return <SingleContent data={data.data} key={data.id} type={data.type} />
          })}
        </div></>}
      {favourite.length !== 0 && <><br />
        <div className='trending_title'>Favourites</div>
        <div className='trending_scroll'>
          {favourite && favourite.map((data) => {
            return <SingleContent data={data.data} key={data.id} type={data.type} />
          })}
        </div></>}
      {cast.length !== 0 && <><br />
        <div className='trending_title'>Favourite Cast</div>
        <div className='trending_scroll'>
          {cast && cast.map((c) => {
            return <Link to={`/singlecast/${c.id}`} style={{ textDecoration: 'none', color: 'black' }}>
              <div className='cast_single'>
                <img alt="" src={c.data.profile_path ? `https://image.tmdb.org/t/p/w500/${c.data.profile_path}` : "https://upload.wikimedia.org/wikipedia/en/6/60/No_Picture.jpg"} className='cast_image' />
                <div style={{ marginTop: '5px' }}>
                  <div style={{ fontWeight: '500', maxWidth: '150px' }}>{c.data.name}</div>
                </div>
              </div>
            </Link>
          })}
        </div></>}
      {favourite.length === 0 && cast.length === 0 && watchlist.length === 0 && watching.length === 0 && <><br />
        <h2 style={{ textAlign: 'center' }}>Nothing to show</h2></>}
      <br />
    </div>

  )
}
