import React, { useEffect, useState } from 'react'
import './style.css';
import axios from "axios";
import SingleContentSearch from '../../Components/SingleContentSearch';
import Grid from '@mui/material/Unstable_Grid2';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import empty from '../../assets/empty.png'
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useLocation, useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import SearchPagination from '../../Components/Pagination/SearchPagination';
import { Helmet } from 'react-helmet';

function useQuery() {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function Search({ scrollTop, setBackdrop }) {

    let data = useQuery();
    const query = data.get('query')
    const page = data.get('page')
    const history = useHistory()
    const [contentM, setContentM] = useState([]);
    const [numOfPagesM, setNumOfPagesM] = useState();
    const [search, setSearch] = useState(query ? query : '')
    const [pageM, setPageM] = useState(page ? page : 1)

    const fetchSearch = async () => {
        try {
            const { data } = await axios.get(
                `https://api.themoviedb.org/3/search/multi?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&query=${query}&page=${page}`
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
        setBackdrop()
    }, [page, query])

    useEffect(() => {
        history.push(`/search?query=${search}&page=${pageM}`)
    }, [pageM, search])

    const handlePageChange = (event, value) => {
        setPageM(value);
        window.scroll(0, 0);
    };

    const clear = () => {
        setSearch('')
        setPageM(1)
    }

    return (
        <>

            <Helmet>
                <title>SiyaCine - Search</title>
            </Helmet>

            <div className="search">
                <Paper component="form" sx={{ p: '8px 4px', display: 'flex', alignItems: 'center', width: '98%', borderRadius: '10px', margin: 'auto' }}>
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        className='input_search'
                        placeholder="Search for a Movies or TV Shows"
                        inputProps={{ 'aria-label': 'search google maps' }}
                        value={search}
                        autoFocus
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.keyCode === 13) {
                                e.preventDefault()
                            }
                        }}
                    />
                    {query?.length > 0 &&
                        <IconButton type="button" sx={{ p: '4px' }} aria-label="search" onClick={() => clear()} >
                            <CloseIcon />
                        </IconButton>
                    }
                </Paper>
                <br />
                {query && <>
                    <Grid container spacing={{ xs: 1, md: 1 }} columns={{ xs: 6, sm: 12, md: 24 }}>
                        {contentM && contentM.map((data) => {
                            return <SingleContentSearch data={data} key={data.id} />
                        })}
                    </Grid>

                    {numOfPagesM > 1 && (
                        <SearchPagination page={page} numOfPages={numOfPagesM} handlePageChange={handlePageChange} />
                    )}
                </>}
                {contentM?.length === 0 && query && <center>
                    <img src={empty} className='empty' />
                    <h6 style={{ color: 'gray' }}>Nothing to show here</h6></center>}
            </div>

        </>

    )
}
