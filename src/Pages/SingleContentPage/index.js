import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './style.css'
import axios from "axios";
import SingleContent from '../../Components/SingleContent';
import Button from '@mui/material/Button';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { database } from '../../firebase'
import Tooltip from '@mui/material/Tooltip';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

export default function SingleContentPage() {

  const { id, type } = useParams()
  const [data, setData] = useState([])
  const [watchprovider, setWatchProvider] = useState({})
  const [credit, setCredit] = useState([])
  const [similar, setSimilar] = useState([])
  const [video, setVideo] = useState();
  const uid = localStorage.getItem('uid')
  const [favourite, setFavourite] = useState(false)
  const [watchlist, setWatchlist] = useState(false)
  const [watching, setWatching] = useState(false)

  useEffect(() => {

    database.ref(`/Users/${uid}/favourites/${type}/${id}`).on('value',  snapshot => {
      if(snapshot.val()?.id === id){
        setFavourite(true)
      }
    })

    database.ref(`/Users/${uid}/watchlist/${type}/${id}`).on('value',  snapshot => {
      if(snapshot.val()?.id === id){
        setWatchlist(true)
      }
    })

    database.ref(`/Users/${uid}/watching/${type}/${id}`).on('value',  snapshot => {
      if(snapshot.val()?.id === id){
        setWatching(true)
      }
    })

  },[])

  const fetchDetails = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/${type}/${id}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
    );
    setData(data);
  };

  const fetchProvider = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/${type}/${id}/watch/providers?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
    );
    setWatchProvider({ path: data.results.IN ? data.results.IN.flatrate[0].logo_path : '',link: data.results.IN ? data.results.IN.link : '' });
  };

  const fetchCredit = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/${type}/${id}/credits?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
    );
    setCredit(data.cast);
  };

  const fetchSimilar = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/${type}/${id}/similar?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&page=1`
    );
    setSimilar(data.results);
  };

  const fetchVideo = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
    );

    setVideo(data.results[0]?.key);
  };

  useEffect(() => {
    window.scroll(0, 0);
    fetchProvider();
    fetchDetails();
    fetchCredit();
    fetchSimilar();
    fetchVideo();
  }, [id])

  const handleFavourite = () => {
    if(!favourite) {
      database.ref(`/Users/${uid}/favourites/${type}/${id}`).set({
        id: id, data: data
      }).then(() => {
        console.log("Set to favourite")
        setFavourite(true)
      })
    }else{ 
      database.ref(`/Users/${uid}/favourites/${type}/${id}`).remove().then(() => {
        console.log("Removed from favourite")
        setFavourite(false)
      })
    }
  }

  const handleWatchlist = () => {
    if(!watchlist) {
      database.ref(`/Users/${uid}/watchlist/${type}/${id}`).set({
        id: id, data: data
      }).then(() => {
        console.log("Set to watchlist")
        setWatchlist(true)
      })
    }else{ 
      database.ref(`/Users/${uid}/watchlist/${type}/${id}`).remove().then(() => {
        console.log("Removed from watchlist")
        setWatchlist(false)
      })
    }
  }

  const handleWatching = () => {
    if(!watching) {
      database.ref(`/Users/${uid}/watching/${type}/${id}`).set({
        id: id, data: data
      }).then(() => {
        console.log("Set to watching")
        setWatching(true)
      })
    }else{ 
      database.ref(`/Users/${uid}/watching/${type}/${id}`).remove().then(() => {
        console.log("Removed from watching")
        setWatching(false)
      })
    }
  }


  return (
    <div className='singlecontent'>
      <div className='singlecontent_responsive'>
        <div className='singlecontentposter_responsive'>
          <img src={data.poster_path ? `https://image.tmdb.org/t/p/w500/${data.poster_path}` : "https://www.movienewz.com/img/films/poster-holder.jpg"} className='singlecontentposter' />
        </div>
        <div className='details'>
          <h2 style={{ fontWeight: 'bold' }}>{data.title || data.original_name}</h2>
          <div><span>{data.release_date || data.first_air_date}&nbsp;&nbsp;&#183;&nbsp;&nbsp;{data.genres && data.genres.map((g, index) => { return <span key={g.id}>{index !== 0 && ', '}{g.name}</span>})}{data.runtime && <>&nbsp;&nbsp;&#183;&nbsp;&nbsp;{Math.ceil(data.runtime / 60)}h</>}</span></div>
          {data.tagline && (
            <div className="tagline"><i>{data.tagline}</i></div>
          )}
          <div className='actions'>
            {uid && <div style={{ marginRight: '20px' }}>
            <Tooltip title="Favourite">
            <IconButton style={{ backgroundColor: '#3385ff' }} onClick={() => handleFavourite()}>
              {favourite ? <FavoriteIcon style={{ color: 'red' }} /> : <FavoriteIcon style={{ color: 'white' }} />}
            </IconButton>
            </Tooltip>
            <Tooltip title="Watchlist">
            <IconButton style={{ backgroundColor: '#3385ff', marginLeft: '10px' }} onClick={() => handleWatchlist()}>
              {watchlist ? <BookmarkIcon style={{ color: 'orange' }} /> : <BookmarkIcon style={{ color: 'white' }} /> }
            </IconButton>
            </Tooltip>
            <Tooltip title="Watching">
            <IconButton style={{ backgroundColor: '#3385ff', marginLeft: '10px' }} onClick={() => handleWatching()}>
              {watching ? <PlayCircleOutlineIcon style={{ color: 'blue' }} /> : <PlayCircleOutlineIcon style={{ color: 'white' }} /> }
            </IconButton>
            </Tooltip>
            </div>}
            <div className='watchprovider'>
            <Button
              startIcon={<YouTubeIcon />}
              style={{ color: 'black' }}
              target="__blank"
              href={`https://www.youtube.com/watch?v=${video}`}
            >
              Play Trailer
            </Button>
            {watchprovider.path && <Button
              startIcon={<img src={`https://image.tmdb.org/t/p/w500/${watchprovider.path}`} height={'20px'} width={'20px'} style={{ borderRadius: '2px' }} />}
              style={{ marginLeft: '10px', color: 'black' }}
              target="__blank"
              href={watchprovider.link}
            >
              Available Now
            </Button>}
            </div>
          </div>
          <div className='overview'>
            <h4>Overview</h4>
            {data.overview}
          </div>
        </div>
      </div>
      <br /><br />
      <div className='trending_title'>Cast</div>
      <div className='cast'>
        {credit && credit.map((c) => (
          <div className='cast_single'>
            <img src={c.profile_path ? `https://image.tmdb.org/t/p/w500/${c.profile_path}` : "https://upload.wikimedia.org/wikipedia/en/6/60/No_Picture.jpg"} className='cast_image' />
            <div style={{ marginTop: '5px' }}>
              <div style={{ fontWeight: '500', maxWidth: '150px' }}>{c.original_name}</div>
              <div style={{ color: "gray", maxWidth: '150px', fontSize: '14px' }}>{c.character}</div>
            </div>
          </div>
        ))}
      </div>
      {similar.length!==0 && <>
        <br /><br />
        <div className='trending_title'>Similar</div>
        <div className='trending_scroll'>
          {similar && similar.map((data) => {
            return <SingleContent data={data} key={data.id} type={type} />
          })}
        </div>
      </>}

    </div>
  )
}
