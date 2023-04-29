import React, { useState, useEffect } from 'react'
import axios from "axios";
import SingleContent from '../../Components/SingleContent';
import useGenre from '../../hooks/useGenre';
import './style.css';
import Genres from '../../Components/Genres'
import CustomPagination from '../../Components/Pagination/CustomPagination';
import Grid from '@mui/material/Unstable_Grid2';

export default function TV() {

  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [page, setPage] = useState(1);
  const [content, setContent] = useState([]);
  const [numOfPages, setNumOfPages] = useState();
  const genreforURL = useGenre(selectedGenres);

  const fetchTV = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&sort_by=popularity.desc&include_video=false&page=${page}&with_genres=${genreforURL}`
    );
    setContent(data.results);
    setNumOfPages(data.total_pages);
  };

  useEffect(() => {
    window.scroll(0, 0);
    fetchTV();
  }, [genreforURL, page]);

  return (
    <div className='tv'>
      <div className='discover_movies_title'>Discover TV</div>
      <Genres
        type="tv"
        selectedGenres={selectedGenres}
        setSelectedGenres={setSelectedGenres}
        genres={genres}
        setGenres={setGenres}
        setPage={setPage}
      />
      <Grid container spacing={{ xs: 2, md: 2 }} columns={{ xs: 4, sm: 12, md: 16 }}>
        {content &&
          content.map((data) => {
            return <SingleContent data={data} key={data.id} type={'tv'} />
          })}
      </Grid>

      {numOfPages > 1 && (
        <CustomPagination setPage={setPage} numOfPages={numOfPages} />
      )}
    </div>
  )
}
