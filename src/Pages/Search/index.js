import React, { useEffect, useState } from 'react'
import './style.css';
import axios from "axios";
import SingleContentSearch from '../../Components/SingleContentSearch';
import CustomPagination from '../../Components/Pagination/CustomPagination';
import Grid from '@mui/material/Unstable_Grid2';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import empty from '../../assets/empty.png'
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

export default function Search({ scrollTop }) {

    const [pageM, setPageM] = useState(localStorage.getItem('searchPage') !== null ? localStorage.getItem('searchPage') : 1);
    const [contentM, setContentM] = useState([]);
    const [numOfPagesM, setNumOfPagesM] = useState();
    const [query, setQuery] = useState(localStorage.getItem('searchQuery') !== null ? localStorage.getItem('searchQuery') : '')

    const fetchSearch = async () => {
        try {
            const { data } = await axios.get(
                `https://api.themoviedb.org/3/search/multi?api_key=${process.env.REACT_APP_API_KEY
                }&language=en-US&query=${query}&page=${pageM}`
            );
            setContentM(data.results);
            setNumOfPagesM(data.total_pages);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        scrollTop()
        fetchSearch();
        saveQuery()
    }, [pageM, query])

    useEffect(() => {
        if (query?.length === 0) {
            setPageM(1)
        }
    }, [query])

    const saveQuery = () => {
        localStorage.setItem('searchQuery', query)
        localStorage.setItem('searchPage', pageM)
    }

    const clearQuery = () => {
        setQuery('')
        setPageM(1)
    }

    return (
        <div className="search">
            <div className='discover_movies_title'>Search</div>
            <Paper component="form" sx={{ p: '8px 4px', display: 'flex', alignItems: 'center', width: '98%', borderRadius: '10px', margin: 'auto' }}>
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    className='input_search'
                    placeholder="Search for a Movies or TV Shows"
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
                {query?.length > 0 && <IconButton type="button" sx={{ p: '4px' }} aria-label="search" onClick={() => clearQuery()}>
                    <CloseIcon />
                </IconButton>}
            </Paper>
            <br />
            {query && <>
                <Grid container spacing={{ xs: 1, md: 1 }} columns={{ xs: 6, sm: 12, md: 24 }}>
                    {contentM && contentM.map((data) => {
                        return <SingleContentSearch data={data} key={data.id} />
                    })}
                </Grid>

                {numOfPagesM > 1 && (
                    <CustomPagination setPage={setPageM} page={pageM} numOfPages={numOfPagesM} />
                )}
            </>}
            {contentM?.length === 0 && query && <center>
                <img src={empty} className='empty' />
                <h6 style={{ color: 'gray' }}>Nothing to show here</h6></center>}
        </div>
    )
}
