import React, { useEffect, useState } from 'react'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import logo from '../../assets/logo.png'
import { NavLink, useLocation } from "react-router-dom";
import { Button } from '@mui/material';
import { Modal } from 'react-bootstrap';
import Login from '../Login';
import Register from '../Register';
import { database } from '../../firebase';
import './style.css'
import SearchIcon from '@mui/icons-material/Search';
import { useTheme } from '@mui/material/styles';
import NavDropdown from 'react-bootstrap/NavDropdown';

export default function NavBarMain({ top }) {

  const uid = localStorage.getItem('uid')
  const [currentPhoto, setCurrentPhoto] = useState("")
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);
  const location = useLocation()
  const theme = useTheme()

  const [routeName, setRouteName] = useState('Home')

  useEffect(() => {
    database.ref(`/Users/${uid}`).on('value', snapshot => {
      setCurrentPhoto(snapshot.val()?.photo)
    })
  }, [uid])

  useEffect(() => {
    if (location.pathname === '/movies') {
      setRouteName('Movie')
    } else if (location.pathname === '/tv') {
      setRouteName('TV')
    } else if (location.pathname === '/people') {
      setRouteName('User')
    } else {
      setRouteName('Home')
    }
  }, [location])

  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Body style={{ backgroundColor: theme.palette.background.default }}>
          <Login />
        </Modal.Body>
      </Modal>
      <Modal show={show2} onHide={handleClose2} centered>
        <Modal.Body style={{ backgroundColor: theme.palette.background.default }}>
          <Register />
        </Modal.Body>
      </Modal>
      <Navbar className='navbar_main' variant={theme.palette.mode} fixed='top' style={{ backgroundImage: top < 50 ? 'linear-gradient(rgba(0, 0, 0, 0.7) 10%, rgba(0, 0, 0, 0))' : '', backgroundColor: top > 50 ? theme.palette.background.default : '' }}>
        <Navbar.Brand className="navlink">
          <NavLink to="/" style={{ color: 'white', textDecoration: 'none' }}>
            <div style={{ display: 'flex' }}>
              <img className='navbar_icon' src={logo} height={'30px'} width={'30px'} alt="logo" />
              <div className='navbar_brand'>
                <span style={{ marginLeft: '5px', color: theme.palette.text.primary }}>Siya<strong>Cine</strong></span>
              </div>
            </div>
          </NavLink>
        </Navbar.Brand>
        <NavDropdown title={routeName} id="basic-nav-dropdown" className='mobile'>
          <NavDropdown.Item style={{ backgroundColor: theme.palette.background.default }}><NavLink to='/' activeClassName="is-active" className="navlink" exact={true} style={{ textDecoration: 'none', color: theme.palette.text.primary, margin: '0 10px' }} activeStyle={{ opacity: 1, color: theme.palette.warning.main }}>Home</NavLink></NavDropdown.Item>
          <NavDropdown.Item style={{ backgroundColor: theme.palette.background.default }}><NavLink to='/movies' activeClassName="is-active" className="navlink" exact={true} style={{ textDecoration: 'none', color: theme.palette.text.primary, margin: '0 10px' }} activeStyle={{ opacity: 1, color: theme.palette.warning.main }}>Movies</NavLink></NavDropdown.Item>
          <NavDropdown.Item style={{ backgroundColor: theme.palette.background.default }}><NavLink to='/tv' activeClassName="is-active" className="navlink" exact={true} style={{ textDecoration: 'none', color: theme.palette.text.primary, margin: '0 10px' }} activeStyle={{ opacity: 1, color: theme.palette.warning.main }}>TV Shows</NavLink></NavDropdown.Item>
          {uid && <NavDropdown.Item style={{ backgroundColor: theme.palette.background.default }}><NavLink to='/people' activeClassName="is-active" className="navlink" exact={true} style={{ textDecoration: 'none', color: theme.palette.text.primary, margin: '0 10px' }} activeStyle={{ opacity: 1, color: theme.palette.warning.main }}>Users</NavLink></NavDropdown.Item>}
        </NavDropdown>
        <Nav><NavLink to='/' activeClassName="is-active" className="navlink pc" exact={true} style={{ textDecoration: 'none', color: theme.palette.text.primary, margin: '0 10px' }} activeStyle={{ opacity: 1, color: theme.palette.warning.main }}>Home</NavLink></Nav>
        <Nav><NavLink to='/movies' activeClassName="is-active" className="navlink pc" exact={true} style={{ textDecoration: 'none', color: theme.palette.text.primary, margin: '0 10px' }} activeStyle={{ opacity: 1, color: theme.palette.warning.main }}>Movies</NavLink></Nav>
        <Nav><NavLink to='/tv' activeClassName="is-active" className="navlink pc" exact={true} style={{ textDecoration: 'none', color: theme.palette.text.primary, margin: '0 10px' }} activeStyle={{ opacity: 1, color: theme.palette.warning.main }}>TV Shows</NavLink></Nav>
        {uid && <>
          <Nav><NavLink to='/people' activeClassName="is-active" className="navlink pc"
            exact={true} style={{ textDecoration: 'none', color: theme.palette.text.primary, margin: '0 10px' }} activeStyle={{ opacity: 1, color: theme.palette.warning.main }}>Users</NavLink></Nav></>}
        <Nav className="me-auto"></Nav>
        <Nav><NavLink to='/search' activeClassName="is-active" className="navlink" exact={true} style={{ textDecoration: 'none', color: theme.palette.text.primary, margin: '0 10px' }} activeStyle={{ opacity: 1, color: theme.palette.warning.main }}><SearchIcon /></NavLink></Nav>
        {uid ? <Nav>
          <NavLink to='/profile' activeClassName="is-active" style={{ textDecoration: 'none', color: theme.palette.warning.main }} className="navlink" activeStyle={{ opacity: 1 }}
            exact={true}><img alt="" src={currentPhoto ? currentPhoto : `https://api.dicebear.com/6.x/thumbs/png?seed=Bubba`} className={location && location.pathname === '/profile' ? 'navbar__img_active' : 'navbar__img'} /></NavLink>
        </Nav>
          :
          <Nav>
            <Button style={{ color: theme.palette.text.primary }} onClick={handleShow}>Login</Button>
            <Button style={{ color: theme.palette.text.primary }} onClick={handleShow2}>Register</Button>
          </Nav>
        }
      </Navbar>
    </>
  )
}
