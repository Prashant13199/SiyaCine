import React, { useEffect, useState } from 'react';
import { database, auth } from '../../firebase';
import './style.css';
import { IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useHistory } from 'react-router-dom';
import SingleContentScroll from '../../Components/SingleContentScroll';
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
import { Helmet } from 'react-helmet';

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
      history.push('/')
    })
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

  const currentPhoto = useFetchDB('photo')
  const currentUsername = useFetchDB('username')

  useEffect(() => {
    database.ref(`/Users/${auth?.currentUser?.uid}/premium`).on('value', snapshot => {
      setPremium(snapshot.val())
    })
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
            <Premium premium={premium} />
            <div className='switchAccount'>
              <div className='switchAcc' onClick={() => handlePublic()}>
                <div className={publicAcc ? 'switchAcc_span_active' : 'switchAcc_span'} style={{ backgroundColor: publicAcc && theme.palette.warning.main, color: publicAcc && theme.palette.warning.contrastText }}>Public</div>
                <div className={!publicAcc ? 'switchAcc_span_active' : 'switchAcc_span'} style={{ backgroundColor: !publicAcc && theme.palette.warning.main, color: !publicAcc && theme.palette.warning.contrastText }}>Private</div>
              </div>
            </div>
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
      </div> : <div className="loading">
        <CircularProgress color='warning' />
      </div>}

    </>
  )
}
