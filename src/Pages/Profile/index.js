import React, { useEffect, useState } from 'react';
import { database, auth } from '../../firebase';
import './style.css';
import { Grow, IconButton, Tooltip } from '@mui/material';
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
import ConnectionUser from '../../Components/ConnectionUser';

export default function Profile({ scrollTop }) {

  const history = useHistory()
  const theme = useTheme()
  const [loading, setLoading] = useState(true)
  const [publicAcc, setPublicAcc] = useState(true)
  const [show, setShow] = useState(false);
  const [connections, setConnections] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [backdrop, setBackdrop] = useState('')

  const currentPhoto = useFetchUserDetails(auth?.currentUser?.uid, 'photo')
  const currentUsername = useFetchUserDetails(auth?.currentUser?.uid, 'username')
  const watching = useFetchDBData(auth?.currentUser?.uid, 'watching')
  const watchlist = useFetchDBData(auth?.currentUser?.uid, 'watchlist')
  const watched = useFetchDBData(auth?.currentUser?.uid, 'watched')
  const favourite = useFetchDBData(auth?.currentUser?.uid, 'favourites')
  const cast = useFetchDBData(auth?.currentUser?.uid, 'cast')
  const premium = useFetchPremium(auth?.currentUser?.uid)

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    scrollTop()
  }, [])

  const addBackdrop = () => {
    setBackdrop(window.innerWidth > 900 ? favourite[0]?.data?.backdrop_path : '')
  }

  useEffect(() => {
    addBackdrop()
    window.addEventListener('resize', addBackdrop)
  }, [favourite])

  useEffect(() => {
    database.ref(`/Connections`).orderByChild('timestamp').on('value', snapshot => {
      let arr = []
      snapshot?.forEach((snap) => {
        if (snap.key.includes(auth?.currentUser?.uid) && snap.val()?.connected) {
          arr.push(snap.key.replace(':', '').replace(auth?.currentUser?.uid, ''))
        }
      })
      setConnections(arr.reverse())
    })
    database.ref(`/Users/${auth?.currentUser?.uid}/public`).on('value', snapshot => {
      setPublicAcc(snapshot.val())
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

  const handleChangePicture = (image) => {
    database.ref(`/Users/${auth?.currentUser?.uid}`).update({
      photo: image
    }).then(() => {
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
          <div className='modal_body'>
            {images(currentUsername)?.map((data) => {
              return <>
                <h4 className='picture_title'>Dicebear</h4>
                <div className='picture_container'>
                  {data?.dicebear?.map((img) => {
                    return (
                      <div>
                        <img onClick={() => handleChangePicture(img)} className='picture_single' src={img} />
                        {img === currentPhoto && <div className='current'>Current</div>}
                      </div>
                    )
                  })}
                </div>
                <h4 className='picture_title'>Boy</h4>
                <div className='picture_container'>
                  {data?.boy?.map((img) => {
                    return (
                      <div>
                        <img onClick={() => handleChangePicture(img)} className='picture_single' src={img} />
                        {img === currentPhoto && <div className='current'>Current</div>}
                      </div>
                    )
                  })}
                </div>
                <h4 className='picture_title'>Girl</h4>
                <div className='picture_container'>
                  {data?.girl?.map((img) => {
                    return (
                      <div>
                        <img onClick={() => handleChangePicture(img)} className='picture_single' src={img} />
                        {img === currentPhoto && <div className='current'>Current</div>}
                      </div>
                    )
                  })}
                </div>
              </>
            })}
          </div>
        </Modal.Body>
      </Modal>
      {!loading ?
        <div className='profile'>
          <Grow in={!loading} {...({ timeout: 800 })}>
            <div className='profile_header' style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original/${backdrop})` }}>
              <div className='profile_backdrop'>
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
            </div>
          </Grow>
          {watching?.length !== 0 && <><br />
            <div className='trending_flex'>
              <div className='trending_title' >Resume Watching</div>
            </div>
            <div className='trending_scroll' >
              {watching?.map((data, index) => {
                return <SingleContentScroll index={index} data={data.data} id={data.id} key={data.id} type={data?.type} showIcon={true} />
              })}
            </div></>}
          {watchlist?.length !== 0 && <><br />
            <div className='trending_flex'>
              <div className='trending_title' >Watchlist<Count value={watchlist?.length} /><Link to={`/singlecategory/watchlist/Trending/Watchlist/${auth?.currentUser?.uid}`} className="viewall"><IconButton><ChevronRightIcon /></IconButton></Link></div>
            </div>
            <div className='trending_scroll' >
              {watchlist?.slice(0, 10)?.map((data, index) => {
                return <SingleContentScroll index={index} data={data?.data} id={data?.id} key={data?.id} type={data?.type} showIcon={true} />
              })}
            </div></>}
          {suggestions?.length !== 0 && <><br />
            <div className='trending_flex'>
              <div className='trending_title' >Suggestions<Count value={suggestions?.length} /></div>
            </div>
            <div className='trending_scroll' >
              {suggestions?.map((data, index) => {
                return <div>
                  <SingleContentScroll index={index} data={data?.data} key={data?.id} type={data?.type} by={data?.by} byuid={data?.byuid} id={data?.id} showIcon={true} />
                </div>
              })}
            </div></>}
          {watched?.length !== 0 && <><br />
            <div className='trending_flex'>
              <div className='trending_title' >Watched<Count value={watched?.length} /><Link to={`/singlecategory/watched/Trending/Watched/${auth?.currentUser?.uid}`} className="viewall"><IconButton><ChevronRightIcon /></IconButton></Link></div>
            </div>
            <div className='trending_scroll' >
              {watched?.slice(0, 10)?.map((data, index) => {
                return <SingleContentScroll index={index} data={data?.data} id={data?.id} key={data?.id} type={data?.type} showIcon={true} />
              })}
            </div></>}
          {favourite?.length !== 0 && <><br />
            <div className='trending_flex'>
              <div className='trending_title' >Favourites<Count value={favourite?.length} /><Link to={`/singlecategory/favourites/Trending/Favourites/${auth?.currentUser?.uid}`} className="viewall"><IconButton><ChevronRightIcon /></IconButton></Link></div>
            </div>
            <div className='trending_scroll' >
              {favourite?.slice(0, 10)?.map((data, index) => {
                return <SingleContentScroll index={index} data={data?.data} key={data?.id} id={data?.id} type={data?.type} showIcon={true} />
              })}
            </div></>}
          {cast?.length !== 0 && <><br />
            <div className='trending_flex'>
              <div className='trending_title' >Favourite Cast<Count value={cast?.length} /></div>
            </div>
            <div className='trending_scroll' >
              {cast?.map((c) => {
                return <Cast c={c} key={c.id} />
              })}
            </div></>}
          {connections?.length !== 0 && <><br />
            <div className='trending_flex'>
              <div className='trending_title' >Connections<Count value={connections?.length} /></div>
            </div>
            <div className='trending_scroll' >
              {connections?.map((user, index) => {
                return <ConnectionUser user={user} index={index} />
              })}
            </div></>}
          {favourite?.length === 0 && cast?.length === 0 && watchlist?.length === 0 && watching?.length === 0 && <center><br />
            <img src={empty} className='empty' alt="" />
            <h6 style={{ color: 'gray' }}>Nothing to show here</h6></center>}
        </div>
        : <div className="loading">
          <CircularProgress color='warning' />
        </div>}

    </>
  )
}
