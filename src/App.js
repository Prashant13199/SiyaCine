
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
import People from './Pages/People';
import LoadingScreen from 'react-loading-screen';
import { useEffect, useState } from 'react';
import logo from '../src/assets/logo.png'
import SingleCategory from './Pages/SingleCategory';
import SingleCastPage from './Pages/SingleCastPage';
import CssBaseline from '@mui/material/CssBaseline';
import { useTheme } from '@mui/material';
import AboutUs from './Pages/AboutUs';

function App() {

  const [loading, setLoading] = useState(true)
  const theme = useTheme()
  const [backdrop, setBackdrop] = useState('')
  const [top, setTop] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 800);
  }, [])

  useEffect(() => {
    document.getElementById('back')?.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      document.getElementById('back')?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleScroll = () => {
    setTop(document.getElementById('back')?.scrollTop)
  };

  const scrollTop = () => {
    document.getElementById('back')?.scrollTo(0, 0)
  }

  return (
    <LoadingScreen
      loading={loading}
      bgColor='background.default'
      spinnerColor={theme.palette.warning.main}
      logoSrc={logo}
    >
      <BrowserRouter>
        <div className="App" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original/${backdrop})` }}>
          <div className='backdrop_opacity' id="back" style={{ maxHeight: window.innerHeight, minHeight: window.innerHeight }}>
            <div className='content'>
              <NavBarMain top={top} />
              <CssBaseline />
              <Switch>
                <Route path="/" exact>
                  <Trending setBackdrop={setBackdrop} scrollTop={scrollTop} />
                </Route>
                <Route path="/singlecontent/:id/:type" >
                  <SingleContentPage setBackdrop={setBackdrop} scrollTop={scrollTop} />
                </Route>
                <Route path="/user/:uid">
                  <UserProfile setBackdrop={setBackdrop} scrollTop={scrollTop} />
                </Route>
                <Route path="/profile">
                  <Profile setBackdrop={setBackdrop} scrollTop={scrollTop} />
                </Route>
                <Route path="/movies">
                  <Movies scrollTop={scrollTop} />
                </Route>
                <Route path="/tv">
                  <TV scrollTop={scrollTop} />
                </Route>
                <Route path="/search" >
                  <Search scrollTop={scrollTop} />
                </Route>
                <Route path="/people" component={People} />
                <Route path="/singlecategory/:category/:type/:name/:uid">
                  <SingleCategory scrollTop={scrollTop} />
                </Route>
                <Route path="/singlecast/:id">
                  <SingleCastPage scrollTop={scrollTop} setBackdrop={setBackdrop} />
                </Route>
                <Route path="/aboutus">
                  <AboutUs />
                </Route>
              </Switch>
            </div>
          </div>
        </div>
      </BrowserRouter>
    </LoadingScreen >
  );
}

export default App;
