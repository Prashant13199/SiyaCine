import React, { useState, useEffect } from 'react'
import axios from "axios";
import SingleContent from '../../Components/SingleContent';
import './style.css';
import CustomPagination from '../../Components/Pagination/CustomPagination';
import { useParams } from 'react-router-dom';
import Grid from '@mui/material/Unstable_Grid2';
import { CircularProgress } from '@mui/material';
import { database } from '../../firebase';
import useGenre from '../../hooks/useGenre';
import Genres from '../../Components/Genres';
import { Helmet } from 'react-helmet';
import { useLocation, useHistory } from 'react-router-dom/cjs/react-router-dom.min';

export default function SingleCategory({ scrollTop, setBackdrop }) {

  let data = useQuery();
  const values = data.get('values')
  const pageM = data.get('pageM')
  const history = useHistory()

  const [page, setPage] = useState(pageM ? pageM : 1);
  const [content, setContent] = useState([]);
  const [numOfPages, setNumOfPages] = useState();
  const { category, type, name, uid } = useParams()
  const [loading, setLoading] = useState(true)
  const [selectedGenres, setSelectedGenres] = useState(values ? JSON.parse(values) : []);
  const genreforURL = useGenre(selectedGenres);
  const [genres, setGenres] = useState([]);
  const [tv, setTv] = useState(false)
  const [paginatedData, setPaginatedData] = useState([])
  const [perPage, setPerPage] = useState(24)
  const [databaseData, setDatabaseData] = useState(false)

  useEffect(() => {
    history.push(`/singlecategory/${category}/${type}/${name}/${uid}?pageM=${page}&values=${JSON.stringify(selectedGenres).replaceAll('&', ':')}`)
  }, [page, selectedGenres])

  useEffect(() => {
    if ((category === 'popular' || category === 'upcoming' || category === 'now_playing' || category === 'top_rated' || category === 'airing_today')) {
      fetch();
    } else if (category === 'discover') {
      fetchDiscover()
    } else if (category === 'watchlist' || category === 'watched' || category === 'favourites') {
      fetchData(category)
      setTv(true)
      setDatabaseData(true)
    }
    else {
      fetch2()
      setDatabaseData(false)
      setPaginatedData([])
    }
    scrollTop()
    setBackdrop()
  }, [page, genreforURL]);

  useEffect(() => {
    handlePagination()
  }, [content])

  function useQuery() {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
  }

  const handlePagination = () => {
    let start = (perPage * (page - 1))
    let end = (start + perPage)
    setPaginatedData(content?.slice(start, end))
  }

  const fetch = async () => {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/${type}/${category}?api_key=${process.env.REACT_APP_API_KEY}&page=${page}`
      );
      setContent(data.results);
      setNumOfPages(data.total_pages);
      setLoading(false)
    }
    catch (e) {
      console.log(e)
    }
  };

  const fetch2 = async () => {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/${category}/${type}/day?api_key=${process.env.REACT_APP_API_KEY}&page=${page}`
      );
      setContent(data.results);
      setNumOfPages(data.total_pages);
      setLoading(false)
    }
    catch (e) {
      console.log(e)
    }
  }

  const fetchDiscover = async () => {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/${category}/${type}?api_key=${process.env.REACT_APP_API_KEY}&page=${page}&with_origin_country=IN&with_genres=${genreforURL}`
      );
      setContent(data.results);
      setNumOfPages(data.total_pages);
      setLoading(false)
    }
    catch (e) {
      console.log(e)
    }
  }

  const fetchData = async (categoryName) => {
    try {
      database.ref(`/Users/${uid}/${categoryName}`).orderByChild('timestamp').on('value', snapshot => {
        let arr = []
        snapshot?.forEach((snap) => {
          arr.push({ id: snap.val().id, data: snap.val().data, type: snap.val().type })
        })
        setContent(arr.reverse())
        setNumOfPages(Math.ceil(arr?.length / perPage));
        setLoading(false)
      })
    }
    catch (e) {
      console.log(e)
    }
  }

  return (
    <>
      <Helmet>
        <title>SiyaCine{name ? ` - ${name}` : ''}</title>
      </Helmet>
      {!loading ? <div className='singlecategory'>
        <div className='discover_movies_title'>{name}</div>
        {category === 'discover' && <Genres
          type={type}
          selectedGenres={selectedGenres}
          setSelectedGenres={setSelectedGenres}
          genres={genres}
          setGenres={setGenres}
          setPage={setPage}
        />}
        <Grid container spacing={{ xs: 1, md: 1 }} columns={{ xs: 6, sm: 12, md: 24 }}>
          {databaseData ?
            <>
              {paginatedData?.map((data, index) => {
                return uid !== '$$' ? <SingleContent data={data.data} key={data.id} type={data.type} showtv={tv} index={index} /> : <SingleContent data={data} key={data.id} type={type} showtv={tv} index={index} />
              })}
            </>
            :
            <>
              {content?.map((data, index) => {
                return uid !== '$$' ? <SingleContent data={data.data} key={data.id} type={data.type} showtv={tv} index={index} /> : <SingleContent data={data} key={data.id} type={type} showtv={tv} index={index} />
              })}
            </>
          }
        </Grid>
        {numOfPages > 1 && (
          <CustomPagination setPage={setPage} page={page} numOfPages={numOfPages} />
        )}
      </div> : <div className="loading">
        <CircularProgress color='warning' />
      </div>}
    </>
  )
}
