import React, { useState, useEffect } from 'react'
import axios from "axios";
import SingleContent from '../../Components/SingleContent';
import useGenre from '../../hooks/useGenre';
import './style.css';
import Genres from '../../Components/Genres'
import CustomPagination from '../../Components/Pagination/CustomPagination';
import { useParams } from 'react-router-dom';
import Grid from '@mui/material/Unstable_Grid2';
import { CircularProgress } from '@mui/material';

export default function SingleCategory({ scrollTop }) {

  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [page, setPage] = useState(1);
  const [content, setContent] = useState([]);
  const [numOfPages, setNumOfPages] = useState();
  const genreforURL = useGenre(selectedGenres);
  const { category, type, name } = useParams()
  const [loading, setLoading] = useState(true)

  const fetch = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/${type}/${category}?api_key=${process.env.REACT_APP_API_KEY}&page=${page}&with_genres=${genreforURL}`
    );
    setContent(data.results);
    setNumOfPages(data.total_pages);
    setLoading(false)
  };

  const fetch2 = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/${category}/${type}/day?api_key=${process.env.REACT_APP_API_KEY}&page=${page}&with_genres=${genreforURL}`
    );
    setContent(data.results);
    setNumOfPages(data.total_pages);
    setLoading(false)
  }

  useEffect(() => {
    if ((category === 'popular' || category === 'upcoming' || category === 'now_playing' || category === 'top_rated')) {
      fetch();
    } else {
      fetch2()
    }
    scrollTop()
  }, [genreforURL, page]);

  return !loading ? (
    <div className='singlecategory'>
      <div className='discover_movies_title'>{name}</div>
      <Genres
        type={type}
        selectedGenres={selectedGenres}
        setSelectedGenres={setSelectedGenres}
        genres={genres}
        setGenres={setGenres}
        setPage={setPage}
      />
      <Grid container spacing={{ xs: 1, md: 1 }} columns={{ xs: 6, sm: 12, md: 24 }}>
        {content &&
          content.map((data) => {
            return <SingleContent data={data} key={data.id} type={type} />
          })}
      </Grid>
      {numOfPages > 1 && (
        <CustomPagination setPage={setPage} numOfPages={numOfPages} />
      )}
    </div>
  )
    : <div className="loading">
      <CircularProgress color='warning' />
    </div>
}
