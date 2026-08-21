import React, { useEffect, useState } from 'react'
import { auth, database } from '../../firebase'
import './style.css'
import { useParams } from 'react-router-dom'
import SingleContentScroll from '../../Components/SingleContentScroll'
import empty from '../../assets/empty.png'
import Cast from '../../Components/Cast'
import { Button, CircularProgress, IconButton, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Count from '../../Components/Count'
import Premium from '../../Components/Premium'
import { Helmet } from 'react-helmet'
import useFetchDBData from '../../hooks/useFetchDBData'
import useFetchUserDetails from '../../hooks/useFetchUserDetails'
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import PersonRemoveAlt1Icon from '@mui/icons-material/PersonRemoveAlt1';
import ConnectionUser from '../../Components/ConnectionUser'
import { timeDifference } from '../../Services/time';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import PersonIcon from '@mui/icons-material/Person';

export default function UserProfile({ scrollTop }) {

  const { uid } = useParams()
  const [loading, setLoading] = useState(true)
  const [admin, setAdmin] = useState(false)
  const [premium, setPremium] = useState(false)
  const [connected, setConnected] = useState(false)
  const [requested, setRequested] = useState(false)
  const [publicAcc, setPublicAcc] = useState(true)
  const [initiated, setInitiated] = useState('')
  const [connections, setConnections] = useState([])
  const [backdrop, setBackdrop] = useState('')
  const [connectID, setConnectID] = useState('')

  const watchlist = useFetchDBData(uid, 'watchlist')
  const watched = useFetchDBData(uid, 'watched')
  const favourite = useFetchDBData(uid, 'favourites')
  const watching = useFetchDBData(uid, 'watching')
  const cast = useFetchDBData(uid, 'cast')
  const username = useFetchUserDetails(uid, 'username')
  const photo = useFetchUserDetails(uid, 'photo')
  const lastActive = useFetchUserDetails(uid, 'lastActive')
  const currentUsername = useFetchUserDetails(auth?.currentUser?.uid, 'username')

  const addBackdrop = () => {
    setBackdrop(window.innerWidth > 900 ? favourite[0]?.data?.backdrop_path : '')
  }

  useEffect(() => {
    addBackdrop()
    window.addEventListener('resize', addBackdrop)
  }, [favourite])

  useEffect(() => {
    setConnectID([auth?.currentUser?.uid, uid].sort().join(':'))
  }, [auth?.currentUser?.uid, uid])

  useEffect(() => {
    database.ref(`/Connections/${connectID}`).on('value', snapshot => {
      if (snapshot.key === [auth?.currentUser?.uid, uid].sort().join(':')) {
        setConnected(snapshot.val()?.connected == true ? true : false)
        setRequested(snapshot.val()?.requested == true ? true : false)
        setInitiated(snapshot.val()?.initiated ? snapshot.val()?.initiated : '')
      }
    })
  }, [connectID, uid])

  useEffect(() => {
    scrollTop();
    setLoading(true)
    database.ref(`/Users/${uid}`).once('value', snapshot => {
      setPublicAcc(snapshot.val().public)
    })
    database.ref(`/Users/${auth?.currentUser?.uid}/admin`).once('value', snapshot => {
      setAdmin(snapshot.val())
    })
    database.ref(`/Users/${uid}/premium`).once('value', snapshot => {
      setPremium(snapshot.val())
    })
    database.ref(`/Connections`).orderByChild('timestamp').once('value', snapshot => {
      let arr = []
      snapshot?.forEach((snap) => {
        if (snap.key.includes(uid) && snap.val()?.connected) {
          arr.push(snap.key.replace(':', '').replace(uid, ''))
        }
      })
      setConnections(arr.reverse())
    })
    setLoading(false)
  }, [uid, auth?.currentUser?.uid])

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

  const handleConnect = () => {
    database.ref(`Connections/${connectID}`).set({
      connected: false,
      requested: true,
      initiated: auth?.currentUser?.uid,
      timestamp: Date.now()
    }).then(() => {
      database.ref(`/Users/${uid}/notifications/${auth?.currentUser?.uid}`).update({
        timestamp: Date.now(),
        by: currentUsername,
        byuid: auth?.currentUser?.uid,
        id: auth?.currentUser?.uid,
        text: `${currentUsername} requested to connect with you`,
        connection: true
      }).then(() => {
        console.log('Notification Sent')
        setRequested(true)
        setInitiated(auth?.currentUser?.uid)
      }).catch((e) => console.log(e))
    }).catch((e) => console.log(e))
  }

  const handleRemoveConnect = () => {
    database.ref(`/Connections/${connectID}`).remove().then(() => {
      database.ref(`/Users/${uid}/notifications/${auth?.currentUser?.uid}`).remove().then(() => {
        console.log('Notification removed')
      }).catch((e) => console.log(e))
    }).catch((e) => {
      console.log(e)
    })
  }

  const handleRequest = () => {
    if (auth?.currentUser?.uid !== initiated) {
      database.ref(`Connections/${connectID}`).update({
        connected: true,
        requested: false
      }).then(() => {
        database.ref(`/Users/${uid}/notifications/${auth?.currentUser?.uid}`).update({
          timestamp: Date.now(),
          by: currentUsername,
          byuid: auth?.currentUser?.uid,
          id: auth?.currentUser?.uid,
          text: `${currentUsername} accepted your connection request`,
        }).then(() => {
          database.ref(`/Users/${auth?.currentUser?.uid}/notifications/${uid}`).remove().then(() => {
            setConnected(true)
            setRequested(false)
          })
            .catch((e) => console.log(e))
        }).catch((e) => console.log(e))
      }).catch((e) => console.log(e))
    } else {
      database.ref(`/Connections/${connectID}`).remove().then(() => {
        database.ref(`/Users/${uid}/notifications/${auth?.currentUser?.uid}`).remove()
          .then(() => {
            setRequested(false)
          })
          .catch((e) => console.log(e))
      }).catch((e) => {
        console.log(e)
      })
    }
  }

  const removeRequested = () => {
    database.ref(`/Users/${auth?.currentUser?.uid}/notifications/${uid}`)
      .remove().then(() => {
        database.ref(`Connections/${connectID}`).remove().catch((e) => console.log(e)).then(() => {
          setRequested(false)
        })
      }).catch((e) => {
        console.log(e)
      })
  }

  return (
    <>
      <Helmet>
        <title>SiyaCine{username ? ` - ${username}` : ''}</title>
      </Helmet>
      {!loading ?

        <div className='profile'>
          <div className='profile_header' style={{ backgroundImage: backdrop && `url(https://image.tmdb.org/t/p/original/${backdrop})` }}>
            <div className='profile_backdrop'>
              <div className='pic_container'>
                <img alt="" src={photo ? photo : `https://api.dicebear.com/8.x/fun-emoji/svg?seed=fun?size=96`} className='profile_image' />
              </div>
              <div className='profile_right'>
                {admin ? <Tooltip title={uid} placement='top'>
                  <h1 className='profile_username'>{username ? username : 'Loading username...'}</h1>
                </Tooltip>
                  :
                  <h1 className='profile_username'>{username ? username : 'Loading username...'}</h1>
                }
                {(connected || publicAcc || admin) && <div className='user_last_active'>
                  Last Active <b>{timeDifference(new Date(), new Date(lastActive))}</b>
                </div>}
                {admin && <div onClick={() => { handlePremium() }} className={admin && 'handlepremium'}>
                  <Premium premium={premium} />
                </div>}
                <div className='connect_btns'>
                  {requested ?
                    <>
                      <Button className='connect_btn' onClick={handleRequest} variant='contained' color='warning' startIcon={<PersonAddAlt1Icon />}>{auth?.currentUser?.uid !== initiated.trim() ? 'Accept' : 'Requested'}</Button>
                      {auth?.currentUser?.uid !== initiated.trim() && <Button className='connect_btn' style={{ marginLeft: '10px' }} onClick={removeRequested} variant='contained' color='warning' startIcon={<PersonRemoveAlt1Icon />}>Decline</Button>}
                    </>
                    :
                    <> {connected ? <Button className='connect_btn' onClick={handleRemoveConnect} variant='contained' color='warning' startIcon={<PersonRemoveAlt1Icon />}>Connected</Button> :
                      <Button className='connect_btn' onClick={handleConnect} variant='contained' color='warning' startIcon={<PersonAddAlt1Icon />}>Connect</Button>}
                    </>}
                </div>
              </div>
            </div>
          </div>
          {(connected || publicAcc || admin) && <>
            {watching?.length !== 0 && <><br />
              <div className='trending_flex'>
                <div className='trending_title' ><PlayArrowIcon /> Watching Now<Count value={watching?.length} /></div>
              </div>
              <div className='trending_scroll' >
                {watching?.map((data, index) => {
                  return <SingleContentScroll index={index} data={data.data} id={data.id} key={data.id} type={data.type} userid={uid} />
                })}
              </div></>}
            {watchlist?.slice(0, 10)?.length !== 0 && <><br />
              <div className='trending_flex'>
                <div className='trending_title' ><FormatListBulletedIcon /> Watchlist<Count value={watchlist?.length} /><Link to={`/singlecategory/watchlist/Trending/Watchlist/${uid}`} className="viewall"><IconButton><ChevronRightIcon /></IconButton></Link></div>
              </div>
              <div className='trending_scroll' >
                {watchlist?.map((data, index) => {
                  return <SingleContentScroll index={index} data={data.data} id={data.id} key={data.id} type={data.type} />
                })}
              </div></>}
            {watched?.slice(0, 10)?.length !== 0 && <><br />
              <div className='trending_flex'>
                <div className='trending_title' ><TaskAltIcon /> Watched<Count value={watched?.length} /><Link to={`/singlecategory/watched/Trending/Watched/${uid}`} className="viewall"><IconButton><ChevronRightIcon /></IconButton></Link></div>
              </div>
              <div className='trending_scroll' >
                {watched?.slice(0, 20)?.map((data, index) => {
                  return <SingleContentScroll index={index} data={data.data} id={data.id} key={data.id} type={data.type} />
                })}
              </div></>}
            {favourite?.slice(0, 10)?.length !== 0 && <><br />
              <div className='trending_flex'>
                <div className='trending_title' ><FavoriteIcon /> Favourites<Count value={favourite?.length} /><Link to={`/singlecategory/favourites/Trending/Favourites/${uid}`} className="viewall"><IconButton><ChevronRightIcon /></IconButton></Link></div>
              </div>
              <div className='trending_scroll' >
                {favourite?.map((data, index) => {
                  return <SingleContentScroll index={index} data={data.data} id={data.id} key={data.id} type={data.type} />
                })}
              </div></>}
            {cast?.length !== 0 && <><br />
              <div className='trending_flex'>
                <div className='trending_title' ><PersonIcon /> Favourite Cast<Count value={cast?.length} /></div>
              </div>
              <div className='trending_scroll' >
                {cast?.map((c) => {
                  return <Cast c={c} key={c?.id} />
                })}
              </div></>}
            {connections?.length !== 0 && <><br />
              <div className='trending_flex'>
                <div className='trending_title' ><AccountBoxIcon /> Connections<Count value={connections?.length} /></div>
              </div>
              <div className='trending_scroll' >
                {connections?.map((user, index) => {
                  return <ConnectionUser user={user} index={index} />
                })}
              </div></>}
          </>}
          {favourite?.length === 0 && cast?.length === 0 && watchlist?.length === 0 && watching?.length === 0 && connections?.length == 0 && <center><br />
            <img src={empty} className='empty' alt="" />
            <h6 style={{ color: 'gray' }}>Nothing to show here</h6></center>}
        </div>
        : <div className="loading">
          <CircularProgress color='warning' />
        </div>}
    </>
  )
}
