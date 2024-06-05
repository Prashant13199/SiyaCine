import React, { useEffect, useState } from 'react';
import { database, auth } from '../../firebase';
import './style.css';
import { IconButton, Tooltip } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useHistory } from 'react-router-dom';
import SingleContentScroll from '../../Components/SingleContentScroll';
import empty from '../../assets/empty.png'
import Cast from '../../Components/Cast';
import { useTheme } from '@mui/material';
import { CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import useFetchUserDetails from '../../hooks/useFetchUserDetails'
import Count from '../../Components/Count';
import { Helmet } from 'react-helmet';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';

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
  const [publicAcc, setPublicAcc] = useState(true)

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
      localStorage.clear()
      history.push('/')
    }).catch((e) => console.log(e))
  }

  const handlePublic = () => {
    if (publicAcc) {
      database.ref(`/Users/${auth?.currentUser?.uid}`).update({
        public: false
      }).then(() => {
        setPublicAcc(false)
      })
    } else {
      database.ref(`/Users/${auth?.currentUser?.uid}`).update({
        public: true
      }).then(() => {
        setPublicAcc(true)
      })
    }
  }

  const currentPhoto = useFetchUserDetails(auth?.currentUser?.uid, 'photo')
  const currentUsername = useFetchUserDetails(auth?.currentUser?.uid, 'username')

  useEffect(() => {
    database.ref(`/Users/${auth?.currentUser?.uid}/public`).on('value', snapshot => {
      setPublicAcc(snapshot.val())
    })
    database.ref(`/Users/${auth?.currentUser?.uid}/watchlist`).orderByChild('timestamp').on('value', snapshot => {
      let arr = []
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, data: snap.val().data, type: snap.val().type })
      })
      setWatchlist(arr.reverse())
    })
    database.ref(`/Users/${auth?.currentUser?.uid}/watched`).orderByChild('timestamp').on('value', snapshot => {
      let arr = []
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, data: snap.val().data, type: snap.val().type })
      })
      setWatched(arr.reverse())
    })
    database.ref(`/Users/${auth?.currentUser?.uid}/favourites`).orderByChild('timestamp').on('value', snapshot => {
      let arr = []
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, data: snap.val().data, type: snap.val().type })
      })
      setFavourite(arr.reverse())
    })
    database.ref(`/Users/${auth?.currentUser?.uid}/cast`).orderByChild('timestamp').on('value', snapshot => {
      let arr = []
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, data: snap.val().data })
      })
      setCast(arr.reverse())
    })
    database.ref(`/Users/${auth?.currentUser?.uid}/suggestions`).orderByChild('timestamp').on('value', snapshot => {
      let arr = []
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, data: snap.val().data, type: snap.val().type, by: snap.val().by, byuid: snap.val().byuid })
      })
      setSuggestions(arr.reverse())
    })
    setLoading(false)
  }, [auth?.currentUser?.uid])

  return (
    <>
      <Helmet>
        <title>SiyaCine{currentUsername ? ` - ${currentUsername}` : ''}</title>
      </Helmet>
      {!loading ? <div className='profile'>
        <div className='profile_header'>
          <div className='pic_container'>
            <img src={currentPhoto ? currentPhoto : 'https://api.dicebear.com/8.x/fun-emoji/svg?seed=fun?size=96'} className='profile_image' />
          </div>
          <div className='profile_right'>
            <h1>{currentUsername ? currentUsername : 'Loading...'}</h1>
            <div className='profile_actions'>
              <Tooltip title={publicAcc ? "Switch to Private" : 'Switch to Public'}>
                <IconButton style={{ backgroundColor: theme.palette.background.default, marginLeft: '20px' }} onClick={() => handlePublic()}>
                  {publicAcc ? <LockOpenIcon /> : <LockIcon color="warning" />}
                </IconButton>
              </Tooltip>
              <Tooltip title={'Logout'}>
                <IconButton style={{ backgroundColor: theme.palette.background.default, marginLeft: '10px' }} onClick={() => signOut()}>
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </div>
        {watchlist?.length !== 0 && <>
          <div className='trending_title' ><Count value={watchlist?.length} />Watchlist<Link to={`/singlecategory/watchlist/Trending/Watchlist/${auth?.currentUser?.uid}`} className="viewall"><IconButton><ChevronRightIcon /></IconButton></Link></div>
          <div className='trending_scroll' >
            {watchlist && watchlist.map((data) => {
              return <SingleContentScroll data={data?.data} id={data?.id} key={data?.id} type={data?.type} />
            })}
          </div><br /></>}
        {watched?.length !== 0 && <>
          <div className='trending_title' ><Count value={watched?.length} />Watched<Link to={`/singlecategory/watched/Trending/Watched/${auth?.currentUser?.uid}`} className="viewall"><IconButton><ChevronRightIcon /></IconButton></Link></div>
          <div className='trending_scroll' >
            {watched && watched.map((data) => {
              return <SingleContentScroll data={data?.data} id={data?.id} key={data?.id} type={data?.type} />
            })}
          </div><br /></>}
        {suggestions?.length !== 0 && <>
          <div className='trending_title' ><Count value={suggestions?.length} />Suggestions</div>
          <div className='trending_scroll' >
            {suggestions?.map((data) => {
              return <div>
                <SingleContentScroll data={data?.data} key={data?.id} type={data?.type} by={data?.by} byuid={data?.byuid} id={data?.id} />
              </div>
            })}
          </div><br /></>}
        {favourite?.length !== 0 && <>
          <div className='trending_title' ><Count value={favourite?.length} />Favourites<Link to={`/singlecategory/favourites/Trending/Favourites/${auth?.currentUser?.uid}`} className="viewall"><IconButton><ChevronRightIcon /></IconButton></Link></div>
          <div className='trending_scroll' >
            {favourite?.map((data) => {
              return <SingleContentScroll data={data?.data} key={data?.id} id={data?.id} type={data?.type} />
            })}
          </div><br /></>}
        {cast?.length !== 0 && <>
          <div className='trending_title' ><Count value={cast?.length} />Favourite Cast</div>
          <div className='trending_scroll' >
            {cast?.map((c) => {
              return <Cast c={c} key={c.id} />
            })}
          </div><br /></>}
        {favourite?.length === 0 && cast?.length === 0 && watchlist?.length === 0 && <center><br />
          <img src={empty} className='empty' alt="" />
          <h6 style={{ color: 'gray' }}>Nothing to show here</h6></center>}
      </div> : <div className="loading">
        <CircularProgress color='warning' />
      </div>}

    </>
  )
}
