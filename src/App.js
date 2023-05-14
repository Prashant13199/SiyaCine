
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
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';

function App() {

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 500);
  }, [])

  return (
    <LoadingScreen
      loading={loading}
      bgColor='background.default'
      spinnerColor='#9ee5f8'
      textColor='#676767'
      logoSrc={logo}
    >
      <BrowserRouter>
        <div className="App">
          <Box sx={{ bgcolor: 'background.default', color: 'text.primary', minHeight: '100vh' }}>
            <Box sx={{ flexGrow: 1, marginY: 7, marginX: 0.2 }}>
              <NavBarMain />
              <CssBaseline />
              <Switch>
                <Route path="/" component={Trending} exact />
                <Route path="/movies" component={Movies} />
                <Route path="/tv" component={TV} />
                <Route path="/singlecontent/:id/:type" component={SingleContentPage} />
                <Route path="/search" component={Search} />
                <Route path="/profile" component={Profile} />
                <Route path="/people" component={People} />
                <Route path="/user/:uid" component={UserProfile} />
                <Route path="/singlecategory/:category/:type/:name" component={SingleCategory} />
                <Route path="/singlecast/:id" component={SingleCastPage} />
              </Switch>
            </Box>
          </Box>
        </div>
      </BrowserRouter>
    </LoadingScreen>
  );
}

export default App;
