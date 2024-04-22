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
import { useTheme } from '@mui/material';
import CachedIcon from '@mui/icons-material/Cached';
import { CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export default function Profile({ setBackdrop, scrollTop }) {

  const [currentUsername, setCurrentUsername] = useState('')
  const [currentPhoto, setCurrentPhoto] = useState('')
  const [watchlist, setWatchlist] = useState([])
  const [watched, setWatched] = useState([])
  const [favourite, setFavourite] = useState([])
  const [watching, setWatching] = useState([])
  const [cast, setCast] = useState([])
  const history = useHistory()
  const [recommendation, setRecommendation] = useState([])
  const [number, setNumber] = useState(null)
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const theme = useTheme()
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    scrollTop()
  }, [])

  useEffect(() => {
    setBackdrop(window.innerWidth > 600 ? favourite[number]?.data?.backdrop_path : favourite[number]?.data?.poster_path)
  }, [favourite, number, window.innerWidth])

  useEffect(() => {
    fetchRecommendation();
  }, [number])

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
    database.ref(`/Users/${auth?.currentUser?.uid}`).update({ photo: `https://api.dicebear.com/6.x/thumbs/png?seed=${avatarArray[Math.ceil(Math.random() * 10)]}` }).then(() => {
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
    database.ref(`/Users/${auth?.currentUser?.uid}`).on('value', snapshot => {
      setCurrentPhoto(snapshot.val()?.photo)
      setCurrentUsername(snapshot.val()?.username)
      setLoading(false)
    })
    database.ref(`/Users/${auth?.currentUser?.uid}/watchlist`).on('value', snapshot => {
      let arr = []
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, data: snap.val().data, type: snap.val().type })
      })
      setWatchlist(arr)
    })
    database.ref(`/Users/${auth?.currentUser?.uid}/watched`).on('value', snapshot => {
      let arr = []
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, data: snap.val().data, type: snap.val().type })
      })
      setWatched(arr)
    })
    database.ref(`/Users/${auth?.currentUser?.uid}/favourites`).on('value', snapshot => {
      let arr = []
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, data: snap.val().data, type: snap.val().type })
      })
      setFavourite(arr)
    })
    database.ref(`/Users/${auth?.currentUser?.uid}/watching`).on('value', snapshot => {
      let arr = []
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, data: snap.val().data, type: snap.val().type })
      })
      setWatching(arr)
    })
    database.ref(`/Users/${auth?.currentUser?.uid}/cast`).on('value', snapshot => {
      let arr = []
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, data: snap.val().data })
      })
      setCast(arr)
    })
    database.ref(`/Users/${auth?.currentUser?.uid}/suggestions`).on('value', snapshot => {
      let arr = []
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, data: snap.val().data, type: snap.val().type, by: snap.val().by, byuid: snap.val().byuid })
      })
      setSuggestions(arr)
    })
  }, [auth?.currentUser?.uid])

  return !loading ? (
    <>
      <Modal show={show} onHide={handleClose} centered >
        <Modal.Body className='modal_body' style={{ backgroundColor: theme.palette.background.default }}>
          <UploadPicture handleClose={handleClose} />
        </Modal.Body>
      </Modal>

      <div className='Profile'>
        <div className='profile_header'>
          <div style={{ position: 'relative', width: 'fit-content' }}>
            <img src={currentPhoto ? currentPhoto : `https://api.dicebear.com/6.x/thumbs/png?seed=Bubba`} className='profile_image' />
            <div style={{ position: 'absolute', left: 6, bottom: 6 }}>
              <IconButton className='icon_button' style={{ backgroundColor: theme.palette.background.default }}><CreateIcon className="icon" onClick={() => handleShow()} /></IconButton>
            </div>
            {currentPhoto && currentPhoto.includes('firebase') && <div style={{ position: 'absolute', right: 6, bottom: 6 }}>
              <IconButton className='icon_button' style={{ backgroundColor: theme.palette.background.default }}><DeleteIcon color="error" className="icon" onClick={() => removePicture()} /></IconButton>
            </div>}
          </div>
          <div className="profile_actions">
            <div className='profile_username' style={{ maxWidth: window.innerWidth - 100 }}>{currentUsername ? currentUsername : 'Loading...'}</div>
            &nbsp;<IconButton className='icon_button' onClick={() => signOut()} style={{ backgroundColor: theme.palette.background.default }}><LogoutIcon className="icon" /></IconButton>
          </div>
        </div>
        {watching.length !== 0 && <>
          <div className='trending_title' >Watching Now ({watching?.length})</div>
          <div className='trending_scroll' >
            {watching && watching.map((data) => {
              return <SingleContentScroll data={data.data} key={data.id} type={data.type} />
            })}
          </div><br /></>}
        {watchlist.length !== 0 && <>
          <div className='trending_title' >Watchlist ({watchlist?.length})<Link to={`/singlecategory/watchlist/Trending/Watchlist/${auth?.currentUser?.uid}`} className="viewall"><IconButton><ChevronRightIcon /></IconButton></Link></div>
          <div className='trending_scroll' >
            {watchlist && watchlist.map((data) => {
              return <SingleContentScroll data={data.data} key={data.id} type={data.type} />
            })}
          </div><br /></>}
        {recommendation.length !== 0 && <>
          <div className='trending_title' >Because You Watched <IconButton className='refresh_icon'><CachedIcon onClick={() => randomNumber()} /></IconButton></div>
          <div className='searchresultfor' >{favourite[number]?.data?.title || favourite[number]?.data?.name}</div>
          <div className='trending_scroll' >
            {recommendation && recommendation.map((data) => {
              return <SingleContentScroll data={data} key={data.id} type={favourite[number]?.type} recom={true} />
            })}
          </div><br /></>}
        {watched.length !== 0 && <>
          <div className='trending_title' >Watched ({watched?.length})<Link to={`/singlecategory/watched/Trending/Watched/${auth?.currentUser?.uid}`} className="viewall"><IconButton><ChevronRightIcon /></IconButton></Link></div>
          <div className='trending_scroll' >
            {watched && watched.map((data) => {
              return <SingleContentScroll data={data.data} key={data.id} type={data.type} />
            })}
          </div><br /></>}
        {suggestions.length !== 0 && <>
          <div className='trending_title' >Suggestions ({suggestions?.length})</div>
          <div className='trending_scroll' >
            {suggestions && suggestions.map((data) => {
              return <div>
                <SingleContentScroll data={data.data} key={data.id} type={data.type} by={data.by} byuid={data.byuid} id={data.id} />
              </div>
            })}
          </div><br /></>}
        {favourite.length !== 0 && <>
          <div className='trending_title' >Favourites ({favourite?.length})<Link to={`/singlecategory/favourites/Trending/Favourites/${auth?.currentUser?.uid}`} className="viewall"><IconButton><ChevronRightIcon /></IconButton></Link></div>
          <div className='trending_scroll' >
            {favourite && favourite.map((data) => {
              return <SingleContentScroll data={data.data} key={data.id} type={data.type} />
            })}
          </div><br /></>}
        {cast.length !== 0 && <>
          <div className='trending_title' >Favourite Cast</div>
          <div className='trending_scroll' >
            {cast && cast.map((c) => {
              return <Cast c={c} key={c.id} />
            })}
          </div><br /></>}
        {favourite.length === 0 && cast.length === 0 && watchlist.length === 0 && watching.length === 0 && <center><br />
          <img src={empty} className='empty' alt="" />
          <h6 style={{ color: 'gray' }}>Nothing to show here</h6></center>}
      </div>

    </>
  ) : <div className="loading">
    <CircularProgress color='warning' />
  </div>
}
