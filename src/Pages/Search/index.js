import React, { useEffect, useState } from 'react'
import './style.css';
import axios from "axios";
import SingleContent from '../../Components/SingleContent';
import CustomPagination from '../../Components/Pagination/CustomPagination';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import { keyboard } from '@testing-library/user-event/dist/keyboard';

export default function Search() {

    const [pageM, setPageM] = useState(1);
    const [contentM, setContentM] = useState([]);
    const [numOfPagesM, setNumOfPagesM] = useState();
    const [pageT, setPageT] = useState(1);
    const [contentT, setContentT] = useState([]);
    const [numOfPagesT, setNumOfPagesT] = useState();
    const [query, setQuery] = useState("")
    const [value, setValue] = React.useState(0);

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
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchSearchMovie();
        fetchSearchTV();
    }, [pageM, pageT, query])

    const searchQuery = () => {
        fetchSearchMovie();
        fetchSearchTV();
    }

    return (
        <Box sx={{ flexGrow: 1, marginY: 10, marginX: 3 }}>
            <div className='discover_movies_title'>Search</div>
            <Paper component="form" sx={{ p: '4px 4px', display: 'flex', alignItems: 'center', width: '100%', borderRadius: '20px' }}>
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search for a movie or tv show"
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
            <br />
            {query && <><div className='searchresultfor'>Showing results for</div>
                <div className='discover_movies_title'>{query}</div>
                <Tabs value={value} onChange={handleChange} centered>
                    <Tab label="Movie" />
                    <Tab label="TV" />
                </Tabs>
                <br />
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 12, md: 16 }}>
                    {contentM && value === 0 && contentM.map((data) => {
                        return <SingleContent data={data} key={data.id} type='movie' />
                    })}
                </Grid>
                {numOfPagesM > 1 && value === 0 && (
                    <CustomPagination setPage={setPageM} numOfPages={numOfPagesM} />
                )}

                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 12, md: 16 }}>

                    {contentT && value === 1 && contentT.map((data) => {
                        return <SingleContent data={data} key={data.id} type='tv' />
                    })}
                </Grid>
                {numOfPagesT > 1 && value === 1 && (
                    <CustomPagination setPage={setPageT} numOfPages={numOfPagesT} />
                )}
            </>}
            {contentM.length === 0 && value === 0 && query && <h2 style={{ textAlign: 'center' }}><br /><br />Oops... no movies found</h2>}
            {contentT.length === 0 && value === 1 && query && <h2 style={{ textAlign: 'center' }}><br /><br />Oops... no tv series found</h2>}
        </Box>
    )
}
