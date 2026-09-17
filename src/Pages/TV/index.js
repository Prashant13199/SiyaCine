import React, { useState, useEffect } from 'react'
import axios from "axios";
import SingleContent from '../../Components/SingleContent';
import useGenre from '../../hooks/useGenre';
import './style.css';
import Genres from '../../Components/Genres'
import CustomPagination from '../../Components/Pagination/CustomPagination';
import Grid from '@mui/material/Unstable_Grid2';
import { CircularProgress, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import empty from '../../assets/empty.png'
import { Helmet } from 'react-helmet';
import { useLocation, useHistory } from 'react-router-dom/cjs/react-router-dom.min';

export default function TV({ scrollTop }) {

  let data = useQuery();
  const values = data.get('values')
  const pageM = data.get('pageM')
  const sort = data.get('sort_by')
  const history = useHistory()

  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState(values ? JSON.parse(values) : []);
  const [page, setPage] = useState(pageM ? pageM : 1);
  const [content, setContent] = useState([]);
  const [numOfPages, setNumOfPages] = useState();
  const genreforURL = useGenre(selectedGenres);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortby] = useState(sort ? sort : "popularity.desc");

  const setURL = () => {
    if (selectedGenres.length > 0 || page > 1 || sortBy) {
      history.push(`/tv?values=${JSON.stringify(selectedGenres).replaceAll('&', ':')}&pageM=${page}&sort_by=${sortBy}`)
    }
  }

  function useQuery() {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
  }

  const fetchTV = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&sort_by=${sortBy}&include_video=false&page=${page}&with_genres=${genreforURL}`
      );
      setContent(data?.results);
      setNumOfPages(data?.total_pages);
      setLoading(false)
    }
    catch (e) {
      console.log(e)
    }
  };

  useEffect(() => {
    scrollTop();
    fetchTV();
  }, [genreforURL, page, sortBy]);

  useEffect(() => {
    if (values === null) {
      setSelectedGenres([])
      setPage(1)
    }
  }, [values])

  useEffect(() => {
    setPage(1)
  }, [sortBy])

  return (
    <>

      <Helmet>
        <title>SiyaCine - Discover TV Shows</title>
      </Helmet>

      <div className='movies'>
        <Genres
          type="tv"
          selectedGenres={selectedGenres}
          setSelectedGenres={setSelectedGenres}
          genres={genres}
          setGenres={setGenres}
          setPage={setPage}
        />
        <div className='sortByContainer'>
          <FormControl variant="standard" color="warning" sx={{ m: 1, minWidth: 80 }} size="small">
            <InputLabel id="demo-simple-select-label">Sort By</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={sortBy}
              onChange={(e) => setSortby(e.target.value)}
            >
              <MenuItem value={"popularity.desc"}>Popularity</MenuItem>
              <MenuItem value={"first_air_date.desc"}>Release Date</MenuItem>
              <MenuItem value={"vote_average.desc"}>Rating</MenuItem>
            </Select>
          </FormControl>
        </div>
        {!loading ?
          <> <Grid container spacing={{ xs: 1, md: 1 }} columns={{ xs: 6, sm: 12, md: 24 }}>
            {content &&
              content.map((data, index) => {
                return <SingleContent setURL={setURL} data={data} id={data.id} key={data.id} type={'tv'} index={index} />
              })}
          </Grid>
            {content?.length === 0 && <center><br />
              <img src={empty} className='empty' alt="" />
              <h6 style={{ color: 'gray' }}>Nothing to show here</h6></center>}
          </>
          : <div className="loading">
            <CircularProgress color='warning' />
          </div>}
        {numOfPages > 1 && (
          <CustomPagination setPage={setPage} numOfPages={numOfPages} page={page} />
        )}
      </div>

    </>

  )
}
