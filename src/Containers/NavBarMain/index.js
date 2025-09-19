import React, { useEffect, useState } from 'react'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import logo from '../../assets/logo.png'
import { NavLink, useLocation } from "react-router-dom";
import { Badge, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Modal } from 'react-bootstrap';
import Login from '../Login';
import { auth, database } from '../../firebase';
import './style.css'
import SearchIcon from '@mui/icons-material/Search';
import { useTheme } from '@mui/material/styles';
import NavDropdown from 'react-bootstrap/NavDropdown';
import useFetchUserDetails from '../../hooks/useFetchUserDetails';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Notification from '../../Components/Notification/Notification';
import { Link } from 'react-router-dom/cjs/react-router-dom';

export default function NavBarMain({ top, scrollTop }) {

  const [routeName, setRouteName] = useState('Home')
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);

  const location = useLocation()
  const theme = useTheme()
  const [notifications, setNotifications] = useState([])
  const currentPhoto = useFetchUserDetails(auth?.currentUser?.uid, 'photo')

  useEffect(() => {
    database.ref(`/Users/${auth?.currentUser?.uid}/notifications`).orderByChild('timestamp').on('value', snapshot => {
      let arr = []
      snapshot?.forEach((snap) => {
        arr.push(snap.val())
      })
      setNotifications(arr.reverse())
    })
  }, [auth?.currentUser?.uid])

  useEffect(() => {
    if (notifications?.length === 0) {
      handleClose2()
    }
  }, [notifications])

  useEffect(() => {
    if (location.pathname === '/profile') {
      setRouteName('Me')
    } else if (location.pathname?.includes('/user')) {
      setRouteName('User')
    } else if (location.pathname?.includes('/singlecontent') && location.pathname?.includes('/tv')) {
      setRouteName('TV')
    } else if (location.pathname?.includes('/singlecontent') && location.pathname?.includes('/movie')) {
      setRouteName('Movie')
    } else if (location.pathname?.includes('/singlecast')) {
      setRouteName('Cast')
    } else if (location.pathname?.includes('/Upcoming')) {
      setRouteName('Upcoming')
    } else if (location.pathname?.includes('/now_playing')) {
      setRouteName('Now Playing')
    } else if (location.pathname?.includes('/trending/movie')) {
      setRouteName('Trending Movies')
    } else if (location.pathname?.includes('/trending/tv')) {
      setRouteName('Trending TV')
    } else if (location.pathname?.includes('/top_rated/movie')) {
      setRouteName('Top Rated Movies')
    } else if (location.pathname?.includes('/top_rated/tv')) {
      setRouteName('Top Rated TV')
    } else if (location.pathname?.includes('/popular/movie')) {
      setRouteName('Popular Movies')
    } else if (location.pathname?.includes('/popular/tv')) {
      setRouteName('Popular TV')
    } else if (location.pathname?.includes('/watchlist')) {
      setRouteName('Watchlist')
    } else if (location.pathname?.includes('/watched')) {
      setRouteName('Watched')
    } else if (location.pathname?.includes('/favourites')) {
      setRouteName('Favourites')
    } else if (location.pathname?.includes('/discover/movie')) {
      setRouteName('Indian Movies')
    } else if (location.pathname?.includes('/discover/tv')) {
      setRouteName('Indian TV')
    } else if (location.pathname?.includes('/airing_today')) {
      setRouteName('Airing Today')
    } else {
      setRouteName('')
    }
  }, [location])

  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Body style={{ backgroundColor: theme.palette.background.default }}>
          <Login handleClose={handleClose} />
        </Modal.Body>
      </Modal>
      <Modal show={show2} onHide={handleClose2} centered>
        <Modal.Body style={{ backgroundColor: theme.palette.background.default }}>
          <div className='modal_header'>
            <h2>Notifications</h2>
            <IconButton onClick={() => handleClose2()}><CloseIcon style={{ color: 'red' }} /></IconButton>
          </div>
          {notifications?.map((noti) => {
            return <Notification noti={noti} handleClose={handleClose2} />
          })}
        </Modal.Body>
      </Modal>
      <Navbar className={top < 50 ? 'navbar_main' : 'navbar_main navbar_main_back'} variant={theme.palette.mode} fixed='top'>
        <Navbar.Brand className="navlink">
          <NavLink to={top < 50 && "/"} style={{ color: 'white', textDecoration: 'none' }} onClick={scrollTop}>
            <img className='navbar_icon' style={{ backdropFilter: 'unset' }} src={logo} alt="logo" />
          </NavLink>
        </Navbar.Brand>
        <Nav className="me-auto"></Nav>
        {auth?.currentUser?.uid ?
          <>
            {notifications?.length !== 0 && <Nav>
              <NavLink onClick={() => {
                if (notifications?.length) {
                  handleShow2()
                }
              }} to='#' activeClassName="is-active" className="navlink" exact={true} style={{ textDecoration: 'none', color: theme.palette.text.primary, margin: '0 10px' }} activeStyle={{ opacity: 1, color: show2 ? theme.palette.warning.main : theme.palette.text.primary }}>
                <Badge badgeContent={notifications?.length} color="warning">
                  <NotificationsIcon />
                </Badge>
              </NavLink>
            </Nav>}
            <Nav>
              <NavLink to='/profile' activeClassName="is-active" style={{ textDecoration: 'none', color: theme.palette.warning.main }} className="navlink" activeStyle={{ opacity: 1 }}
                exact={true}><img alt="" src={currentPhoto ? currentPhoto : `https://api.dicebear.com/8.x/fun-emoji/svg?seed=loading?size=96`} className={location && location.pathname === '/profile' ? 'navbar__img_active' : 'navbar__img'} /></NavLink>
            </Nav>
          </>
          :
          <Nav>
            <Button variant='contained' size='small' color="warning" style={{ marginLeft: '5px' }} onClick={handleShow}>Login</Button>
          </Nav>
        }
      </Navbar>
      <div className='floating_navbar'>
        <div className='navbar_back'>
          <NavLink to='/search' activeClassName="is-active" className="navlink" exact={true} style={{ textDecoration: 'none', color: theme.palette.text.primary, padding: '8px 12px' }} activeStyle={{ opacity: 1, backgroundColor: theme.palette.warning.main, color: 'black', padding: '8px 12px', borderRadius: '20px' }}><SearchIcon /></NavLink>
          <NavLink to='/' activeClassName="is-active" className="navlink" exact={true} style={{ textDecoration: 'none', color: theme.palette.text.primary, padding: '8px 12px' }} activeStyle={{ opacity: 1, backgroundColor: theme.palette.warning.main, color: 'black', padding: '8px 12px', borderRadius: '20px' }}>Home</NavLink>
          <NavLink to='/movies' activeClassName="is-active" className="navlink" exact={true} style={{ textDecoration: 'none', color: theme.palette.text.primary, padding: '8px 12px' }} activeStyle={{ opacity: 1, backgroundColor: theme.palette.warning.main, color: 'black', padding: '8px 12px', borderRadius: '20px' }}>Movies</NavLink>
          <NavLink to='/tv' activeClassName="is-active" className="navlink" exact={true} style={{ textDecoration: 'none', color: theme.palette.text.primary, padding: '8px 12px' }} activeStyle={{ opacity: 1, backgroundColor: theme.palette.warning.main, color: 'black', padding: '8px 12px', borderRadius: '20px' }}>TV Shows</NavLink>
        </div>
      </div>
    </>
  )
}
