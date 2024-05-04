import React, { useEffect, useState } from 'react';
import './style.css';
import axios from "axios";
import { Link } from 'react-router-dom';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InfoIcon from '@mui/icons-material/Info';
import { Modal } from 'react-bootstrap';
import ReactPlayer from 'react-player'
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material';
import { IconButton, Button } from '@mui/material';

export default function Header({ setBackdrop }) {

  const theme = useTheme()

  const [upcoming, setUpcoming] = useState([])
  const [number, setNumber] = useState(null)
  const [background, setBackground] = useState(null)
  const [video, setVideo] = useState();

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    setBackdrop(window.innerWidth > 900 ? upcoming[number]?.backdrop_path : upcoming[number]?.poster_path)
    setBackground(window.innerWidth > 900 ? upcoming[number]?.backdrop_path : upcoming[number]?.poster_path)
  }, [upcoming, number, window.innerWidth])

  const fetchUpcoming = async () => {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.REACT_APP_API_KEY}`
      );
      setUpcoming(data.results);
    }
    catch (e) {
      console.log(e)
    }
  };

  useEffect(() => {
    fetchUpcoming();
  }, [])

  useEffect(() => {
    if (upcoming[number]?.id)
      fetchVideo()
  }, [upcoming[number]?.id])

  useEffect(() => {
    setNumber(Math.floor(Math.random() * upcoming.length))
  }, [upcoming])

  const fetchVideo = async () => {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/movie/${upcoming[number]?.id}/videos?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
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
          <IconButton onClick={() => handleClose()} className='close_icon_button'><CloseIcon className="close_icon" /></IconButton>
          <div className="padding40">
            <ReactPlayer url={`https://www.youtube.com/watch?v=${video}`} width={'100%'} height={'100%'} controls />
          </div>
        </Modal.Body>
      </Modal>

      <div className='welcome' style={{ backgroundImage: upcoming?.length !== 0 && number ? `url(https://image.tmdb.org/t/p/original/${background})` : 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(231,145,10,1) 0%, rgba(255,0,187,1) 100%)' }}>
        <div className='welcome_backdrop'>
          <div style={{ width: '100%' }}>
            <div className='welcomeText'>{upcoming[number]?.title}</div>
            <div className='welcomeDesc'>{upcoming[number]?.overview.substring(0, 80).concat('...')}</div>
            <div className='header_buttons'>
              {video && <Button
                startIcon={<YouTubeIcon style={{ color: 'red', fontSize: '30px' }} />}
                className='button'
                target="__blank"
                onClick={() => handleShow()}
                variant='contained'
                style={{ backgroundColor: theme.palette.background.default, color: theme.palette.text.primary, marginRight: '10px' }}
              >
                Play Trailer
              </Button>}
              <Link to={`/singlecontent/${upcoming[number]?.id}/movie`} style={{ textDecoration: 'none' }}>
                <Button
                  startIcon={<InfoIcon style={{ color: 'gray', fontSize: '30px' }} />}
                  className='button'
                  variant='contained'
                  style={{ backgroundColor: theme.palette.background.default, color: theme.palette.text.primary }}
                >
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
