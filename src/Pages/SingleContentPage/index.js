import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './style.css'
import axios from "axios";
import SingleContentScroll from '../../Components/SingleContentScroll';
import Button from '@mui/material/Button';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddIcon from '@mui/icons-material/Add';
import DoneIcon from '@mui/icons-material/Done';
import { database } from '../../firebase'
import Tooltip from '@mui/material/Tooltip';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { Link } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import ReactPlayer from 'react-player'
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import Review from '../../Components/review';

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
  const [recommendations, setRecommendations] = useState([])
  const [reviews, setReviews] = useState([])
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {

    database.ref(`/Users/${uid}/favourites/${id}`).on('value', snapshot => {
      if (snapshot.val()?.id === id) {
        setFavourite(true)
      } else {
        setFavourite(false)
      }
    })

    database.ref(`/Users/${uid}/watchlist/${id}`).on('value', snapshot => {
      if (snapshot.val()?.id === id) {
        setWatchlist(true)
      } else {
        setWatchlist(false)
      }
    })

    database.ref(`/Users/${uid}/watching/${id}`).on('value', snapshot => {
      if (snapshot.val()?.id === id) {
        setWatching(true)
      } else {
        setWatching(false)
      }
    })

  }, [id])

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
    setWatchProvider({ path: data.results.IN ? data.results.IN.flatrate[0].logo_path : '', link: data.results.IN ? data.results.IN.link : '' });
  };

  const fetchCredit = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/${type}/${id}/credits?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
    );
    setCredit(data);
  };

  const fetchSimilar = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/${type}/${id}/similar?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&page=1`
    );
    setSimilar(data.results);
  };

  const fetchRecommendation = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/${type}/${id}/recommendations?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&page=1`
    );
    setRecommendations(data.results);
  };

  const fetchVideo = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
    );

    setVideo(data.results[0]?.key);
  };

  const fetchReviews = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/${type}/${id}/reviews?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
    );
    setReviews(data.results)
    console.log(data.results);
  };

  useEffect(() => {
    window.scroll(0, 0);
    fetchProvider();
    fetchDetails();
    fetchCredit();
    fetchSimilar();
    fetchVideo();
    fetchRecommendation();
    fetchReviews();
  }, [id])

  const handleFavourite = () => {
    if (!favourite) {
      database.ref(`/Users/${uid}/favourites/${id}`).set({
        id: id, data: data, type: type,
      }).then(() => {
        console.log("Set to favourite")
        setFavourite(true)
      })
    } else {
      database.ref(`/Users/${uid}/favourites/${id}`).remove().then(() => {
        console.log("Removed from favourite")
        setFavourite(false)
      })
    }
  }

  const handleWatchlist = () => {
    if (!watchlist) {
      database.ref(`/Users/${uid}/watchlist/${id}`).set({
        id: id, data: data, type: type
      }).then(() => {
        console.log("Set to watchlist")
        setWatchlist(true)
      })
    } else {
      database.ref(`/Users/${uid}/watchlist/${id}`).remove().then(() => {
        console.log("Removed from watchlist")
        setWatchlist(false)
      })
    }
  }

  const handleWatching = () => {
    if (!watching) {
      database.ref(`/Users/${uid}/watching/${id}`).set({
        id: id, data: data, type: type,
      }).then(() => {
        console.log("Set to watching")
        setWatching(true)
      })
    } else {
      database.ref(`/Users/${uid}/watching/${id}`).remove().then(() => {
        console.log("Removed from watching")
        setWatching(false)
      })
    }
  }

  const render = (
    <div className='singlecontent_responsive' >
      <div className='singlecontentposter_responsive'>
        <img alt="" src={data.poster_path ? `https://image.tmdb.org/t/p/w500/${data.poster_path}` : "https://www.movienewz.com/img/films/poster-holder.jpg"} className='singlecontentposter' />
      </div>
      <div className='details'>
        <h2 style={{ fontWeight: 'bold' }}>{data.title || data.original_name}</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {(data.release_date || data.first_air_date) && <>{data.release_date || data.first_air_date}{(data.release_date || data.first_air_date) && data.runtime && <>&nbsp;&#183;&nbsp;</>}</>}{data.runtime && data.runtime !== 0 && <>{Math.ceil(data.runtime / 60)}h</>}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', margin: '10px 0px' }}>
          {data.genres && data.genres.map((g) => { return <div key={g.id} className='genrelist'>{g.name}</div> })}
        </div>
        {data.vote_average !== 0 && <div className='overview'>
          <StarIcon style={{ color: "#FFD700" }} /> {Math.round(data.vote_average)}<span style={{ fontSize: 'small', opacity: 0.6 }}>/10</span>
        </div>}
        {data.tagline && (
          <div className="tagline"><i>{data.tagline}</i></div>
        )}
        {data.number_of_seasons && <div className='overview'>
          {data.number_of_seasons} Seasons&nbsp;&nbsp;&#183;&nbsp;&nbsp;{data.number_of_episodes} Episodes
        </div>}

        <div className='actions'>
          {uid && <div style={{ marginRight: '20px' }}>
            <Tooltip title="Favourite">
              <IconButton style={{ backgroundColor: '#3385ff' }} onClick={() => handleFavourite()}>
                {favourite ? <FavoriteIcon style={{ color: 'red' }} /> : <FavoriteIcon style={{ color: 'white' }} />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Watchlist">
              <IconButton style={{ backgroundColor: '#3385ff', marginLeft: '10px' }} onClick={() => handleWatchlist()}>
                {watchlist ? <DoneIcon style={{ color: 'white' }} /> : <AddIcon style={{ color: 'white' }} />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Watching">
              <IconButton style={{ backgroundColor: '#3385ff', marginLeft: '10px' }} onClick={() => handleWatching()}>
                {watching ? <PlayCircleOutlineIcon style={{ color: 'orange' }} /> : <PlayCircleOutlineIcon style={{ color: 'white' }} />}
              </IconButton>
            </Tooltip>
          </div>}
          <div className='watchprovider'>
            {video && <Button
              startIcon={<YouTubeIcon style={{ color: 'red', fontSize: '30px' }} />}
              className='button'
              target="__blank"
              style={{ color: 'white' }}
              onClick={() => handleShow()}
            >
              Play Trailer
            </Button>}
            {watchprovider.path && <Button
              startIcon={<img alt="" src={`https://image.tmdb.org/t/p/w500/${watchprovider.path}`} height={'30px'} width={'30px'} style={{ borderRadius: '8px' }} />}
              style={{ color: 'white' }}
              className='button'
              target="__blank"
              href={watchprovider.link}
            >
              Available Now
            </Button>}
          </div>
        </div>
        {credit.crew && credit.crew.map((cr) => {
          return cr.job === 'Director' && <div className='overview'>
            <h4>Director</h4>
            {cr.name}
          </div>
        })}
        {data.overview && <div className='overview'>
          <h4>Overview</h4>
          {data.overview}
        </div>}
      </div>
    </div>
  )
  console.log(credit)

  return (
    <>
      <Modal show={show} onHide={handleClose} centered size="xl">
        <Modal.Body className='trailer'>
          <ReactPlayer url={`https://www.youtube.com/watch?v=${video}`} width={'100%'} height={'100%'} controls />
          <IconButton onClick={() => handleClose()} style={{ position: 'absolute', top: 0, right: 0 }}><CloseIcon style={{ color: 'red' }} /></IconButton>
        </Modal.Body>
      </Modal>
      <div className='pc'>
        <div style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original/${data.backdrop_path})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', width: '100vw', marginTop: '60px' }}>
          <div className='backdrop_opacity'>
            {render}
          </div>
        </div>
      </div>
      <div className='singlecontent'>
        <div className='mobile'>
          {render}
        </div>
        {credit.cast && credit.cast.length !== 0 && <><div className='trending_title'>Cast</div>
          <div className='cast'>
            {credit && credit.cast.map((c) => (
              <Link to={`/singlecast/${c.id}`} style={{ textDecoration: 'none', color: 'black' }}>
                <div className='cast_single'>
                  <img alt="" src={c.profile_path ? `https://image.tmdb.org/t/p/w300/${c.profile_path}` : "https://upload.wikimedia.org/wikipedia/en/6/60/No_Picture.jpg"} className='cast_image' />
                  <div style={{ marginTop: '5px' }}>
                    <div style={{ fontWeight: '500', maxWidth: '150px', color: 'white' }}>{c.original_name}</div>
                    <div style={{ color: "gray", maxWidth: '150px', fontSize: '14px' }}>{c.character.length > 30 ? c.character.substring(0, 30).concat('...') : c.character}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div></>}
        {similar.length !== 0 && <><br />
          <div className='trending_title'>Similar</div>
          <div className='trending_scroll'>
            {similar && similar.map((data) => {
              return <SingleContentScroll data={data} key={data.id} type={type} />
            })}
          </div>
        </>}
        {recommendations.length !== 0 && <><br />
          <div className='trending_title'>Recommendations</div>
          <div className='trending_scroll'>
            {recommendations && recommendations.map((data) => {
              return <SingleContentScroll data={data} key={data.id} type={type} />
            })}
          </div>
        </>}
        {reviews.length !== 0 && <><br />
          <div className='trending_title'>Reviews</div>
          <div className='reviews'>
            {reviews && reviews.map((data) => {
              return <div className='single_review'>
                <div style={{ fontWeight: '600', color: 'white', fontSize: '18px' }}>{data.author_details.username}</div>
                <Review review={data.content} />
              </div>
            })}
          </div>
        </>}
        <br />
      </div>
    </>
  )
}
