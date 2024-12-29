import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './style.css';
import axios from "axios";
import SingleContentScroll from '../../Components/SingleContentScroll';
import Button from '@mui/material/Button';
import { CircularProgress, Grow, IconButton, TextField } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddIcon from '@mui/icons-material/Add';
import DoneIcon from '@mui/icons-material/Done';
import { auth, database } from '../../firebase';
import Tooltip from '@mui/material/Tooltip';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import { Link } from 'react-router-dom';
import { Dropdown, Modal } from 'react-bootstrap';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarIcon from '@mui/icons-material/Star';
import Review from '../../Components/review';
import { useTheme } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { FavoriteOutlined } from '@mui/icons-material';
import Seasons from '../../Containers/Seasons';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { Helmet } from 'react-helmet';
import { RWebShare } from "react-web-share";
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import { getCurrentDate, timeConvert } from '../../Services/time';
import Trailers from '../../Containers/Trailers/Trailers';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import useFetchPremium from '../../hooks/useFetchPremium';
import { getUsername } from '../../Services/utlitities';
import useFetchUsers from '../../hooks/useFetchUsers';
import ShareUser from '../../Components/ShareUser';
import TimelineIcon from '@mui/icons-material/Timeline';

export default function SingleContentPage({ setBackdrop, scrollTop }) {

  const { id, type } = useParams()
  const [data, setData] = useState([])
  const [watchprovider, setWatchProvider] = useState({})
  const [credit, setCredit] = useState([])
  const [director, setDirector] = useState([])
  const [similar, setSimilar] = useState([])
  const [video, setVideo] = useState();
  const [favourite, setFavourite] = useState(false)
  const [watchlist, setWatchlist] = useState(false)
  const [watched, setWatched] = useState(false)
  const [watching, setWatching] = useState(false)
  const [recommendations, setRecommendations] = useState([])
  const [reviews, setReviews] = useState([])
  const [reviews2, setReviews2] = useState([])
  const [server, setServer] = useState(1)
  const [show2, setShow2] = useState(false);
  const [message, setMessage] = useState('')
  const [resumeSeries, setResumeSeries] = useState(false)
  const [show3, setShow3] = useState(false);
  const [show4, setShow4] = useState(false);
  const [readMore, setReadMore] = useState(false)
  const theme = useTheme()
  const [snackBar, setSnackBar] = useState(false)
  const [review, setReview] = useState('')
  const [loading, setLoading] = useState(true)
  const [tracking, setTracking] = useState([])

  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);
  const handleClose3 = () => setShow3(false);
  const handleShow3 = () => setShow3(true);
  const handleClose4 = () => {
    setShow4(false)
  }
  const handleShow4 = () => {
    setShow4(true)
    handleWatching2()
  }

  const premium = useFetchPremium(auth?.currentUser?.uid)
  const users = useFetchUsers()

  useEffect(() => {
    scrollTop()
  }, [])

  useEffect(() => {
    setLoading(true)
    fetchProvider();
    fetchDetails();
    fetchCredit();
    fetchSimilar();
    fetchVideo();
    fetchRecommendation();
    fetchReviews();
    scrollTop()
  }, [id])

  useEffect(() => {
    setBackdrop(window.innerWidth > 900 ? data?.backdrop_path : data?.poster_path)
  }, [data, window.innerWidth, window.innerWidth])

  useEffect(() => {
    database.ref(`/Users/${auth?.currentUser?.uid}/favourites/${id}`).on('value', snapshot => {
      if (snapshot.val()?.id === id) {
        setFavourite(true)
      } else {
        setFavourite(false)
      }
    })
    database.ref(`/Users/${auth?.currentUser?.uid}/tracking/${id}`).on('value', snapshot => {
      if (snapshot.val()?.id === id) {
        setTracking(true)
      } else {
        setTracking(false)
      }
    })
    database.ref(`/Users/${auth?.currentUser?.uid}/watchlist/${id}`).on('value', snapshot => {
      if (snapshot.val()?.id === id) {
        setWatchlist(true)
      } else {
        setWatchlist(false)
      }
    })
    database.ref(`/Users/${auth?.currentUser?.uid}/watched/${id}`).on('value', snapshot => {
      if (snapshot.val()?.id === id) {
        setWatched(true)
      } else {
        setWatched(false)
      }
    })
    database.ref(`/Users/${auth?.currentUser?.uid}/watching/${id}`).on('value', snapshot => {
      if (snapshot.val()?.id == id) {
        setWatching(true)
      } else {
        setWatching(false)
      }
    })
    database.ref(`/Reviews/${id}`).orderByChild('timestamp').on('value', snapshot => {
      let data = []
      snapshot.forEach((snap) => {
        data.push(snap.val())
      })
      setReviews2(data.reverse())
    })
  }, [id, auth?.currentUser?.uid])

  const fetchDetails = async () => {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/${type}/${id}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
      );
      setData(data);
      setLoading(false)
    }
    catch (e) {
      console.log(e)
    }
  };

  const fetchProvider = async () => {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/${type}/${id}/watch/providers?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
      );
      if (data.results?.IN?.flatrate) {
        setWatchProvider({ path: data.results?.IN?.flatrate[0] ? data.results?.IN?.flatrate[0]?.logo_path : '', link: data.results?.IN ? data.results?.IN?.link : '' });
      }
    }
    catch (e) {
      console.log(e)
    }
  };

  const fetchCredit = async () => {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/${type}/${id}/credits?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
      );
      setCredit(data);
      setDirector(data.crew.filter((cr) => cr.job === 'Director'))
    }
    catch (e) {
      console.log(e)
    }
  };

  const fetchSimilar = async () => {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/${type}/${id}/similar?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&page=1`
      );
      setSimilar(data.results);
    }
    catch (e) {
      console.log(e)
    }
  };

  const fetchRecommendation = async () => {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/${type}/${id}/recommendations?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&page=1`
      );
      setRecommendations(data.results);
    }
    catch (e) {
      console.log(e)
    }
  };

  const fetchVideo = async () => {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
      );
      setVideo(data?.results?.reverse())
    }
    catch (e) {
      console.log(e)
    }
  };

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/${type}/${id}/reviews?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
      );
      setReviews(data.results)
    }
    catch (e) {
      console.log(e)
    }
  };

  const handleFavourite = () => {
    if (!favourite) {
      database.ref(`/Users/${auth?.currentUser?.uid}/favourites/${id}`).set({
        id: id, data: data, type: type, timestamp: Date.now()
      }).then(() => {
        setFavourite(true)
      })
    } else {
      database.ref(`/Users/${auth?.currentUser?.uid}/favourites/${id}`).remove().then(() => {
        setFavourite(false)
      })
    }
  }

  const handleWatchlist = () => {
    if (!watchlist) {
      database.ref(`/Users/${auth?.currentUser?.uid}/watchlist/${id}`).set({
        id: id, data: data, type: type, timestamp: Date.now()
      }).then(() => {
        setWatchlist(true)
        setMessage('Added to watchlist')
        if (watched) {
          database.ref(`/Users/${auth?.currentUser?.uid}/watched/${id}`).remove().then(() => {
            setWatched(false)
          })
        }
        setSnackBar(true)
      }).catch((e) => console.log(e))
    } else {
      database.ref(`/Users/${auth?.currentUser?.uid}/watchlist/${id}`).remove().then(() => {
        setWatchlist(false)
      }).catch((e) => console.log(e))
    }
  }

  const handleWatched = () => {
    if (!watched) {
      database.ref(`/Users/${auth?.currentUser?.uid}/watched/${id}`).set({
        id: id, data: data, type: type, timestamp: Date.now()
      }).then(() => {
        setWatched(true)
        setMessage('Added to watched')
        setSnackBar(true)
        if (watchlist) {
          database.ref(`/Users/${auth?.currentUser?.uid}/watchlist/${id}`).remove().then(() => {
            setWatchlist(false)
          }).catch((e) => console.log(e))
        }
        if (watching) {
          database.ref(`/Users/${auth?.currentUser?.uid}/watching/${id}`).remove().then(() => {
            setWatching(false)
          }).catch((e) => console.log(e))
        }
      })
    } else {
      database.ref(`/Users/${auth?.currentUser?.uid}/watched/${id}`).remove().then(() => {
        setWatched(false)
      }).catch((e) => console.log(e))
    }
  }

  const handleWatching = () => {
    if (!watching) {
      database.ref(`/Users/${auth?.currentUser?.uid}/watching/${id}`).set({
        id: id, data: data, type: type, timestamp: Date.now()
      }).then(() => {
        setWatching(true)
        setMessage('Added to watching')
        setSnackBar(true)
        if (watched) {
          database.ref(`/Users/${auth?.currentUser?.uid}/watched/${id}`).remove().then(() => {
            setWatched(false)
          }).catch((e) => console.log(e))
        }
      })
    } else {
      database.ref(`/Users/${auth?.currentUser?.uid}/watching/${id}`).remove().then(() => {
        setWatching(false)
      }).catch((e) => console.log(e))
    }
  }

  const handleTracking = () => {
    if (!tracking) {
      database.ref(`/Users/${auth?.currentUser?.uid}/tracking/${id}`).set({
        id: id, data: data, type: type, timestamp: Date.now()
      }).then(() => {
        setTracking(true)
        setMessage('Tracking show')
        setSnackBar(true)
      })
    } else {
      database.ref(`/Users/${auth?.currentUser?.uid}/tracking/${id}`).remove().then(() => {
        setTracking(true)
        setMessage('Removed from tracking')
        setSnackBar(true)
      }).catch((e) => console.log(e))
    }
  }

  const handleWatching2 = () => {
    database.ref(`/Users/${auth?.currentUser?.uid}/watching/${id}`).update({
      id: id, data: data, type: type, timestamp: Date.now()
    }).then(() => {
      setWatching(true)
      if (watched) {
        database.ref(`/Users/${auth?.currentUser?.uid}/watched/${id}`).remove().then(() => {
          setWatched(false)
        })
      }
    })
  }

  const handleAddReview = () => {
    database.ref(`/Reviews/${id}/${auth?.currentUser?.uid}`).update({
      review: review, timestamp: Date.now(), uid: auth?.currentUser?.uid
    }).then(() => {
      setReview('')
      handleClose3()
    }
    ).catch((e) => console.log(e))
  }

  const removeReview = () => {
    database.ref(`/Reviews/${id}/${auth?.currentUser?.uid}`).remove()
      .then(() => { })
      .catch((e) => console.log(e))
  }

  const handleTvShowScroll = () => {
    setResumeSeries(true)
  }

  return (
    <>
      <Helmet>
        <title>SiyaCine{data?.name ? ` - ${data?.name}` : '' || data?.title ? ` - ${data?.title}` : '' || data?.original_name ? ` - ${data?.original_name}` : ''}</title>
      </Helmet>
      <Modal size='md' show={show2} onHide={handleClose2} centered>
        <Modal.Body style={{ backgroundColor: theme.palette.background.default }}>
          <div className='modal_header'>
            <h2>Suggest To</h2>
            <IconButton onClick={() => handleClose2()}><CloseIcon style={{ color: 'red' }} /></IconButton>
          </div>
          <div style={{ height: '50vh', overflowY: 'auto' }}>
            {users?.map((user, index) => {
              return (
                <ShareUser user={user} index={index} setMessage={setMessage} setSnackBar={setSnackBar} handleClose2={handleClose2} id={id} data={data} type={type} />
              )
            })}
          </div>
          <RWebShare
            data={{
              url: `https://siyacine.netlify.app/singlecontent/${id}/${type}`,
              title: `${data.name || data.title || data.original_name}`,
              text: `Siyacine: ${data.name || data.title || data.original_name}`,
            }}
          >
            <Button className='share_external_btn' fullWidth color='warning' variant="contained">Share externally</Button>
          </RWebShare>

        </Modal.Body>
      </Modal>
      <Modal show={show3} onHide={handleClose3} centered>
        <Modal.Body style={{ backgroundColor: theme.palette.background.default }}>
          <IconButton onClick={() => handleClose3()} style={{ position: 'absolute', top: 0, right: 0 }}><CloseIcon style={{ color: 'red' }} /></IconButton>
          <div style={{ margin: '10px 0px' }}>
            <TextField
              fullWidth
              id="standard-multiline-static"
              label="Add you review"
              multiline
              rows={5}
              variant="standard"
              color='warning'
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
          </div>
          <Button fullWidth color='warning' variant="contained" onClick={() => handleAddReview()}>Review</Button>
        </Modal.Body>
      </Modal>
      <Modal show={show4} onHide={handleClose4} fullscreen>
        <Modal.Body style={{ backgroundColor: theme.palette.background.default }}>
          <div className='player_header'>
            <IconButton tyle={{ backgroundColor: theme.palette.background.default }} onClick={() => handleClose4()}><ArrowBackIcon className="back_icon" /></IconButton>
            <div>{data?.name || data?.title || data?.original_name}</div>
          </div>
          {server === 1 && <iframe title={data?.name || data?.title || data?.original_name} allowFullScreen scrolling="no" style={{ width: "100%", height: window.innerHeight - 125 }} src={`https://vidsrc.cc/v3/embed/movie/${id}`}></iframe>}
          {server === 2 && <iframe title={data?.name || data?.title || data?.original_name} allowFullScreen scrolling="no" style={{ width: "100%", height: window.innerHeight - 125 }} src={`https://vidbinge.dev/embed/movie/${id}`}></iframe>}
          <div className='player_bottom'>
            <div></div>
            <Dropdown>
              <Dropdown.Toggle variant="warning" className='servers_dropdown'>
                Servers
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item style={{ backgroundColor: theme.palette.background.default }} className={server === 1 ? 'server_btn_selected' : 'server_btn'} onClick={() => setServer(1)}>VidSrc</Dropdown.Item>
                <Dropdown.Item style={{ backgroundColor: theme.palette.background.default }} className={server === 2 ? 'server_btn_selected' : 'server_btn'} onClick={() => setServer(2)}>Vid Binge</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <div></div>
          </div>
        </Modal.Body>
      </Modal >
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
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
      ><Alert onClose={() => {
        setMessage('')
        setSnackBar(false)
      }
      } severity="success" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
      {!loading ?
        <>
          <Grow in={!loading} {...({ timeout: 800 })}>
            <div className='singlecontentPage'>
              <div className='singlecontent_responsive'>
                <div className='pic_container'>
                  <img alt="" src={data.poster_path ? `https://image.tmdb.org/t/p/w500/${data.poster_path}` : "https://www.movienewz.com/img/films/poster-holder.jpg"} className='singlecontentposter' />
                  <div className='play_buttons'>
                    {premium && (data?.status === 'Released' || data?.first_air_date < getCurrentDate()) &&
                      <Button
                        startIcon={<PlayArrowIcon />}
                        className='play_button'
                        onClick={() => type === 'movie' ? handleShow4() : handleTvShowScroll()}
                        variant='contained'
                        size='large'
                      >
                        {watching ? 'Resume' : 'Play now'}
                      </Button>}
                    {watchprovider?.path && <Button
                      endIcon={<img alt="" src={`https://image.tmdb.org/t/p/w500/${watchprovider.path}`} height={'22px'} width={'22px'} style={{ borderRadius: '4px' }} />}
                      className='play_button'
                      target="__blank"
                      href={watchprovider.link}
                      variant='contained'
                      size='large'
                    >
                      Watch on
                    </Button>}
                  </div>
                </div>
                <div className='details'>
                  <div className='mobile_center'>
                    <h1>{data.name || data.title || data.original_name}</h1>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                      {(data?.release_date || data?.first_air_date)}{data?.runtime > 0 && <>&nbsp;&#183;&nbsp;{timeConvert(data?.runtime)}</>}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', margin: '15px 0px' }}>
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
                      {auth?.currentUser?.uid && <>
                        <Tooltip title={favourite ? "Remove from Favourite" : 'Add to Favourite'}>
                          <IconButton style={{ backgroundColor: theme.palette.background.default }} onClick={() => handleFavourite()}>
                            {favourite ? <FavoriteIcon color="error" /> : <FavoriteOutlined />}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={watchlist ? "Remove from Watchlist" : 'Add to Watchlist'}>
                          <IconButton style={{ backgroundColor: theme.palette.background.default, marginLeft: '10px' }} onClick={() => handleWatchlist()}>
                            {watchlist ? <DoneIcon color="warning" /> : <AddIcon />}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={watching ? "Remove from Watching" : "Add to Watching"}>
                          <IconButton style={{ backgroundColor: theme.palette.background.default, marginLeft: '10px' }} onClick={() => handleWatching()}>
                            {watching ? <PlayCircleFilledWhiteIcon color="warning" /> : <PlayCircleOutlineIcon />}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={watched ? "Remove from Watched" : 'Add to Watched'}>
                          <IconButton style={{ backgroundColor: theme.palette.background.default, marginLeft: '10px' }} onClick={() => handleWatched()}>
                            {watched ? <DoneAllIcon color="warning" /> : <DoneAllIcon />}
                          </IconButton>
                        </Tooltip>
                        {type === 'tv' && <Tooltip title={watching ? "Remove from tracking" : "Track show"}>
                          <IconButton style={{ backgroundColor: theme.palette.background.default, marginLeft: '10px' }} onClick={() => handleTracking()}>
                            {tracking ? <TimelineIcon color="warning" /> : <TimelineIcon />}
                          </IconButton>
                        </Tooltip>}
                        <Tooltip title="Share">
                          <IconButton style={{ backgroundColor: theme.palette.background.default, marginLeft: '10px' }} onClick={() => handleShow2()}>
                            <ShareOutlinedIcon />
                          </IconButton>
                        </Tooltip>
                      </>}
                    </div>
                  </div>

                  {director?.length > 0 && <div className='overview' >
                    <h4>Director</h4>
                    <div className='directors'>
                      {director?.map((cr, index) => {
                        return <div key={cr?.id}>{cr?.name}{index < director?.length - 1 && <>,&nbsp;</>}</div>
                      })}
                    </div>
                  </div>}

                  {data?.overview && <div className='overview'>
                    <h4>Overview</h4>
                    {data.overview?.length > 300 && !readMore ? data.overview.substring(0, 300).concat('...') : data.overview}
                    <span className='readmore' style={{ color: theme.palette.warning.main }} onClick={() => setReadMore(!readMore)}>{data.overview && data.overview?.length > 300 && (!readMore ? 'read more' : 'less')}</span>
                  </div>}
                </div>
              </div>
              {type === 'tv' && <Seasons setResumeSeries={setResumeSeries} resumeSeries={resumeSeries} value={data} watched={watched} watchlist={watchlist} setWatched={setWatched} setWatchlist={setWatchlist} />}
              <div className='singlecontent'>
                {video?.length !== 0 && <>
                  <div className='trending_title' >Trailers & More</div>
                  <div className='trending_scroll' >
                    <Trailers data={video} title={data?.name || data?.title || data?.original_name} />
                  </div>
                </>}
                {recommendations?.length !== 0 && <><br />
                  <div className='trending_title' >Recommendations</div>
                  <div className='trending_scroll' >
                    {recommendations?.map((data) => {
                      return <SingleContentScroll data={data} id={data.id} key={data.id} type={type} recom={true} />
                    })}
                  </div>
                </>}
                {similar?.length !== 0 && <><br />
                  <div className='trending_title' >Similar</div>
                  <div className='trending_scroll' >
                    {similar?.map((data) => {
                      return <SingleContentScroll data={data} id={data.id} key={data.id} type={type} recom={true} />
                    })}
                  </div>
                </>}
                {credit.cast && credit.cast.length !== 0 && <><br /><div className='trending_title'>Cast</div>
                  <div className='cast'>
                    {credit && credit.cast.map((c) => {
                      return <Link to={`/singlecast/${c.id}`} style={{ textDecoration: 'none' }} key={c.id}>
                        <div className='cast_single' key={c.id}>
                          <img alt="" src={c.profile_path ? `https://image.tmdb.org/t/p/w300/${c.profile_path}` : "https://upload.wikimedia.org/wikipedia/en/6/60/No_Picture.jpg"} className='cast_image' />
                          <div style={{ marginTop: '5px' }}>
                            <div className='cast_name' style={{ color: theme.palette.warning.main }}>{c.original_name}</div>
                            <div className='cast_char'>{c.character.length > 30 ? c.character.substring(0, 30).concat('...') : c.character}</div>
                          </div>
                        </div>
                      </Link>
                    })}
                  </div></>}
                <br />
                <div className='trending_title' style={{ display: 'flex', alignItems: 'center' }}>
                  <div >
                    Reviews
                  </div>
                  {auth?.currentUser?.uid && <div onClick={() => handleShow3()} className='addreview' style={{ color: theme.palette.warning.main }}>
                    <AddCircleOutlineIcon fontSize='medium' />
                  </div>}
                </div>
                <div className='reviews'>
                  {reviews2 && auth?.currentUser?.uid && reviews2.map((data) => {
                    return <div className='single_review' key={data.uid}>
                      <div style={{ display: 'flex', alignItems: 'center' }} >
                        <Link to={data.uid === auth?.currentUser?.uid ? '/profile' : `/user/${data.uid}`} style={{ textDecoration: 'none', fontSize: '18px', color: 'white' }}><div style={{}}>{getUsername(data.uid)}</div></Link>
                        {data.uid === auth?.currentUser?.uid && <div><IconButton onClick={() => removeReview()}><DeleteIcon sx={{ color: theme.palette.error.main }} /></IconButton></div>}
                      </div>
                      <Review review={data.review} />
                    </div>
                  })}
                  {reviews && reviews.map((data) => {
                    return <div className='single_review' key={data.id}>
                      <div className='review_author_username'>{data.author_details.username}</div>
                      <Review review={data.content} />
                    </div>
                  })}
                  {(reviews.length !== 0 || reviews2.length !== 0) && <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', color: theme.palette.warning.main }}>That's all</div>}
                  {reviews.length === 0 && reviews2.length === 0 && <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', color: theme.palette.warning.main }}>No Reviews</div>}
                </div>
              </div>
            </div>
          </Grow>
        </>
        :
        <div className="loading">
          <CircularProgress color='warning' />
        </div>
      }
    </>
  )
}
