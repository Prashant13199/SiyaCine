import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import logo from '../../assets/logo.png'
import { NavLink } from "react-router-dom";
import TvIcon from '@mui/icons-material/Tv';
import MovieIcon from '@mui/icons-material/Movie';
import PeopleIcon from '@mui/icons-material/People';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import { Button } from '@mui/material';
import { Modal } from 'react-bootstrap';
import Login from '../Login';
import Register from '../Register';
import { auth, database } from '../../firebase';

export default function NavBarMain() {

  const uid = localStorage.getItem('uid')
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);

  const [currentusername, setCurrentUsername] = useState("")
  const [currentPhoto, setCurrentPhoto] = useState("")

  useEffect(() => {
    database.ref(`/Users/${uid}`).on('value', snapshot => {
      setCurrentUsername(snapshot.val()?.username)
      setCurrentPhoto(snapshot.val()?.photo)
    })
  },[])

  return (
    <>
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Body>
        <Login />
      </Modal.Body>
    </Modal>
    <Modal show={show2} onHide={handleClose2} centered>
      <Modal.Body>
        <Register />
      </Modal.Body>
    </Modal>
      <Navbar bg="light" variant="light" fixed='top'>
        <Container>
          <Navbar.Brand href="/">
            <div style={{ display: 'flex' }}>
              <img src={logo} height={'35px'} width={'35px'} />
              <div style={{ fontSize: '25px' }}>
                <span style={{ fontSize: '18px' }}>SIYA</span><strong>CINE</strong>
              </div>
            </div>
          </Navbar.Brand>
          <Nav className="me-auto"></Nav>
         { uid ? <Nav><NavLink to='/profile' activeClassName="is-active" style={{ textDecoration: 'none', color: '#3385ff' }}
            exact={true}>{currentusername} <img src={currentPhoto} height={"30px"} width={"30px"} style={{objectFit: 'cover', borderRadius: '4px'}} /></NavLink></Nav>
            :
            <>
            <Nav><Button onClick={handleShow}>Login</Button></Nav>
            <Nav><Button onClick={handleShow2}>Register</Button></Nav>
            </>
            }
        </Container>
      </Navbar>
      <Navbar bg="light" variant="light" fixed='bottom'>
        <Container>
          <Nav><NavLink to='/' activeClassName="is-active"
            exact={true} style={{ textDecoration: 'none', color: '#3385ff' }} activeStyle={{ color: '#090979' }}><WhatshotIcon /> HOME</NavLink></Nav>
          <Nav className="me-auto"></Nav>
          <Nav><NavLink to='/movies' activeClassName="is-active"
            exact={true} style={{ textDecoration: 'none', color: '#3385ff' }} activeStyle={{ color: '#090979' }}><MovieIcon /> MOVIES</NavLink></Nav>
          <Nav className="me-auto"></Nav>
          <Nav><NavLink to='/tv' activeClassName="is-active"
            exact={true} style={{ textDecoration: 'none', color: '#3385ff' }} activeStyle={{ color: '#090979' }}><TvIcon /> TV</NavLink></Nav>
          {uid && <><Nav className="me-auto"></Nav>
          <Nav><NavLink to='/people' activeClassName="is-active"
            exact={true} style={{ textDecoration: 'none', color: '#3385ff' }} activeStyle={{ color: '#090979' }}><PeopleIcon /> PEOPLE</NavLink></Nav></>}
        </Container>
      </Navbar>
    </>
  )
}
