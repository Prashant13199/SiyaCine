import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './style.css'
import axios from "axios";
import SingleContentScroll from '../../Components/SingleContentScroll';
import Button from '@mui/material/Button';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { IconButton, TextField } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddIcon from '@mui/icons-material/Add';
import DoneIcon from '@mui/icons-material/Done';
import { database, auth } from '../../firebase'
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
import AOS from 'aos';
import 'aos/dist/aos.css';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';

export default function SingleContentPage() {

  const { id, type } = useParams()
  const [data, setData] = useState([])
  const [watchprovider, setWatchProvider] = useState({})
  const [credit, setCredit] = useState([])
  const [similar, setSimilar] = useState([])
  const [video, setVideo] = useState();
  const [currentusername, setCurrentusername] = useState('')
  const [favourite, setFavourite] = useState(false)
  const [watchlist, setWatchlist] = useState(false)
  const [watching, setWatching] = useState(false)
  const [recommendations, setRecommendations] = useState([])
  const [reviews, setReviews] = useState([])
  const [reviews2, setReviews2] = useState([])
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);
  const [show3, setShow3] = useState(false);
  const handleClose3 = () => setShow3(false);
  const handleShow3 = () => setShow3(true);
  const [readMore, setReadMore] = useState(false)
  const [checked, setChecked] = React.useState(false);
  const [users, setUsers] = useState([])
  const theme = useTheme()
  const [snackBar, setSnackBar] = useState(false)
  const [name, setName] = useState('')
  const [review, setReview] = useState('')
  const currentuid = localStorage.getItem('uid')

  const getUsername = (id) => {
    let name = ""
    database.ref(`/Users/${id}`).on('value', snapshot => {
      name = snapshot.val()?.username
    })
    return name;
  }

  useEffect(() => {
    AOS.init({ duration: 800 })
  }, [])

  useEffect(() => {

    database.ref(`/Users/${currentuid}`).on('value', snapshot => {
      setCurrentusername(snapshot.val()?.username)
    })

    database.ref(`/Users/${currentuid}/favourites/${id}`).on('value', snapshot => {
      if (snapshot.val()?.id === id) {
        setFavourite(true)
      } else {
        setFavourite(false)
      }
    })

    database.ref(`/Users/${currentuid}/watchlist/${id}`).on('value', snapshot => {
      if (snapshot.val()?.id === id) {
        setWatchlist(true)
      } else {
        setWatchlist(false)
      }
    })

    database.ref(`/Users/${currentuid}/watching/${id}`).on('value', snapshot => {
      if (snapshot.val()?.id === id) {
        setWatching(true)
      } else {
        setWatching(false)
      }
    })

    database.ref(`/Users`).on('value', snapshot => {
      let user = []
      snapshot.forEach((snap) => {
        if (snap.key !== currentuid) {
          user.push(snap.val())
        }
      })
      setUsers(user)
    })

    database.ref(`/Reviews/${id}`).orderByChild('timestamp').on('value', snapshot => {
      let data = []
      snapshot.forEach((snap) => {
        data.push(snap.val())
      })
      setReviews2(data.reverse())
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
    if (data.results?.IN?.flatrate) {
      setWatchProvider({ path: data.results?.IN?.flatrate[0] ? data.results?.IN?.flatrate[0]?.logo_path : '', link: data.results?.IN ? data.results?.IN?.link : '' });
    }
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
      database.ref(`/Users/${currentuid}/favourites/${id}`).set({
        id: id, data: data, type: type,
      }).then(() => {
        console.log("Set to favourite")
        setFavourite(true)
      })
    } else {
      database.ref(`/Users/${currentuid}/favourites/${id}`).remove().then(() => {
        console.log("Removed from favourite")
        setFavourite(false)
      })
    }
  }

  const handleWatchlist = () => {
    if (!watchlist) {
      database.ref(`/Users/${currentuid}/watchlist/${id}`).set({
        id: id, data: data, type: type
      }).then(() => {
        console.log("Set to watchlist")
        setWatchlist(true)
      })
    } else {
      database.ref(`/Users/${currentuid}/watchlist/${id}`).remove().then(() => {
        console.log("Removed from watchlist")
        setWatchlist(false)
      })
    }
  }

  const handleWatching = () => {
    if (!watching) {
      database.ref(`/Users/${currentuid}/watching/${id}`).set({
        id: id, data: data, type: type,
      }).then(() => {
        console.log("Set to watching")
        setWatching(true)
      })
    } else {
      database.ref(`/Users/${currentuid}/watching/${id}`).remove().then(() => {
        console.log("Removed from watching")
        setWatching(false)
      })
    }
  }

  const handleSend = (user) => {
    database.ref(`/Users/${user}/suggestions/${id}`).update({
      type: type, data: data, id: id, by: currentusername, byuid: currentuid
    }).then(() => {
      handleClose2()
      setSnackBar(true)
    }).catch((e) => { console.log(e) })
  }

  const handleAddReview = () => {
    database.ref(`/Reviews/${id}/${currentuid}`).update({
      review: review, timestamp: Date.now(), uid: currentuid
    }).then(() => {
      console.log("Review added")
      setReview('')
      handleClose3()
    }
    ).catch((e) => console.log(e))
  }

  const removeReview = () => {
    database.ref(`/Reviews/${id}/${currentuid}`).remove()
      .then(() => console.log('Review Removed'))
      .catch((e) => console.log(e))
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
            {currentuid && <div style={{ marginRight: '20px' }}>
              <Tooltip title="Favourite">
                <IconButton style={{ backgroundColor: theme.palette.warning.main }} onClick={() => handleFavourite()}>
                  {favourite ? <FavoriteIcon style={{ color: 'red' }} /> : <FavoriteIcon style={{ color: 'white' }} />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Watchlist">
                <IconButton style={{ backgroundColor: theme.palette.warning.main, marginLeft: '10px' }} onClick={() => handleWatchlist()}>
                  {watchlist ? <DoneIcon style={{ color: 'white' }} /> : <AddIcon style={{ color: 'white' }} />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Watching">
                <IconButton style={{ backgroundColor: theme.palette.warning.main, marginLeft: '10px' }} onClick={() => handleWatching()}>
                  {watching ? <PlayCircleOutlineIcon color="primary" /> : <PlayCircleOutlineIcon style={{ color: 'white' }} />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Share">
                <IconButton style={{ backgroundColor: theme.palette.warning.main, marginLeft: '10px' }} onClick={() => handleShow2()}>
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
        <Modal.Body style={{ backgroundColor: theme.palette.background.default }}>
          <IconButton onClick={() => handleClose2()} style={{ position: 'absolute', top: 0, right: 0 }}><CloseIcon style={{ color: 'red' }} /></IconButton>
          <h2>Share To</h2>
          <div style={{ maxHeight: '50vh', overflowY: 'auto' }}>
            {users && users.map((user) => {
              return <div className='share_user' onClick={() => {
                handleSend(user.uid)
                setName(user.username)
              }
              }>
                <div>
                  <img src={user.photo} className="share_user_image" />
                </div>
                <div className='share_user_username'>
                  {user.username.length > 25 ? user.username.substring(0, 25).concat('...') : user.username}
                </div>
              </div>
            })}
          </div>
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
              rows={10}
              variant="standard"
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
          </div>
          <Button fullWidth variant="contained" onClick={() => handleAddReview()}>Review</Button>
        </Modal.Body>
      </Modal>

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
        handleClose()
        setName('')
      }
      } severity="success" sx={{ width: '100%' }}>
          Suggested to {name && name.length > 12 ? name.substring(0, 12).concat('...') : name}!
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
        {credit.cast && credit.cast.length !== 0 && <><div className='trending_title' data-aos="fade-right">Cast</div>
          <div className='cast' data-aos="fade-left">
            {credit && credit.cast.map((c) => {
              return <Link to={`/singlecast/${c.id}`} style={{ textDecoration: 'none' }} key={c.id}>
                <div className='cast_single' key={c.id}>
                  <img alt="" src={c.profile_path ? `https://image.tmdb.org/t/p/w300/${c.profile_path}` : "https://upload.wikimedia.org/wikipedia/en/6/60/No_Picture.jpg"} className='cast_image' />
                  <div style={{ marginTop: '5px' }}>
                    <div style={{ fontWeight: '500', maxWidth: '150px', color: theme.palette.warning.main }}>{c.original_name}</div>
                    <div style={{ color: "gray", maxWidth: '150px', fontSize: '14px' }}>{c.character.length > 30 ? c.character.substring(0, 30).concat('...') : c.character}</div>
                  </div>
                </div>
              </Link>
            })}
          </div></>}
        {similar.length !== 0 && <><br />
          <div className='trending_title' data-aos="fade-right">Similar</div>
          <div className='trending_scroll' data-aos="fade-left">
            {similar && similar.map((data) => {
              return <SingleContentScroll data={data} key={data.id} type={type} />
            })}
          </div>
        </>}
        {recommendations.length !== 0 && <><br />
          <div className='trending_title' data-aos="fade-right">Recommendations</div>
          <div className='trending_scroll' data-aos="fade-left">
            {recommendations && recommendations.map((data) => {
              return <SingleContentScroll data={data} key={data.id} type={type} />
            })}
          </div>
        </>}
        <br />
        <div className='trending_title' style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div data-aos="fade-right">
            Reviews
          </div>
          {currentuid && <div onClick={() => handleShow3()} className='addreview' data-aos="fade-left" style={{ color: theme.palette.warning.main }}>
            <AddCircleOutlineIcon fontSize='small' />&nbsp;Add Review
          </div>}
        </div>
        <div className='reviews'>
          {reviews2 && currentuid && reviews2.map((data) => {
            return <div className='single_review' key={data.uid}>
              <div style={{ display: 'flex', alignItems: 'center' }} data-aos="fade-right">
                <Link to={data.uid === currentuid ? '/profile' : `/user/${data.uid}`} style={{ textDecoration: 'none', color: 'black', fontWeight: '600', fontSize: '18px' }}><div style={{}}>{getUsername(data.uid)}</div></Link>
                {data.uid === currentuid && <div><IconButton onClick={() => removeReview()}><DeleteIcon /></IconButton></div>}
              </div>
              <div data-aos="fade-left">
                <Review review={data.review} />
              </div>
            </div>
          })}
          {reviews && reviews.map((data) => {
            return <div className='single_review' key={data.id}>
              <div style={{ fontWeight: '600', fontSize: '18px' }} data-aos="fade-right">{data.author_details.username}</div>
              <div data-aos="fade-left">
                <Review review={data.content} />
              </div>
            </div>
          })}
          {(reviews.length !== 0 || reviews2.length !== 0) && <div data-aos="zoom-out-up" style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', color: theme.palette.warning.main }}>That's all</div>}
          {reviews.length === 0 && reviews2.length === 0 && <div data-aos="zoom-out-up" style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', color: theme.palette.warning.main }}>No Reviews</div>}
        </div>
      </div>
    </>
  )
}
