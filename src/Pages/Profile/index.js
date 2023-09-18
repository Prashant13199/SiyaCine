import React, { useEffect, useState } from 'react';
import { database, auth, storage } from '../../firebase';
import './style.css';
import { IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useHistory } from 'react-router-dom';
import axios from "axios";
import SingleContentScroll from '../../Components/SingleContentScroll';
import CreateIcon from '@mui/icons-material/Create';
import { Modal } from 'react-bootstrap';
import UploadPicture from '../../Containers/UploadPicture';
import DeleteIcon from '@mui/icons-material/Delete';
import empty from '../../assets/empty.png'
import Cast from '../../Components/Cast';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useTheme } from '@mui/material';
import Grow from '@mui/material/Grow';

export default function Profile() {

  const currentuid = localStorage.getItem('uid')
  const currentusername = localStorage.getItem('username')
  const [currentPhoto, setCurrentPhoto] = useState('')
  const [watchlist, setWatchlist] = useState([])
  const [favourite, setFavourite] = useState([])
  const [watching, setWatching] = useState([])
  const [cast, setCast] = useState([])
  const history = useHistory()
  const [recommendation, setRecommendation] = useState([])
  const [number, setNumber] = useState(null)
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [checked, setChecked] = useState(false);
  const theme = useTheme()
  const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
    AOS.init({ duration: 800 })
  }, [])

  useEffect(() => {
    fetchRecommendation();
  }, [number])

  useEffect(() => {
    setChecked(true)
  }, [])

  useEffect(() => {
    setNumber(Math.floor(Math.random() * favourite.length))
  }, [favourite.length])

  const signOut = () => {
    auth.signOut().then(() => {
      history.push('/')
      localStorage.clear()
      window.location.reload()
    })
  }
  const avatarArray = ['Willow', 'Spooky', 'Bubba', 'Lily', 'Whiskers', 'Pepper', 'Tiger', 'Zoey', 'Dusty', 'Simba']

  const removePicture = () => {
    try {
      var imageRef = storage.refFromURL(currentPhoto);
      imageRef.delete().then(() => {
        console.log("Removed from storage");
      }).catch((e) => {
        console.log(e);
      });
    } catch (e) {
      console.log(e);
    }
    database.ref(`/Users/${currentuid}`).update({ photo: `https://api.dicebear.com/6.x/thumbs/png?seed=${avatarArray[Math.ceil(Math.random() * 10)]}` }).then(() => {
      console.log('Picture removed')
    });
  }

  const fetchRecommendation = async () => {
    if (favourite[number]?.type) {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/${favourite[number]?.type}/${favourite[number]?.id}/recommendations?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&sort_by=popularity.desc&include_video=false`
      );
      setRecommendation(data.results);
    }
  };

  useEffect(() => {
    database.ref(`/Users/${currentuid}`).on('value', snapshot => {
      setCurrentPhoto(snapshot.val()?.photo)
    })
  }, [])

  useEffect(() => {
    database.ref(`/Users/${currentuid}/watchlist`).on('value', snapshot => {
      let arr = []
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, data: snap.val().data, type: snap.val().type })
      })
      setWatchlist(arr)
    })
  }, [])

  useEffect(() => {
    database.ref(`/Users/${currentuid}/favourites`).on('value', snapshot => {
      let arr = []
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, data: snap.val().data, type: snap.val().type })
      })
      setFavourite(arr)
    })

  }, [])

  useEffect(() => {
    database.ref(`/Users/${currentuid}/watching`).on('value', snapshot => {
      let arr = []
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, data: snap.val().data, type: snap.val().type })
      })
      setWatching(arr)
    })
  }, [])

  useEffect(() => {
    database.ref(`/Users/${currentuid}/cast`).on('value', snapshot => {
      let arr = []
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, data: snap.val().data })
      })
      setCast(arr)
    })
  }, [])

  useEffect(() => {
    database.ref(`/Users/${currentuid}/suggestions`).on('value', snapshot => {
      let arr = []
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, data: snap.val().data, type: snap.val().type, by: snap.val().by, byuid: snap.val().byuid })
      })
      setSuggestions(arr)
    })
  }, [])

  return (
    <>
      <Modal show={show} onHide={handleClose} centered >
        <Modal.Body className='modal_body' style={{ backgroundColor: theme.palette.background.default }}>
          <UploadPicture handleClose={handleClose} />
        </Modal.Body>
      </Modal>
      <Grow in={checked} {...(checked ? { timeout: 1000 } : {})} style={{ transformOrigin: '0 0 0' }}>
        <div className='Profile'>
          <div className='welcome' style={{ backgroundImage: favourite.length !== 0 && number ? `url(https://image.tmdb.org/t/p/original/${favourite[number].data.backdrop_path})` : 'linear-gradient(0deg, rgba(34,193,195,1) 0%, rgba(253,187,45,1) 100%)', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', borderRadius: '10px' }}>
            <div className='welcome_backdrop'>
              <div style={{ width: '100%' }}>
                <div className='profile_header'>
                  <div style={{ position: 'relative', width: 'fit-content' }}>
                    <img src={currentPhoto ? currentPhoto : `https://api.dicebear.com/6.x/thumbs/png?seed=Spooky`} className='profile_image' />
                    <div style={{ position: 'absolute', left: 5, bottom: 5 }}>
                      <IconButton style={{ backgroundColor: theme.palette.background.default }}><CreateIcon color="warning" fontSize='small' onClick={() => handleShow()} /></IconButton>
                    </div>
                    {currentPhoto && currentPhoto.includes('firebase') && <div style={{ position: 'absolute', right: 5, bottom: 5 }}>
                      <IconButton style={{ backgroundColor: theme.palette.background.default, marginRight: '10px' }}><DeleteIcon color="warning" fontSize='small' onClick={() => removePicture()} /></IconButton>
                    </div>}
                  </div>
                  <div className="profile_actions">
                    <div className='profile_username'>{currentusername ? currentusername.length > 15 ? currentusername.substring(0, 15).concat('...') : currentusername : 'Loading...'}</div>
                    &nbsp;<IconButton onClick={() => signOut()} style={{ backgroundColor: theme.palette.background.default }}><LogoutIcon color="warning" /></IconButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {watching.length !== 0 && <><br />
            <div className='trending_title' data-aos="fade-right">Watching Now ({watching?.length})</div>
            <div className='trending_scroll' data-aos="fade-left">
              {watching && watching.map((data) => {
                return <SingleContentScroll data={data.data} key={data.id} type={data.type} />
              })}
            </div></>}
          {watchlist.length !== 0 && <><br />
            <div className='trending_title' data-aos="fade-right">Watchlist ({watchlist?.length})</div>
            <div className='trending_scroll' data-aos="fade-left">
              {watchlist && watchlist.map((data) => {
                return <SingleContentScroll data={data.data} key={data.id} type={data.type} />
              })}
            </div></>}
          {recommendation.length !== 0 && <><br />
            <div className='trending_title' data-aos="fade-right">Recommendation</div>
            <div className='searchresultfor' data-aos="fade-right">Because you liked {favourite[number]?.data?.title || favourite[number]?.data?.name}</div>
            <div className='trending_scroll' data-aos="fade-left">
              {recommendation && recommendation.map((data) => {
                return <SingleContentScroll data={data} key={data.id} type={favourite[number]?.type} />
              })}
            </div></>}
          {suggestions.length !== 0 && <><br />
            <div className='trending_title' data-aos="fade-right">Suggestions ({suggestions?.length})</div>
            <div className='trending_scroll' data-aos="fade-left">
              {suggestions && suggestions.map((data) => {
                return <div>
                  <SingleContentScroll data={data.data} key={data.id} type={data.type} by={data.by} byuid={data.byuid} id={data.id} />
                </div>
              })}
            </div></>}
          {favourite.length !== 0 && <><br />
            <div className='trending_title' data-aos="fade-right">Favourites ({favourite?.length})</div>
            <div className='trending_scroll' data-aos="fade-left">
              {favourite && favourite.map((data) => {
                return <SingleContentScroll data={data.data} key={data.id} type={data.type} />
              })}
            </div></>}
          {cast.length !== 0 && <><br />
            <div className='trending_title' data-aos="fade-right">Favourite Cast</div>
            <div className='trending_scroll' data-aos="fade-left">
              {cast && cast.map((c) => {
                return <Cast c={c} key={c.id} />
              })}
            </div></>}
          {favourite.length === 0 && cast.length === 0 && watchlist.length === 0 && watching.length === 0 && <center><br />
            <img src={empty} width={'100px'} height={'auto'} />
            <h6 style={{ color: 'gray' }}>Nothing to show</h6>
            <h3>Add to Watchlist or Favourite to appear here</h3></center>}
        </div>
      </Grow>
    </>
  )
}
