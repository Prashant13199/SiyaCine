import React, { useEffect, useState } from 'react';
import { database, auth } from '../../firebase';
import './style.css';
import SingleContent from '../../Components/SingleContent';
import { IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useHistory, Link } from 'react-router-dom';
import axios from "axios";

export default function Profile() {

  const uid = localStorage.getItem('uid')
  const [currentusername, setCurrentUsername] = useState('')
  const [currentPhoto, setCurrentPhoto] = useState('')
  const [watchlist, setWatchlist] = useState([])
  const [favourite, setFavourite] = useState([])
  const [watching, setWatching] = useState([])
  const [cast, setCast] = useState([])
  const history = useHistory()
  const [recommendation, setRecommendation] = useState([])
  const [number, setNumber] = useState('')

  useEffect(() => {
    fetchRecommendation();
  }, [number])

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

  const fetchRecommendation = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/${favourite[number]?.type}/${favourite[number]?.id}/recommendations?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&sort_by=popularity.desc&include_video=false`
    );
    setRecommendation(data.results);
  };

  useEffect(() => {
    database.ref(`/Users/${uid}`).on('value', snapshot => {
      setCurrentUsername(snapshot.val()?.username)
      setCurrentPhoto(snapshot.val()?.photo)
    })
  }, [])

  useEffect(() => {
    let arr = []
    database.ref(`/Users/${uid}/watchlist`).on('value', snapshot => {
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, data: snap.val().data, type: snap.val().type })
      })
    })
    setWatchlist(arr)
  }, [])

  useEffect(() => {
    let arr = []
    database.ref(`/Users/${uid}/favourites`).on('value', snapshot => {
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, data: snap.val().data, type: snap.val().type })
      })
    })
    setFavourite(arr)
  }, [])

  useEffect(() => {
    let arr = []
    database.ref(`/Users/${uid}/watching`).on('value', snapshot => {
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, data: snap.val().data, type: snap.val().type })
      })
    })
    setWatching(arr)
  }, [])

  useEffect(() => {
    let arr = []
    database.ref(`/Users/${uid}/cast`).on('value', snapshot => {
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, data: snap.val().data })
      })
    })
    setCast(arr)
  }, [])

  return (
    <div className='Profile'>
      <div className='welcome' style={{ backgroundImage: favourite.length !== 0 ? `url(https://image.tmdb.org/t/p/original/${favourite[number].data.backdrop_path})` : 'linear-gradient(0deg, rgba(34,193,195,1) 0%, rgba(253,187,45,1) 100%)', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}>
        <div className='welcome_backdrop'>
          <div style={{ width: '100%' }}>
            <div className='profile_header'>
              <div>
                <img src={currentPhoto} className='profile_image' />
              </div>
              <div className="profile_actions">
                <div className='profile_username'>{currentusername}</div>
                &nbsp;<IconButton onClick={() => signOut()} style={{ backgroundColor: 'white' }}><LogoutIcon /></IconButton>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
      {watching.length !== 0 && <><br />
        <div className='trending_title'>Watching Now</div>
        <div className='trending_scroll'>
          {watching && watching.map((data) => {
            return <SingleContent data={data.data} key={data.id} type={data.type} />
          })}
        </div></>}
      {recommendation.length !== 0 && <><br />
        <div className='trending_title'>Recommendation</div>
        <div className='searchresultfor'>Because you liked {favourite[number]?.data?.title || favourite[number]?.data?.name}</div>
        <div className='trending_scroll'>
          {recommendation && recommendation.map((data) => {
            return <SingleContent data={data} key={data.id} type={favourite[number]?.type} />
          })}
        </div></>}
      {watchlist.length !== 0 && <> <br />
        <div className='trending_title'>Watchlist</div>
        <div className='trending_scroll'>
          {watchlist && watchlist.map((data) => {
            return <SingleContent data={data.data} key={data.id} type={data.type} />
          })}
        </div></>}
      {favourite.length !== 0 && <><br />
        <div className='trending_title'>Favourites</div>
        <div className='trending_scroll'>
          {favourite && favourite.map((data) => {
            return <SingleContent data={data.data} key={data.id} type={data.type} />
          })}
        </div></>}
      {cast.length !== 0 && <><br />
        <div className='trending_title'>Favourite Cast</div>
        <div className='trending_scroll'>
          {cast && cast.map((c) => {
            return <Link to={`/singlecast/${c.id}`} style={{ textDecoration: 'none', color: 'black' }}>
              <div className='cast_single'>
                <img alt="" src={c.data.profile_path ? `https://image.tmdb.org/t/p/w500/${c.data.profile_path}` : "https://upload.wikimedia.org/wikipedia/en/6/60/No_Picture.jpg"} className='cast_image' />
                <div style={{ marginTop: '5px' }}>
                  <div style={{ fontWeight: '500', maxWidth: '150px' }}>{c.data.name}</div>
                </div>
              </div>
            </Link>
          })}
        </div></>}
      {favourite.length === 0 && cast.length === 0 && watchlist.length === 0 && watching.length === 0 && <><br />
        <h2 style={{ textAlign: 'center' }}>Add to Watchlist or Favourite</h2></>}
      <br />
    </div>

  )
}
