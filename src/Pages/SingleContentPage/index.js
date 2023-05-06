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
import Grow from '@mui/material/Grow';
import SendIcon from '@mui/icons-material/Send';
import { useTheme } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    } else {
      entry.target.classList.remove('show')
    }
  })
})

export default function SingleContentPage() {

  const { id, type } = useParams()
  const [data, setData] = useState([])
  const [watchprovider, setWatchProvider] = useState({})
  const [credit, setCredit] = useState([])
  const [similar, setSimilar] = useState([])
  const [video, setVideo] = useState();
  const uid = localStorage.getItem('uid')
  const currentusername = localStorage.getItem('username')
  const [favourite, setFavourite] = useState(false)
  const [watchlist, setWatchlist] = useState(false)
  const [watching, setWatching] = useState(false)
  const [recommendations, setRecommendations] = useState([])
  const [reviews, setReviews] = useState([])
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);
  const [readMore, setReadMore] = useState(false)
  const [checked, setChecked] = React.useState(false);
  const [users, setUsers] = useState([])
  const theme = useTheme()
  const [snackBar, setSnackBar] = useState(false)

  useEffect(() => {
    document.querySelectorAll('.hidden').forEach((el) => observer.observe(el))
  })

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

    database.ref(`/Users`).on('value', snapshot => {
      let user = []
      snapshot.forEach((snap) => {
        if (snap.key !== uid) {
          user.push(snap.val())
        }
      })
      setUsers(user)
    })

  }, [id])

  const fetchDetails = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/${type}/${id}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
    );
    setData(data);
    setChecked(true)
  };

  const fetchProvider = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/${type}/${id}/watch/providers?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
    );
    setWatchProvider(data.results ? { path: data.results?.IN ? data.results?.IN?.flatrate[0].logo_path : '', link: data.results?.IN ? data.results?.IN?.link : '' } : '');
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
  };

  useEffect(() => {
    window.scroll(0, 0);
    setChecked(false)
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

  const handleSend = (user) => {
    database.ref(`/Users/${user}/suggestions/${id}`).update({
      type: type, data: data, id: id, by: currentusername
    }).then(() => {
      handleClose2()
      setSnackBar(true)
    }).catch((e) => { console.log(e) })
  }

  const render = (
    <Grow in={checked} {...(checked ? { timeout: 1000 } : {})} style={{ transformOrigin: '0 0 0' }}>
      <div className='singlecontent_responsive'>
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
              <Tooltip title="Share">
                <IconButton style={{ backgroundColor: '#3385ff', marginLeft: '10px' }} onClick={() => handleShow2()}>
                  <SendIcon style={{ color: 'white' }} />
                </IconButton>
              </Tooltip>
            </div>}
            <div className='watchprovider'>
              {video && <Button
                startIcon={<YouTubeIcon style={{ color: 'red', fontSize: '30px' }} />}
                className='button'
                target="__blank"
                onClick={() => handleShow()}
                variant='filled'
              >
                Play Trailer
              </Button>}
              {watchprovider.path && <Button
                startIcon={<img alt="" src={`https://image.tmdb.org/t/p/w500/${watchprovider.path}`} height={'30px'} width={'30px'} style={{ borderRadius: '8px' }} />}
                className='button'
                target="__blank"
                href={watchprovider.link}
                variant='filled'
              >
                Available Now
              </Button>}
            </div>
          </div>
          {credit.crew && credit.crew.map((cr) => {
            return cr.job === 'Director' && <div className='overview' key={cr.id}>
              <h4>Director</h4>
              {cr.name}
            </div>
          })}
          {data.overview && <div className='overview'>
            <h4>Overview</h4>
            {data.overview?.length > 200 && !readMore ? data.overview.substring(0, 200).concat('...') : data.overview}
            <span className='readmore' onClick={() => setReadMore(!readMore)}>{data.overview && data.overview?.length > 200 && (!readMore ? 'read more.' : 'Less')}</span>
          </div>}
        </div>
      </div>
    </Grow>
  )

  return (
    <>
      <Modal show={show} onHide={handleClose} centered size="xl">
        <Modal.Body className='trailer' style={{ backgroundColor: theme.palette.background.default }}>
          <IconButton onClick={() => handleClose()} style={{ position: 'absolute', top: 0, right: 0 }}><CloseIcon style={{ color: 'red' }} /></IconButton>
          <div style={{ height: '100%', width: '100%' }}>
            <ReactPlayer url={`https://www.youtube.com/watch?v=${video}`} width={'100%'} height={'100%'} controls />
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={show2} onHide={handleClose2} centered>
        <Modal.Body style={{ backgroundColor: theme.palette.background.default, maxHeight: '60vh', overflowY: 'auto', borderRadius: '10px' }}>
          <IconButton onClick={() => handleClose2()} style={{ position: 'absolute', top: 0, right: 0 }}><CloseIcon style={{ color: 'red' }} /></IconButton>
          <h2>Share To</h2>
          {users && users.map((user) => {
            return <div className='share_user' onClick={() => handleSend(user.uid)}>
              <div>
                <img src={user.photo} className="share_user_image" />
              </div>
              <div className='share_user_username'>
                {user.username.length > 25 ? user.username.substring(0, 25).concat('...') : user.username}
              </div>
            </div>
          })}
        </Modal.Body>
      </Modal>

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={snackBar}
        onClose={() => setSnackBar(false)}
        autoHideDuration={2000}
        action={<IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={() => setSnackBar(false)}
        >
          <CloseIcon fontSize="small" />
        </IconButton>}
      ><Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Suggestion sent!
        </Alert></Snackbar>

      <div className='pc'>
        <div style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original/${data.backdrop_path})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', borderRadius: '10px' }}>
          <div className='backdrop_opacity'>
            {render}
          </div>
        </div>
      </div>
      <div className='singlecontent'>
        <div className='mobile'>
          {render}
        </div>
        <div className='pc'><br /></div>
        {credit.cast && credit.cast.length !== 0 && <><div className='trending_title hidden'>Cast</div>
          <div className='cast hidden'>
            {credit && credit.cast.map((c) => {
              return <Link to={`/singlecast/${c.id}`} style={{ textDecoration: 'none' }} key={c.id}>
                <div className='cast_single' key={c.id}>
                  <img alt="" src={c.profile_path ? `https://image.tmdb.org/t/p/w300/${c.profile_path}` : "https://upload.wikimedia.org/wikipedia/en/6/60/No_Picture.jpg"} className='cast_image' />
                  <div style={{ marginTop: '5px' }}>
                    <div style={{ fontWeight: '500', maxWidth: '150px' }}>{c.original_name}</div>
                    <div style={{ color: "gray", maxWidth: '150px', fontSize: '14px' }}>{c.character.length > 30 ? c.character.substring(0, 30).concat('...') : c.character}</div>
                  </div>
                </div>
              </Link>
            })}
          </div></>}
        {similar.length !== 0 && <><br />
          <div className='trending_title hidden'>Similar</div>
          <div className='trending_scroll hidden'>
            {similar && similar.map((data) => {
              return <SingleContentScroll data={data} key={data.id} type={type} />
            })}
          </div>
        </>}
        {recommendations.length !== 0 && <><br />
          <div className='trending_title hidden'>Recommendations</div>
          <div className='trending_scroll hidden'>
            {recommendations && recommendations.map((data) => {
              return <SingleContentScroll data={data} key={data.id} type={type} />
            })}
          </div>
        </>}
        {reviews.length !== 0 && <><br />
          <div className='trending_title hidden'>Reviews</div>
          <div className='reviews hidden'>
            {reviews && reviews.map((data) => {
              return <div className='single_review hidden' key={data.id}>
                <div style={{ fontWeight: '600', fontSize: '18px' }}>{data.author_details.username}</div>
                <Review review={data.content} />
              </div>
            })}
          </div>
        </>}

      </div>
    </>
  )
}
