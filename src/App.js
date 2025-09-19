
import React from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Trending from './Pages/Trending';
import Movies from './Pages/Movies';
import TV from './Pages/TV';
import NavBarMain from './Containers/NavBarMain';
import 'bootstrap/dist/css/bootstrap.min.css';
import SingleContentPage from './Pages/SingleContentPage';
import Search from './Pages/Search';
import Profile from './Pages/Profile';
import UserProfile from './Pages/UserProfile';
import LoadingScreen from 'react-loading-screen';
import { useEffect, useState } from 'react';
import logo from '../src/assets/logo.png'
import SingleCategory from './Pages/SingleCategory';
import SingleCastPage from './Pages/SingleCastPage';
import CssBaseline from '@mui/material/CssBaseline';
import { useTheme } from '@mui/material';
import { auth, database } from './firebase';

function App() {

  const [loading, setLoading] = useState(true)
  const theme = useTheme()
  const [top, setTop] = useState(true)
  let user = localStorage.getItem('uid')

  const logOut = () => {
    auth.signOut().then(() => {
      setLoading(false)
      localStorage.clear()
    }).catch((e) => console.log(e))
  }

  useEffect(() => {
    if (user) {
      database.ref(`/Users/${user}`).once('value', snapshot => {
        if (snapshot.val()) {
          setLoading(false)
          database.ref(`/Users/${user}`).update({
            timestamp: Date.now()
          }).catch((e) => console.log(e))
        } else {
          logOut()
        }
      }).catch((e) => {
        console.log(e)
        logOut()
      })
    }
    else {
      setLoading(false)
      logOut()
    }
  }, [user])

  useEffect(() => {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setTop(scrollTop)
    });
  }, []);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <LoadingScreen
      loading={loading}
      bgColor={'black'}
      spinnerColor={theme.palette.warning.main}
      logoSrc={logo}
    >
      <BrowserRouter>
        <div>
          <NavBarMain top={top} scrollTop={scrollTop} />
          <div className='content'>
            <CssBaseline />
            <Switch>
              <Route path="/" exact>
                <Trending scrollTop={scrollTop} />
              </Route>
              <Route path="/singlecontent/:id/:type" >
                <SingleContentPage scrollTop={scrollTop} />
              </Route>
              <Route path="/user/:uid">
                <UserProfile scrollTop={scrollTop} />
              </Route>
              <Route path="/profile">
                <Profile scrollTop={scrollTop} />
              </Route>
              <Route path="/movies">
                <Movies scrollTop={scrollTop} />
              </Route>
              <Route path="/tv">
                <TV scrollTop={scrollTop} />
              </Route>
              <Route path="/search">
                <Search scrollTop={scrollTop} />
              </Route>
              <Route path="/singlecategory/:category/:type/:name/:uid">
                <SingleCategory scrollTop={scrollTop} />
              </Route>
              <Route path="/singlecast/:id">
                <SingleCastPage scrollTop={scrollTop} />
              </Route>
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    </LoadingScreen >
  );
}

export default App;
