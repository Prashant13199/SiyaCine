import React, { useEffect, useState } from 'react';
import { database, auth } from '../../firebase';
import './style.css';
import { IconButton, Tooltip } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useHistory } from 'react-router-dom';
import SingleContentScroll from '../../Components/SingleContentScroll';
import empty from '../../assets/empty.png'
import Cast from '../../Components/Cast';
import { CircularProgress, Button, useTheme } from '@mui/material';
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
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import PersonIcon from '@mui/icons-material/Person';
import CoPresentIcon from '@mui/icons-material/CoPresent';
import ErrorIcon from '@mui/icons-material/Error';
import Genres from '../../Components/Genres';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

export default function Profile({ scrollTop }) {

  const history = useHistory()
  const theme = useTheme()
  const [loading, setLoading] = useState(true)
  const [publicAcc, setPublicAcc] = useState(true)
  const [show, setShow] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [showGenre, setShowGenre] = useState(false);
  const [connections, setConnections] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [backdrop, setBackdrop] = useState('')
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [genres, setGenres] = useState([]);
  const [dbGenre, setDbGenre] = useState([]);

  const currentPhoto = useFetchUserDetails(auth?.currentUser?.uid, 'photo')
  const currentUsername = useFetchUserDetails(auth?.currentUser?.uid, 'username')
  const watchlist = useFetchDBData(auth?.currentUser?.uid, 'watchlist')
  const watched = useFetchDBData(auth?.currentUser?.uid, 'watched')
  const favourite = useFetchDBData(auth?.currentUser?.uid, 'favourites')
  const cast = useFetchDBData(auth?.currentUser?.uid, 'cast')
  const premium = useFetchPremium(auth?.currentUser?.uid)

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCloseLogout = () => setShowLogout(false);
  const handleShowLogout = () => setShowLogout(true);

  const handleCloseGenre = () => setShowGenre(false);
  const handleShowGenre = () => {
    setShowGenre(true);
    setSelectedGenres(dbGenre)
  }

  useEffect(() => {
    scrollTop();
    database.ref(`/Users/${auth?.currentUser?.uid}`).update({
      timestamp: Date.now()
    }).catch((e) => console.log("Error", e))
  }, [])

  const addBackdrop = () => {
    setBackdrop(window.innerWidth > 900 ? favourite[0]?.data?.backdrop_path : '')
  }

  useEffect(() => {
    addBackdrop()
    window.addEventListener('resize', addBackdrop)
    return () => {
      window.removeEventListener('resize', addBackdrop)
    }
  }, [favourite])

  useEffect(() => {

    database.ref(`/Connections`).once('value', snapshot => {
      let arr = []
      snapshot?.forEach((snap) => {
        let uid = snap.key.replace(':', '').replace(auth?.currentUser?.uid, '')
        if (snap.key.includes(auth?.currentUser?.uid) && snap.val()?.connected) {
          database.ref(`/Users/${uid}`).once('value', snapshot => {
            const newItem = { uid: uid, timestamp: snapshot.val().timestamp };
            const index = arr.findIndex((item) => item.timestamp < newItem.timestamp);
            if (index === -1) {
              arr.push(newItem);
            } else {
              arr.splice(index, 0, newItem);
            }
          })
        }
      })
      setConnections(arr);
    })

    database.ref(`/Users/${auth?.currentUser?.uid}/public`).on('value', snapshot => {
      setPublicAcc(snapshot.val())
    })
    database.ref(`/Users/${auth?.currentUser?.uid}/genres`).on('value', snapshot => {
      setDbGenre(snapshot.val())
    })
    database.ref(`/Users/${auth?.currentUser?.uid}/suggestions`).orderByChild('timestamp').on('value', snapshot => {
      let arr = []
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, data: snap.val().data, type: snap.val().type, by: snap.val().by, byuid: snap.val().byuid, comment: snap.val().comment })
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

  const handleUpdateGenre = () => {
    database.ref(`Users/${auth?.currentUser?.uid}`).update({
      genres: selectedGenres
    }).then(() => {
      console.log("Genres updated")
      setDbGenre(selectedGenres)
      handleCloseGenre()
    }).catch((e) => {
      console.log(e)
    })
  }

  return (
    <>
      <Helmet>
        <title>SiyaCine{currentUsername ?? ` - ${currentUsername}`}</title>
      </Helmet>
      <Modal size='md' show={showLogout} onHide={handleCloseLogout} centered>
        <Modal.Body style={{ backgroundColor: theme.palette.background.default }}>
          <div className='logout_container'>
            <div className='logout_body'>
              <ErrorIcon className='logout_icon' color="warning" />
              Are you sure to logout?
            </div>
            <div className='logout_buttons'>
              <Button className='connect_btn logout_btn' variant='contained' color='error' onClick={() => signOut()}>Yes</Button>
              <Button className='connect_btn logout_btn' variant='outlined' color='warning' onClick={() => handleCloseLogout()}>No</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal size='md' show={show} onHide={handleClose} centered>
        <Modal.Body style={{ backgroundColor: theme.palette.action.disabledBackground }}>
          <div className='modal_header'>
            <h2>Choose a different avatar</h2>
            <IconButton onClick={() => handleClose()}><CloseIcon style={{ color: 'red' }} /></IconButton>
          </div>
          <div className='modal_body'>
            {images(currentUsername)?.map((data, index) => {
              return <div key={index}>
                {cast?.length > 0 &&
                  <>
                    <h4 className='picture_title'>Your Favourite Cast</h4>
                    <div className='picture_container'>
                      {cast?.map((c, index) => {
                        return (
                          <div key={index}>
                            <img onClick={() => handleChangePicture(`https://image.tmdb.org/t/p/w342/${c.data.profile_path}`)} className='picture_single' src={`https://image.tmdb.org/t/p/w342/${c.data.profile_path}`} />
                            {`https://image.tmdb.org/t/p/w342/${c.data.profile_path}` === currentPhoto && <div className='current'>Current</div>}
                          </div>
                        )
                      })}
                    </div>
                  </>}
                <h4 className='picture_title'>Dicebear</h4>
                <div className='picture_container'>
                  {data?.dicebear?.map((img, index) => {
                    return (
                      <div key={index}>
                        <img onClick={() => handleChangePicture(img)} className='picture_single' src={img} />
                        {img === currentPhoto && <div className='current'>Current</div>}
                      </div>
                    )
                  })}
                </div>
                <h4 className='picture_title'>Boy</h4>
                <div className='picture_container'>
                  {data?.boy?.map((img, index) => {
                    return (
                      <div key={index}>
                        <img onClick={() => handleChangePicture(img)} className='picture_single' src={img} />
                        {img === currentPhoto && <div className='current'>Current</div>}
                      </div>
                    )
                  })}
                </div>
                <h4 className='picture_title'>Girl</h4>
                <div className='picture_container'>
                  {data?.girl?.map((img, index) => {
                    return (
                      <div key={index}>
                        <img onClick={() => handleChangePicture(img)} className='picture_single' src={img} />
                        {img === currentPhoto && <div className='current'>Current</div>}
                      </div>
                    )
                  })}
                </div>
              </div>
            })}
          </div>
        </Modal.Body>
      </Modal>

      <Modal size='md' show={showGenre} onHide={handleCloseGenre} centered>
        <Modal.Body style={{ backgroundColor: theme.palette.background.default }}>
          <div className='modal_header'>
            <h2>Update your genre</h2>
            <IconButton onClick={() => handleCloseGenre()}><CloseIcon style={{ color: 'red' }} /></IconButton>
          </div>
          <div className='genre_body'>
            <Genres
              type={"movie"}
              selectedGenres={selectedGenres}
              setSelectedGenres={setSelectedGenres}
              genres={genres}
              setGenres={setGenres}
              setPage={() => { }}
            />
            <Button variant='outlined' color='warning' onClick={handleUpdateGenre}>Update</Button>
          </div>
        </Modal.Body>
      </Modal>

      {!loading ?
        <div className='profile'>
          <div className='profile_header' style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original/${backdrop})` }}>
            <div className='profile_backdrop'>
              <div className='pic_container'>
                <img src={currentPhoto ?? 'https://api.dicebear.com/8.x/fun-emoji/svg?seed=fun?size=96'} className='profile_image hovereffect' />
                <IconButton onClick={handleShow} className='edit_icon'><ModeIcon color="warning" /></IconButton>
              </div>
              <div className='profile_right'>
                <Tooltip title={auth?.currentUser?.uid} placement='top'>
                  <h1>{currentUsername ? currentUsername : 'Loading...'}</h1>
                </Tooltip>
                <div className='profile_genres'>
                  {dbGenre?.map((g) => { return <div key={g.id} className='genrelist'>{g.name}</div> })} <div onClick={handleShowGenre} className='genrelist pointer'>{dbGenre?.length > 0 ? <EditIcon fontSize='small' /> : <><AddIcon fontSize='small' /> Add Genre</>}</div>
                </div>
                <div className='profile_actions'>
                  <Premium premium={premium} />
                  <Tooltip title={publicAcc ? "Switch to Private" : 'Switch to Public'}>
                    <IconButton style={{ backgroundColor: theme.palette.action.disabledBackground, marginLeft: '10px' }} onClick={() => handlePublic()}>
                      {publicAcc ? <LockOpenIcon /> : <LockIcon color="warning" />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={'Logout'}>
                    <IconButton style={{ backgroundColor: theme.palette.action.disabledBackground, marginLeft: '10px' }} onClick={() => handleShowLogout()}>
                      <LogoutIcon />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
          {watchlist?.length !== 0 && <><br />
            <div className='trending_flex'>
              <div className='trending_title' ><FormatListBulletedIcon />Watchlist<Count value={watchlist?.length} /><Link to={`/singlecategory/watchlist/Trending/Watchlist/${auth?.currentUser?.uid}/@@`} className="viewall"><IconButton><ChevronRightIcon /></IconButton></Link></div>
            </div>
            <div className='trending_scroll' >
              {watchlist?.slice(0, 10)?.map((data, index) => {
                return <SingleContentScroll index={index} data={data?.data} id={data?.id} key={data?.id} type={data?.type} />
              })}
            </div></>}
          {suggestions?.length !== 0 && <><br />
            <div className='trending_flex'>
              <div className='trending_title' ><CoPresentIcon /> Suggestions<Count value={suggestions?.length} /></div>
            </div>
            <div className='trending_scroll' >
              {suggestions?.map((data, index) => {
                return <div>
                  <SingleContentScroll index={index} data={data?.data} key={data?.id} type={data?.type} by={data?.by} byuid={data?.byuid} id={data?.id} comment={data?.comment} />
                </div>
              })}
            </div></>}
          {watched?.length !== 0 && <><br />
            <div className='trending_flex'>
              <div className='trending_title' ><TaskAltIcon /> Watched<Count value={watched?.length} /><Link to={`/singlecategory/watched/Trending/Watched/${auth?.currentUser?.uid}/@@`} className="viewall"><IconButton><ChevronRightIcon /></IconButton></Link></div>
            </div>
            <div className='trending_scroll' >
              {watched?.slice(0, 10)?.map((data, index) => {
                return <SingleContentScroll index={index} data={data?.data} id={data?.id} key={data?.id} type={data?.type} />
              })}
            </div></>}
          {favourite?.length !== 0 && <><br />
            <div className='trending_flex'>
              <div className='trending_title' ><FavoriteIcon /> Favourites<Count value={favourite?.length} /><Link to={`/singlecategory/favourites/Trending/Favourites/${auth?.currentUser?.uid}/@@`} className="viewall"><IconButton><ChevronRightIcon /></IconButton></Link></div>
            </div>
            <div className='trending_scroll' >
              {favourite?.slice(0, 10)?.map((data, index) => {
                return <SingleContentScroll index={index} data={data?.data} key={data?.id} id={data?.id} type={data?.type} />
              })}
            </div></>}
          {cast?.length !== 0 && <><br />
            <div className='trending_flex'>
              <div className='trending_title' ><PersonIcon /> Favourite Cast<Count value={cast?.length} /></div>
            </div>
            <div className='trending_scroll' >
              {cast?.map((c) => {
                return <Cast c={c} key={c.id} />
              })}
            </div></>}
          {connections?.length !== 0 && <><br />
            <div className='trending_flex'>
              <div className='trending_title' ><AccountBoxIcon /> Connections<Count value={connections?.length} /></div>
            </div>
            <div className='trending_scroll' >
              {connections?.map((user, index) => {
                return <ConnectionUser key={user.uid} user={user.uid} index={index} />
              })}
            </div></>}
          {favourite?.length === 0 && cast?.length === 0 && watchlist?.length === 0 && <center><br />
            <img src={empty} className='empty' alt="" />
            <h6 style={{ color: 'gray' }}>Nothing to show here</h6></center>}
        </div>
        : <div className="loading">
          <CircularProgress color='warning' />
        </div>}

    </>
  )
}
