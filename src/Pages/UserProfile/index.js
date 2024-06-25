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
import { Helmet } from 'react-helmet'
import useFetchDBData from '../../hooks/useFetchDBData'
import useFetchUserDetails from '../../hooks/useFetchUserDetails'

export default function UserProfile({ setBackdrop, scrollTop }) {

  const { uid } = useParams()
  const [number, setNumber] = useState(null)
  const [loading, setLoading] = useState(true)
  const [admin, setAdmin] = useState(false)
  const [premium, setPremium] = useState(false)

  const watchlist = useFetchDBData(uid, 'watchlist')
  const watched = useFetchDBData(uid, 'watched')
  const favourite = useFetchDBData(uid, 'favourites')
  const watching = useFetchDBData(uid, 'watching')
  const cast = useFetchDBData(uid, 'cast')
  const username = useFetchUserDetails(uid, 'username')
  const photo = useFetchUserDetails(uid, 'photo')

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
    database.ref(`/Users/${auth?.currentUser?.uid}/admin`).on('value', snapshot => {
      setAdmin(snapshot.val())
    })
    database.ref(`/Users/${uid}/premium`).on('value', snapshot => {
      setPremium(snapshot.val())
    })
    setLoading(false)
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

  return (
    <>

      <Helmet>
        <title>SiyaCine{username ? ` - ${username}` : ''}</title>
      </Helmet>

      {!loading ? <div className='profile'>
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

        {watching?.length !== 0 && <>
          <div className='trending_title' ><Count value={watching?.length} />Watching Now</div>
          <div className='trending_scroll' >
            {watching?.map((data) => {
              return <SingleContentScroll data={data.data} id={data.id} key={data.id} type={data.type} userid={uid} showtv={true} />
            })}
          </div><br /></>}
        {watchlist?.length !== 0 && <>
          <div className='trending_title' ><Count value={watchlist?.length} />Watchlist<Link to={`/singlecategory/watchlist/Trending/Watchlist/${uid}`} className="viewall"><IconButton><ChevronRightIcon /></IconButton></Link></div>
          <div className='trending_scroll' >
            {watchlist?.map((data) => {
              return <SingleContentScroll data={data.data} id={data.id} key={data.id} type={data.type} showtv={true} />
            })}
          </div><br /></>}
        {watched?.length !== 0 && <>
          <div className='trending_title' ><Count value={watched?.length} />Watched<Link to={`/singlecategory/watched/Trending/Watched/${uid}`} className="viewall"><IconButton><ChevronRightIcon /></IconButton></Link></div>
          <div className='trending_scroll' >
            {watched?.map((data) => {
              return <SingleContentScroll data={data.data} id={data.id} key={data.id} type={data.type} showtv={true} />
            })}
          </div><br /></>}
        {favourite?.length !== 0 && <>
          <div className='trending_title' ><Count value={favourite?.length} />Favourites<Link to={`/singlecategory/favourites/Trending/Favourites/${uid}`} className="viewall"><IconButton><ChevronRightIcon /></IconButton></Link></div>
          <div className='trending_scroll' >
            {favourite?.map((data) => {
              return <SingleContentScroll data={data.data} id={data.id} key={data.id} type={data.type} showtv={true} />
            })}
          </div><br /></>}
        {cast?.length !== 0 && <>
          <div className='trending_title' ><Count value={cast?.length} />Favourite Cast</div>
          <div className='trending_scroll' >
            {cast?.map((c) => {
              return <Cast c={c} key={c?.id} />
            })}
          </div><br /></>}
        {favourite?.length === 0 && cast?.length === 0 && watchlist?.length === 0 && watching?.length === 0 && <center><br />
          <img src={empty} className='empty' alt="" />
          <h6 style={{ color: 'gray' }}>Nothing to show here</h6></center>}
      </div> : <div className="loading">
        <CircularProgress color='warning' />
      </div>}

    </>
  )
}
