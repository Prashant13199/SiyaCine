import React, { useEffect } from 'react'
import axios from "axios";
import './style.css'
import Chip from '@mui/material/Chip';

export default function Genres({
  selectedGenres,
  setSelectedGenres,
  genres,
  setGenres,
  type,
  setPage,
}) {

  useEffect(() => {
    fetchGenres();
    return () => {
      setGenres({});
    };
  }, []);

  const handleAdd = (genre) => {
    setSelectedGenres([...selectedGenres, genre]);
    setGenres(genres.filter((g) => g.id !== genre.id));
    setPage(1);
  };

  const handleRemove = (genre) => {
    setSelectedGenres(
      selectedGenres.filter((selected) => selected.id !== genre.id)
    );
    setGenres([...genres, genre]);
    setPage(1);
  };

  const fetchGenres = async () => {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/genre/${type}/list?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
      );
      setGenres(data.genres);
    }
    catch (e) {
      console.log(e)
    }
  };

  return (
    <div style={{ margin: '20px 0px' }}>
      {selectedGenres?.map((genre) => (
        <Chip
          style={{ margin: 2, padding: 4 }}
          label={genre.name}
          key={genre.id}
          clickable
          color='primary'
          size="small"
          onDelete={() => handleRemove(genre)}
        />
      ))}
      {genres?.map((genre) => (
        <Chip
          style={{ margin: 2, padding: 4 }}
          label={genre.name}
          key={genre.id}
          clickable
          size="small"
          color='warning'
          onClick={() => handleAdd(genre)}
        />
      ))}
    </div>
  )
}
