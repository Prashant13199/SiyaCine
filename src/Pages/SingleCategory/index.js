import React, { useState, useEffect } from 'react'
import axios from "axios";
import SingleContent from '../../Components/SingleContent';
import './style.css';
import CustomPagination from '../../Components/Pagination/CustomPagination';
import { useParams } from 'react-router-dom';
import Grid from '@mui/material/Unstable_Grid2';
import { CircularProgress } from '@mui/material';
import { database } from '../../firebase';

export default function SingleCategory({ scrollTop }) {

  const [page, setPage] = useState(1);
  const [content, setContent] = useState([]);
  const [numOfPages, setNumOfPages] = useState();
  const { category, type, name, uid } = useParams()
  const [loading, setLoading] = useState(true)

  const fetch = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/${type}/${category}?api_key=${process.env.REACT_APP_API_KEY}&page=${page}`
    );
    setContent(data.results);
    setNumOfPages(data.total_pages);
    setLoading(false)
  };

  const fetch2 = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/${category}/${type}/day?api_key=${process.env.REACT_APP_API_KEY}&page=${page}`
    );
    setContent(data.results);
    setNumOfPages(data.total_pages);
    setLoading(false)
  }

  const fetchWatchlist = async () => {
    database.ref(`/Users/${uid}/watchlist`).on('value', snapshot => {
      let arr = []
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, data: snap.val().data, type: snap.val().type })
      })
      setContent(arr)
      setLoading(false)
    })
  }

  const fetchWatched = async () => {
    database.ref(`/Users/${uid}/watched`).on('value', snapshot => {
      let arr = []
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, data: snap.val().data, type: snap.val().type })
      })
      setContent(arr)
      setLoading(false)
    })
  }

  const fetchFavourite = async () => {
    database.ref(`/Users/${uid}/favourites`).on('value', snapshot => {
      let arr = []
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, data: snap.val().data, type: snap.val().type })
      })
      setContent(arr)
      setLoading(false)
    })
  }

  useEffect(() => {
    if ((category === 'popular' || category === 'upcoming' || category === 'now_playing' || category === 'top_rated')) {
      fetch();
    } else if(category === 'watchlist'){
      fetchWatchlist()
    }else if(category === 'watched'){
      fetchWatched()
    }else if(category === 'favourites'){
      fetchFavourite()
    }
    else {
      fetch2()
    }
    scrollTop()
  }, [page]);

  return !loading ? (
    <div className='singlecategory'>
      <div className='discover_movies_title'>{name}</div>
      <br />
      <Grid container spacing={{ xs: 1, md: 1 }} columns={{ xs: 6, sm: 12, md: 24 }}>
        {content &&
          content.map((data) => {
            return uid !== '$$' ? <SingleContent data={data.data} key={data.id} type={data.type} /> : <SingleContent data={data} key={data.id} type={type} />
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
