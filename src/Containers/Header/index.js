import React, { useEffect, useState } from 'react';
import './style.css';
import axios from "axios";
import { Link } from 'react-router-dom';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InfoIcon from '@mui/icons-material/Info';
import { Modal } from 'react-bootstrap';
import ReactPlayer from 'react-player'
import { useTheme } from '@mui/material';
import { IconButton, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function Header() {

  const theme = useTheme()

  const [nowPlaying, setNowPlaying] = useState([])
  const [number, setNumber] = useState(null)
  const [background, setBackground] = useState(null)
  const [video, setVideo] = useState();

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    setBackground(window.innerWidth > 900 ? nowPlaying[number]?.backdrop_path : nowPlaying[number]?.poster_path)
  }, [nowPlaying, number, window.innerWidth])

  const fetchnowPlaying = async () => {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.REACT_APP_API_KEY}`
      );
      setNowPlaying(data.results);
    }
    catch (e) {
      console.log(e)
    }
  };

  useEffect(() => {
    fetchnowPlaying();
  }, [])

  useEffect(() => {
    if (nowPlaying[number]?.id)
      fetchVideo()
  }, [nowPlaying[number]?.id])

  useEffect(() => {
    setNumber(Math.floor(Math.random() * nowPlaying.length))
  }, [nowPlaying])

  const fetchVideo = async () => {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/movie/${nowPlaying[number]?.id}/videos?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
      );
      const values = data.results.filter((value) => value.type === 'Trailer')
      setVideo(values[0]?.key);
    }
    catch (e) {
      console.log(e)
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} fullscreen>
        <Modal.Body style={{ backgroundColor: theme.palette.background.default }}>
          <div className='player_header'>
            <IconButton onClick={() => handleClose()}><ArrowBackIcon className="back_icon" /></IconButton>
            <div>{nowPlaying[number]?.title} Trailer</div>
          </div>
          <ReactPlayer url={`https://www.youtube.com/watch?v=${video}`} width={'100%'} height={window.innerHeight - 100} controls />
        </Modal.Body>
      </Modal>

      <div className='welcome' style={{ backgroundImage: nowPlaying?.length !== 0 ? `url(https://image.tmdb.org/t/p/original/${background})` : 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(231,145,10,1) 0%, rgba(255,0,187,1) 100%)' }}>
        <div className='welcome_backdrop'>
          <div style={{ width: '100%' }}>
            <div className='welcomeText'>{nowPlaying[number]?.title}</div>
            {nowPlaying[number]?.overview && <div className='welcomeDesc'>{nowPlaying[number]?.overview.substring(0, 100).concat('...')}</div>}
            <div className='header_buttons'>
              {video && <Button
                startIcon={<YouTubeIcon style={{ color: 'red', fontSize: '25px' }} />}
                className='button'
                target="__blank"
                onClick={() => handleShow()}
                variant='contained'
                size='large'
                style={{ backgroundColor: theme.palette.background.default, color: theme.palette.text.primary, marginRight: '10px' }}
              >
                Watch Trailer
              </Button>}
              <Link to={`/singlecontent/${nowPlaying[number]?.id}/movie`} style={{ textDecoration: 'none' }}>
                <Button
                  startIcon={<InfoIcon style={{ color: 'gray', fontSize: '25px' }} />}
                  className='button'
                  variant='contained'
                  size='large'
                  style={{ backgroundColor: theme.palette.background.default, color: theme.palette.text.primary }}
                >
                  More Info
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
