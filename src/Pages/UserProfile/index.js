import React, { useEffect, useState } from 'react'
import { database } from '../../firebase'
import './style.css'
import { useParams } from 'react-router-dom'
import SingleContentScroll from '../../Components/SingleContentScroll'
import empty from '../../assets/empty.png'
import Cast from '../../Components/Cast'
import { Link } from 'react-router-dom'

export default function UserProfile() {

  const { uid } = useParams()
  const [username, setUsername] = useState('')
  const [photo, setPhoto] = useState('')
  const [watchlist, setWatchlist] = useState([])
  const [watched, setWatched] = useState([])
  const [favourite, setFavourite] = useState([])
  const [watching, setWatching] = useState([])
  const [cast, setCast] = useState([])
  const [number, setNumber] = useState(null)
  const [checked, setChecked] = useState(false);

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
    database.ref(`/Users/${uid}/watchlist`).on('value', snapshot => {
      let arr = []
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, data: snap.val().data, type: snap.val().type })
      })
      setWatchlist(arr)
    })
  }, [uid])

  useEffect(() => {
    database.ref(`/Users/${uid}/watched`).on('value', snapshot => {
      let arr = []
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, data: snap.val().data, type: snap.val().type })
      })
      setWatched(arr)
    })
  }, [])

  useEffect(() => {
    database.ref(`/Users/${uid}/favourites`).on('value', snapshot => {
      let arr = []
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, data: snap.val().data, type: snap.val().type })
      })
      setFavourite(arr)
    })
  }, [uid])

  useEffect(() => {
    database.ref(`/Users/${uid}/watching`).on('value', snapshot => {
      let arr = []
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, data: snap.val().data, type: snap.val().type })
      })
      setWatching(arr)
    })
  }, [uid])

  useEffect(() => {
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
      <Link to={`/singlecontent/${favourite[number]?.id}/${favourite[number]?.type}`} style={{ textDecoration: 'none' }}>
        <div className='welcome' style={{ backgroundImage: favourite.length !== 0 && number ? `url(https://image.tmdb.org/t/p/original/${favourite[number].data.backdrop_path})` : 'linear-gradient(0deg, rgba(34,193,195,1) 0%, rgba(253,187,45,1) 100%)', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', borderRadius: '10px' }}>
          <div className='welcome_backdrop'>
            <div style={{ width: '100%' }}>
              <div className='profile_header'>
                <div>
                  <img alt="" src={photo ? photo : `https://api.dicebear.com/6.x/thumbs/png?seed=Spooky`} className='profile_image' />
                </div>
                <div className="profile_actions">
                  <div className='profile_username'>{username ? username.length > 15 ? username.substring(0, 15).concat('...') : username : 'Loading...'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
      {watching.length !== 0 && <><br />
        <div className='trending_title' >Watching Now ({watching?.length})</div>
        <div className='trending_scroll' >
          {watching && watching.map((data) => {
            return <SingleContentScroll data={data.data} key={data.id} type={data.type} />
          })}
        </div></>}
      {watchlist.length !== 0 && <><br />
        <div className='trending_title' >Watchlist ({watchlist?.length})</div>
        <div className='trending_scroll' >
          {watchlist && watchlist.map((data) => {
            return <SingleContentScroll data={data.data} key={data.id} type={data.type} />
          })}
        </div></>}
      {watched.length !== 0 && <><br />
        <div className='trending_title' >Watched ({watched?.length})</div>
        <div className='trending_scroll' >
          {watched && watched.map((data) => {
            return <SingleContentScroll data={data.data} key={data.id} type={data.type} />
          })}
        </div></>}
      {favourite.length !== 0 && <><br />
        <div className='trending_title' >Favourites ({favourite?.length})</div>
        <div className='trending_scroll' >
          {favourite && favourite.map((data) => {
            return <SingleContentScroll data={data.data} key={data.id} type={data.type} />
          })}
        </div></>}
      {cast.length !== 0 && <><br />
        <div className='trending_title' >Favourite Cast</div>
        <div className='trending_scroll' >
          {cast && cast.map((c) => {
            return <Cast c={c} />
          })}
        </div></>}
      {favourite.length === 0 && cast.length === 0 && watchlist.length === 0 && watching.length === 0 && <center><br />
        <img src={empty} width={'100px'} height={'auto'} alt="" />
        <h6 style={{ color: 'gray' }}>Nothing to show</h6></center>}
    </div>

  )
}
