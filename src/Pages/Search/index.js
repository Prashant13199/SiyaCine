import React, { useEffect, useState } from 'react'
import './style.css';
import axios from "axios";
import SingleContent from '../../Components/SingleContent';
import CustomPagination from '../../Components/Pagination/CustomPagination';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Unstable_Grid2';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import empty from '../../assets/empty.png'
import { Link } from 'react-router-dom';
import Grow from '@mui/material/Grow';

export default function Search() {

    const [pageM, setPageM] = useState(1);
    const [contentM, setContentM] = useState([]);
    const [numOfPagesM, setNumOfPagesM] = useState();
    const [pageT, setPageT] = useState(1);
    const [contentT, setContentT] = useState([]);
    const [numOfPagesT, setNumOfPagesT] = useState();
    const [query, setQuery] = useState("")
    const [value, setValue] = useState(0);
    const [person, setPerson] = useState(0);
    const [checked, setChecked] = useState(false);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const fetchSearchMovie = async () => {
        try {
            const { data } = await axios.get(
                `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_API_KEY
                }&language=en-US&query=${query}&page=${pageM}`
            );
            setContentM(data.results);
            setNumOfPagesM(data.total_pages);
            setChecked(true)
        } catch (error) {
            console.error(error);
        }
    };

    const fetchSearchTV = async () => {
        try {
            const { data } = await axios.get(
                `https://api.themoviedb.org/3/search/tv?api_key=${process.env.REACT_APP_API_KEY
                }&language=en-US&query=${query}&page=${pageT}`
            );
            setContentT(data.results);
            setNumOfPagesT(data.total_pages);
            setChecked(true)
        } catch (error) {
            console.error(error);
        }
    };

    const fetchPerson = async () => {
        try {
            const { data } = await axios.get(
                `https://api.themoviedb.org/3/search/person?api_key=${process.env.REACT_APP_API_KEY
                }&language=en-US&query=${query}&page=${pageT}`
            );
            setPerson(data.results)
            setChecked(true)
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        setChecked(false)
        fetchSearchMovie();
        fetchSearchTV();
        fetchPerson()
    }, [pageM, pageT, query])

    return (
        <div className="search">
            <div className='discover_movies_title'>Search</div>
            <Paper component="form" sx={{ p: '4px 4px', display: 'flex', alignItems: 'center', width: '100%', borderRadius: '20px' }}>
                <InputBase
                    sx={{ ml: 1, flex: 1, fontFamily: 'Montserrat' }}
                    placeholder="Search for a movie, tv show or cast"
                    inputProps={{ 'aria-label': 'search google maps' }}
                    value={query}
                    autoFocus
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.keyCode === 13) {
                            e.preventDefault()
                        }
                    }}
                />
            </Paper>
            {query && <><div className='searchresultfor'>Showing results for</div>
                <div className='discover_movies_title'>{query}</div>
                <Tabs value={value} onChange={handleChange} centered >
                    <Tab label="Movie" style={{ fontFamily: 'Montserrat' }} />
                    <Tab label="TV" style={{ fontFamily: 'Montserrat' }} />
                    <Tab label="Person" style={{ fontFamily: 'Montserrat' }} />
                </Tabs><br />
                <Grow in={checked} {...(checked ? { timeout: 1000 } : {})} style={{ transformOrigin: '0 0 0' }}>
                    <Grid container spacing={{ xs: 1, md: 1 }} columns={{ xs: 6, sm: 12, md: 24 }}>
                        {contentM && value === 0 && contentM.map((data) => {
                            return <SingleContent data={data} key={data.id} type='movie' />
                        })}
                    </Grid>
                </Grow>
                {numOfPagesM > 1 && value === 0 && (
                    <CustomPagination setPage={setPageM} numOfPages={numOfPagesM} />
                )}
                <Grow in={checked} {...(checked ? { timeout: 1000 } : {})} style={{ transformOrigin: '0 0 0' }}>
                    <Grid container spacing={{ xs: 1, md: 1 }} columns={{ xs: 6, sm: 12, md: 24 }}>
                        {contentT && value === 1 && contentT.map((data) => {
                            return <SingleContent data={data} key={data.id} type='tv' />
                        })}
                    </Grid>
                </Grow>
                {numOfPagesT > 1 && value === 1 && (
                    <CustomPagination setPage={setPageT} numOfPages={numOfPagesT} />
                )}
                <Grow in={checked} {...(checked ? { timeout: 1000 } : {})} style={{ transformOrigin: '0 0 0' }}>
                    <Grid container spacing={{ xs: 1, md: 1 }} columns={{ xs: 6, sm: 12, md: 24 }}>
                        {person && value === 2 && person.map((c) => {
                            return c.profile_path && <Grid xs={2} sm={4} md={4} key={c.id}><Link to={`/singlecast/${c.id}`} style={{ textDecoration: 'none', color: 'black' }}>
                                <div className='cast_scroll'>
                                    <img alt="" src={c.profile_path ? `https://image.tmdb.org/t/p/w300/${c.profile_path}` : "https://upload.wikimedia.org/wikipedia/en/6/60/No_Picture.jpg"} className='cast_scroll_image' />
                                    <div style={{ marginTop: '5px' }}>
                                        <div style={{ fontWeight: '500', color: 'white' }}>{c.name}</div>
                                    </div>
                                </div>
                            </Link></Grid>
                        })}
                    </Grid>
                </Grow>
            </>}
            {contentM.length === 0 && value === 0 && query && <center>
                <img src={empty} width={'100px'} height={'auto'} />
                <h6 style={{ color: 'gray' }}>Oops... no movies found</h6></center>}
            {contentT.length === 0 && value === 1 && query && <center>
                <img src={empty} width={'100px'} height={'auto'} />
                <h6 style={{ color: 'gray' }}>Oops... no tv shows found</h6></center>}
        </div>
    )
}
