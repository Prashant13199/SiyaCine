import React, { useState, useEffect } from 'react'
import axios from "axios";
import SingleContent from '../../Components/SingleContent';
import useGenre from '../../hooks/useGenre';
import './style.css';
import Genres from '../../Components/Genres'
import CustomPagination from '../../Components/Pagination/CustomPagination';

export default function Movies() {

  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [page, setPage] = useState(1);
  const [content, setContent] = useState([]);
  const [numOfPages, setNumOfPages] = useState();
  const genreforURL = useGenre(selectedGenres);

  const fetchMovies = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&sort_by=popularity.desc&include_video=false&page=${page}&with_genres=${genreforURL}`
    );
    setContent(data.results);
    setNumOfPages(data.total_pages);
  };

  useEffect(() => {
    window.scroll(0, 0);
    fetchMovies();
  }, [genreforURL, page]);

  return (
    <div className='movies'>
      
      <div className='discover_movies_title'>Discover Movies</div>
      <Genres
        type="movie"
        selectedGenres={selectedGenres}
        setSelectedGenres={setSelectedGenres}
        genres={genres}
        setGenres={setGenres}
        setPage={setPage}
      />
      <div>
        {content &&
          content.map((data) => {
          return <SingleContent data={data} key={data.id} type={'movie'} />
        })}
      </div>
      {numOfPages > 1 && (
        <CustomPagination setPage={setPage} numOfPages={numOfPages} />
      )}
    </div>
  )
}
