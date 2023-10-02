
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
import { useTheme } from '@mui/material';

function App() {

  const [loading, setLoading] = useState(true)
  const theme = useTheme()

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 500);
  }, [])

  return (
    <LoadingScreen
      loading={loading}
      bgColor='background.default'
      spinnerColor={theme.palette.warning.main}
      logoSrc={logo}
    >
      <BrowserRouter>
        <div className="App">
          <Box sx={{ bgcolor: 'background.default', color: 'text.warning' }}>
            <NavBarMain />
            <CssBaseline />
            <Switch>
              <Route path="/" component={Trending} exact />
              <Route path="/singlecontent/:id/:type" component={SingleContentPage} />
              <Route path="/profile" component={Profile} />
              <Route path="/user/:uid" component={UserProfile} />
              <Box sx={{ paddingTop: 7 }}>
                <Route path="/movies" component={Movies} />
                <Route path="/tv" component={TV} />
                <Route path="/search" component={Search} />
                <Route path="/people" component={People} />
                <Route path="/singlecategory/:category/:type/:name" component={SingleCategory} />
                <Route path="/singlecast/:id" component={SingleCastPage} />
              </Box>
            </Switch>
          </Box>
        </div>
      </BrowserRouter>
    </LoadingScreen>
  );
}

export default App;
