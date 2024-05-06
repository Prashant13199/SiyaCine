import React, { useEffect, useState } from 'react'
import { auth, database } from '../../firebase'
import './style.css'
import { useParams } from 'react-router-dom'
import SingleContentScroll from '../../Components/SingleContentScroll'
import empty from '../../assets/empty.png'
import Cast from '../../Components/Cast'
import { CircularProgress, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Count from '../../Components/Count'
import Premium from '../../Components/Premium'

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
  const [loading, setLoading] = useState(true)
  const [admin, setAdmin] = useState(false)
  const [premium, setPremium] = useState(false)

  useEffect(() => {
    scrollTop()
  }, [])

  useEffect(() => {
    setBackdrop(window.innerWidth > 900 ? favourite[number]?.data?.backdrop_path : favourite[number]?.data?.poster_path)
  }, [favourite, number, window.innerWidth])

  useEffect(() => {
    setNumber(Math.floor(Math.random() * favourite.length))
  }, [favourite.length])

  useEffect(() => {
    database.ref(`/Users/${uid}`).on('value', snapshot => {
      setUsername(snapshot.val()?.username?.split('@')[0])
      setPhoto(snapshot.val()?.photo)
      setLoading(false)
    })
    database.ref(`/Users/${auth?.currentUser?.uid}/admin`).on('value', snapshot => {
      setAdmin(snapshot.val())
    })
    database.ref(`/Users/${uid}/watchlist`).orderByChild('timestamp').on('value', snapshot => {
      let arr = []
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, data: snap.val().data, type: snap.val().type })
      })
      setWatchlist(arr.reverse())
    })
    database.ref(`/Users/${uid}/watched`).orderByChild('timestamp').on('value', snapshot => {
      let arr = []
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, data: snap.val().data, type: snap.val().type })
      })
      setWatched(arr.reverse())
    })
    database.ref(`/Users/${uid}/favourites`).orderByChild('timestamp').on('value', snapshot => {
      let arr = []
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, data: snap.val().data, type: snap.val().type })
      })
      setFavourite(arr.reverse())
    })
    database.ref(`/Users/${uid}/watching`).orderByChild('timestamp').on('value', snapshot => {
      let arr = []
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, data: snap.val().data, type: snap.val().type })
      })
      setWatching(arr.reverse())
    })
    database.ref(`/Users/${uid}/cast`).orderByChild('timestamp').on('value', snapshot => {
      let arr = []
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, data: snap.val().data })
      })
      setCast(arr.reverse())
    })
    database.ref(`/Users/${uid}/premium`).on('value', snapshot => {
      setPremium(snapshot.val())
    })
  }, [uid])

  const handlePremium = () => {
    if (admin) {
      if (!premium) {
        database.ref(`/Users/${uid}`).update({
          premium: true
        }).then(() => {
          setPremium(true)
        })
      } else {
        database.ref(`/Users/${uid}/premium`).remove().then(() => {
          setPremium(false)
        })
      }
    }

  }

  return !loading ? (

    <div className='profile'>
      <div className='profile_header'>
        <div className='pic_container'>
          <img alt="" src={photo ? photo : `https://api.dicebear.com/8.x/fun-emoji/svg?seed=fun?size=96`} className='profile_image' />
        </div>
        <div className='profile_right'>
          <h1 className='profile_username'>{username ? username : 'Loading username...'}</h1>
          <div onClick={() => { handlePremium() }} className={admin && 'handlepremium'}>
            <Premium premium={premium} />
          </div>
        </div>
      </div>

      {watching.length !== 0 && <>
        <div className='trending_title' ><Count value={watching?.length} />Watching Now</div>
        <div className='trending_scroll' >
          {watching && watching.map((data) => {
            return <SingleContentScroll data={data.data} key={data.id} type={data.type} />
          })}
        </div><br /></>}
      {watchlist.length !== 0 && <>
        <div className='trending_title' ><Count value={watchlist?.length} />Watchlist<Link to={`/singlecategory/watchlist/Trending/Watchlist/${uid}`} className="viewall"><IconButton><ChevronRightIcon /></IconButton></Link></div>
        <div className='trending_scroll' >
          {watchlist && watchlist.map((data) => {
            return <SingleContentScroll data={data.data} key={data.id} type={data.type} />
          })}
        </div><br /></>}
      {watched.length !== 0 && <>
        <div className='trending_title' ><Count value={watched?.length} />Watched<Link to={`/singlecategory/watched/Trending/Watched/${uid}`} className="viewall"><IconButton><ChevronRightIcon /></IconButton></Link></div>
        <div className='trending_scroll' >
          {watched && watched.map((data) => {
            return <SingleContentScroll data={data.data} key={data.id} type={data.type} />
          })}
        </div><br /></>}
      {favourite.length !== 0 && <>
        <div className='trending_title' ><Count value={favourite?.length} />Favourites<Link to={`/singlecategory/favourites/Trending/Favourites/${uid}`} className="viewall"><IconButton><ChevronRightIcon /></IconButton></Link></div>
        <div className='trending_scroll' >
          {favourite && favourite.map((data) => {
            return <SingleContentScroll data={data.data} key={data.id} type={data.type} />
          })}
        </div><br /></>}
      {cast.length !== 0 && <>
        <div className='trending_title' ><Count value={cast?.length} />Favourite Cast</div>
        <div className='trending_scroll' >
          {cast && cast.map((c) => {
            return <Cast c={c} key={c?.id} />
          })}
        </div><br /></>}
      {favourite?.length === 0 && cast?.length === 0 && watchlist?.length === 0 && watching?.length === 0 && <center><br />
        <img src={empty} className='empty' alt="" />
        <h6 style={{ color: 'gray' }}>Nothing to show here</h6></center>}
    </div>

  )
    : <div className="loading">
      <CircularProgress color='warning' />
    </div>
}
