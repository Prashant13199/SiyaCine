
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

function App() {

  const [loading, setLoading] = useState(true)
  const theme = useTheme()
  const [backdrop, setBackdrop] = useState('')
  const [top, setTop] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 1500);
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
          <div className='backdrop_opacity' id="back">
            <div className='content'>
              <NavBarMain top={top} />
              <CssBaseline />
              <Switch>
                <Route path="/" exact>
                  <Trending setBackdrop={setBackdrop} />
                </Route>
                <Route path="/singlecontent/:id/:type" >
                  <SingleContentPage setBackdrop={setBackdrop} scrollTop={scrollTop} />
                </Route>
                <Route path="/user/:uid">
                  <UserProfile setBackdrop={setBackdrop} />
                </Route>
                <Route path="/profile">
                  <Profile setBackdrop={setBackdrop} />
                </Route>
                <Route path="/movies" component={Movies} />
                <Route path="/tv" component={TV} />
                <Route path="/search" component={Search} />
                <Route path="/people" component={People} />
                <Route path="/singlecategory/:category/:type/:name">
                  <SingleCategory scrollTop={scrollTop} />
                </Route>
                <Route path="/singlecast/:id" component={SingleCastPage} />
              </Switch>
            </div>
          </div>
        </div>
      </BrowserRouter>
    </LoadingScreen >
  );
}

export default App;
