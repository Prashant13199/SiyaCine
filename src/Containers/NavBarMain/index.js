import React, { useEffect, useState } from 'react'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import logo from '../../assets/logo.png'
import { NavLink, useLocation } from "react-router-dom";
import TvIcon from '@mui/icons-material/Tv';
import MovieIcon from '@mui/icons-material/Movie';
import PeopleIcon from '@mui/icons-material/People';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import { Button } from '@mui/material';
import { Modal } from 'react-bootstrap';
import Login from '../Login';
import Register from '../Register';
import { database } from '../../firebase';
import './style.css'
import SearchIcon from '@mui/icons-material/Search';

export default function NavBarMain() {

  const uid = localStorage.getItem('uid')
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);
  const location = useLocation()

  const [currentPhoto, setCurrentPhoto] = useState("")

  useEffect(() => {
    database.ref(`/Users/${uid}`).on('value', snapshot => {
      setCurrentPhoto(snapshot.val()?.photo)
    })
  }, [uid])

  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Body className='modal_body'>
          <Login />
        </Modal.Body>
      </Modal>
      <Modal show={show2} onHide={handleClose2} centered>
        <Modal.Body className='modal_body'>
          <Register />
        </Modal.Body>
      </Modal>
      <Navbar bg="dark" variant="dark" fixed='top' style={{ height: '50px', padding: '0px 20px' }}>
        <Navbar.Brand>
          <NavLink to="/" style={{ color: 'white', textDecoration: 'none' }}>
            <div style={{ display: 'flex' }}>
              <img src={logo} height={'35px'} width={'35px'} alt="logo" />
              <div style={{ fontSize: '25px' }}>
                <span style={{ fontSize: '18px' }}>SIYA</span><strong>CINE</strong>
              </div>
            </div>
          </NavLink>
        </Navbar.Brand>
        <Nav className="me-auto"></Nav>
        {uid ? <Nav><NavLink to='/search' activeClassName="is-active"
          exact={true} style={{ textDecoration: 'none', color: 'white' }} activeStyle={{ color: '#3385ff' }}><SearchIcon /></NavLink><NavLink to='/profile' activeClassName="is-active" style={{ textDecoration: 'none', color: 'white' }} activeStyle={{ color: '#3385ff' }}
            exact={true}><img alt="" src={currentPhoto ? currentPhoto : `https://api.dicebear.com/6.x/thumbs/png?seed=Bubba`} className={location && location.pathname === '/profile' ? 'navbar__img_active' : 'navbar__img'} /></NavLink>
        </Nav>
          :
          <>
            <Nav><Button onClick={handleShow}>Login</Button></Nav>
            <Nav><Button onClick={handleShow2}>Register</Button></Nav>
          </>
        }
      </Navbar>
      <Navbar bg="dark" variant="dark" fixed='bottom' style={{ height: '50px', padding: '0px 20px' }}>
        <Nav><NavLink to='/' activeClassName="is-active"
          exact={true} style={{ textDecoration: 'none', color: 'white' }} activeStyle={{ color: '#3385ff' }}><WhatshotIcon /> HOT</NavLink></Nav>
        <Nav className="me-auto"></Nav>
        <Nav><NavLink to='/movies' activeClassName="is-active"
          exact={true} style={{ textDecoration: 'none', color: 'white' }} activeStyle={{ color: '#3385ff' }}><MovieIcon /> MOVIE</NavLink></Nav>
        <Nav className="me-auto"></Nav>
        <Nav><NavLink to='/tv' activeClassName="is-active"
          exact={true} style={{ textDecoration: 'none', color: 'white' }} activeStyle={{ color: '#3385ff' }}><TvIcon /> TV</NavLink></Nav>
        {uid && <><Nav className="me-auto"></Nav>
          <Nav><NavLink to='/people' activeClassName="is-active"
            exact={true} style={{ textDecoration: 'none', color: 'white' }} activeStyle={{ color: '#3385ff' }}><PeopleIcon /> PEOPLE</NavLink></Nav></>}
      </Navbar>
    </>
  )
}
