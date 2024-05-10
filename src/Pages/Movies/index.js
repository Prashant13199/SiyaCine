import React, { useState, useEffect } from 'react'
import axios from "axios";
import SingleContent from '../../Components/SingleContent';
import useGenre from '../../hooks/useGenre';
import './style.css';
import Genres from '../../Components/Genres'
import CustomPagination from '../../Components/Pagination/CustomPagination';
import Grid from '@mui/material/Unstable_Grid2';
import { CircularProgress } from '@mui/material';
import empty from '../../assets/empty.png'
import { Helmet } from 'react-helmet';

export default function Movies({ scrollTop }) {

  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [page, setPage] = useState(1);
  const [content, setContent] = useState([]);
  const [numOfPages, setNumOfPages] = useState();
  const genreforURL = useGenre(selectedGenres);
  const [loading, setLoading] = useState(true)

  const fetchMovies = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&sort_by=popularity.desc&include_video=false&page=${page}&with_genres=${genreforURL}`
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
    fetchMovies();
  }, [genreforURL, page]);

  return (
    <>
      <Helmet>
        <title>SiyaCine - Discover Movies</title>
      </Helmet>
      <div className='movies'>
        <Genres
          type="movie"
          selectedGenres={selectedGenres}
          setSelectedGenres={setSelectedGenres}
          genres={genres}
          setGenres={setGenres}
          setPage={setPage}
        />
        {!loading ?
          <>
            <Grid container spacing={{ xs: 1, md: 1 }} columns={{ xs: 6, sm: 12, md: 24 }}>
              {content &&
                content.map((data) => {
                  return <SingleContent data={data} key={data.id} type={'movie'} />
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
