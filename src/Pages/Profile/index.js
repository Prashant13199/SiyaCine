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
import useFetchPremium from '../../hooks/useFetchPremium'
import Count from '../../Components/Count';
import Premium from '../../Components/Premium';
import { Helmet } from 'react-helmet';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import useFetchDBData from '../../hooks/useFetchDBData';
import { Modal } from 'react-bootstrap';
import CloseIcon from '@mui/icons-material/Close';
import ModeIcon from '@mui/icons-material/Mode';
import { images } from '../../Services/images'

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
  const [watchedCount, setWatchedCount] = useState(0)
  const [favouriteCount, setFavouriteCount] = useState(0)

  const currentPhoto = useFetchUserDetails(auth?.currentUser?.uid, 'photo')
  const currentUsername = useFetchUserDetails(auth?.currentUser?.uid, 'username')
  const watching = useFetchDBData(auth?.currentUser?.uid, 'watching')
  const premium = useFetchPremium(auth?.currentUser?.uid)

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
    database.ref(`/Users/${auth?.currentUser?.uid}/watched`).limitToLast(20).orderByChild('timestamp').on('value', snapshot => {
      let arr = []
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, data: snap.val().data, type: snap.val().type })
      })
      setWatched(arr.reverse())
    })
    database.ref(`/Users/${auth?.currentUser?.uid}/watched`).on('value', snapshot => {
      setWatchedCount(snapshot.numChildren())
    })
    database.ref(`/Users/${auth?.currentUser?.uid}/favourites`).limitToLast(20).orderByChild('timestamp').on('value', snapshot => {
      let arr = []
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, data: snap.val().data, type: snap.val().type })
      })
      setFavourite(arr.reverse())
    })
    database.ref(`/Users/${auth?.currentUser?.uid}/favourites`).on('value', snapshot => {
      setFavouriteCount(snapshot.numChildren())
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

  const handleChangePicture = (image) => {
    database.ref(`/Users/${auth?.currentUser?.uid}`).update({
      photo: image
    }).then(() => {
      console.log('Picture updated')
      handleClose()
    }).catch((e) => {
      console.log(e)
    })
  }

  return (
    <>
      <Helmet>
        <title>SiyaCine{currentUsername ? ` - ${currentUsername}` : ''}</title>
      </Helmet>

      <Modal size='md' show={show} onHide={handleClose} centered>
        <Modal.Body style={{ backgroundColor: theme.palette.background.default }}>
          <div className='modal_header'>
            <h2>Choose a different avatar</h2>
            <IconButton onClick={() => handleClose()}><CloseIcon style={{ color: 'red' }} /></IconButton>
          </div>
          <div>
            <div className='picture_container'>
              {images(currentUsername)?.map((img) => {
                return (
                  <div>
                    <img onClick={() => handleChangePicture(img)} className='picture_single' src={img} />
                    {img === currentPhoto && <div className='current'>Current</div>}
                  </div>
                )
              })}
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {!loading ? <div className='profile'>
        <div className='profile_header'>
          <div className='pic_container'>
            <img src={currentPhoto ? currentPhoto : 'https://api.dicebear.com/8.x/fun-emoji/svg?seed=fun?size=96'} className='profile_image hovereffect' />
            <IconButton onClick={handleShow} className='edit_icon'><ModeIcon /></IconButton>
          </div>
          <div className='profile_right'>
            <Tooltip title={auth?.currentUser?.uid} placement='top'>
              <h1>{currentUsername ? currentUsername : 'Loading...'}</h1>
            </Tooltip>
            <div className='profile_actions'>
              <Premium premium={premium} />
              <Tooltip title={publicAcc ? "Switch to Private" : 'Switch to Public'}>
                <IconButton style={{ backgroundColor: theme.palette.background.default, marginLeft: '10px' }} onClick={() => handlePublic()}>
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
        {watching?.length !== 0 && <><br />
          <div className='trending_title' >Resume Watching</div>
          <div className='trending_scroll' >
            {watching && watching.map((data) => {
              return <SingleContentScroll data={data.data} id={data.id} key={data.id} type={data?.type} showtv={true} />
            })}
          </div></>}
        {watchlist?.length !== 0 && <><br />
          <div className='trending_title' >Watchlist<Count value={watchlist?.length} /><Link to={`/singlecategory/watchlist/Trending/Watchlist/${auth?.currentUser?.uid}`} className="viewall"><IconButton><ChevronRightIcon /></IconButton></Link></div>
          <div className='trending_scroll' >
            {watchlist && watchlist.map((data) => {
              return <SingleContentScroll data={data?.data} id={data?.id} key={data?.id} type={data?.type} showtv={true} />
            })}
          </div></>}
        {watched?.length !== 0 && <><br />
          <div className='trending_title' >Watched<Count value={watchedCount} /><Link to={`/singlecategory/watched/Trending/Watched/${auth?.currentUser?.uid}`} className="viewall"><IconButton><ChevronRightIcon /></IconButton></Link></div>
          <div className='trending_scroll' >
            {watched && watched.map((data) => {
              return <SingleContentScroll data={data?.data} id={data?.id} key={data?.id} type={data?.type} showtv={true} />
            })}
          </div></>}
        {suggestions?.length !== 0 && <><br />
          <div className='trending_title' >Suggestions<Count value={suggestions?.length} /></div>
          <div className='trending_scroll' >
            {suggestions?.map((data) => {
              return <div>
                <SingleContentScroll data={data?.data} key={data?.id} type={data?.type} by={data?.by} byuid={data?.byuid} id={data?.id} showtv={true} />
              </div>
            })}
          </div></>}
        {favourite?.length !== 0 && <><br />
          <div className='trending_title' >Favourites<Count value={favouriteCount} /><Link to={`/singlecategory/favourites/Trending/Favourites/${auth?.currentUser?.uid}`} className="viewall"><IconButton><ChevronRightIcon /></IconButton></Link></div>
          <div className='trending_scroll' >
            {favourite?.map((data) => {
              return <SingleContentScroll data={data?.data} key={data?.id} id={data?.id} type={data?.type} showtv={true} />
            })}
          </div></>}
        {cast?.length !== 0 && <><br />
          <div className='trending_title' >Favourite Cast<Count value={cast?.length} /></div>
          <div className='trending_scroll' >
            {cast?.map((c) => {
              return <Cast c={c} key={c.id} />
            })}
          </div></>}
        {favourite?.length === 0 && cast?.length === 0 && watchlist?.length === 0 && watching?.length === 0 && <center><br />
          <img src={empty} className='empty' alt="" />
          <h6 style={{ color: 'gray' }}>Nothing to show here</h6></center>}
      </div> : <div className="loading">
        <CircularProgress color='warning' />
      </div>}

    </>
  )
}
