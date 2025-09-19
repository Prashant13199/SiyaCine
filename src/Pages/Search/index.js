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
import useFetchUsers from '../../hooks/useFetchUsers';
import User from '../../Components/User';
import { auth, database } from '../../firebase';

export default function Search({ scrollTop }) {

    let data = useQuery();
    const query = data.get('query')
    const page = data.get('page')
    const history = useHistory()
    const users = useFetchUsers()

    function useQuery() {
        const { search } = useLocation();
        return React.useMemo(() => new URLSearchParams(search), [search]);
    }

    const [contentM, setContentM] = useState([]);
    const [numOfPagesM, setNumOfPagesM] = useState();
    const [search, setSearch] = useState(query ? query : '')
    const [pageM, setPageM] = useState(page ? page : 1)
    const [searchedUsers, setSearchedUsers] = useState([])
    const [recentlySearched, setRecentlySearched] = useState([])

    useEffect(() => {
        scrollTop()
        fetchSearch();
        fetchRecentlySearched()
    }, [page, query, users])

    useEffect(() => {
        setTimeout(() => {
            history.push(`/search?query=${search}&page=${pageM}`)
        }, 0)
    }, [pageM, search])

    const fetchRecentlySearched = () => {
        database.ref(`/Searched`).orderByChild('timestamp').on('value', snapshot => {
            let arr = []
            snapshot.forEach((snap) => {
                arr.push(snap.val())
            })
            setRecentlySearched(arr.reverse().splice(0, 18))
        })
    }

    const fetchSearch = async () => {
        if (query?.length) {
            try {
                const { data } = await axios.get(
                    `https://api.themoviedb.org/3/search/multi?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&query=${query}&page=${page}`
                );
                setContentM(data.results.filter((value) => value.media_type !== 'person'));
                setNumOfPagesM(data.total_pages);
            } catch (error) {
                console.error(error);
            }
            if (query?.length > 2) {
                let arr = []
                users?.map((user) => {
                    if (user?.username?.includes(query.toLowerCase())) {
                        arr.push(user)
                    }
                })
                setSearchedUsers(arr)
            }
        } else {
            setPageM(1)
            setSearchedUsers([])
        }
    };

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
                <Paper component="form" sx={{ p: '4px', display: 'flex', alignItems: 'center', width: '100%', borderRadius: '20px', margin: 'auto' }}>
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        className='input_search'
                        placeholder={auth?.currentUser?.uid ? "Search for movies, shows or users" : "Search for movies, shows"}
                        inputProps={{ 'aria-label': 'Search for movies or shows' }}
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
                        </IconButton>}
                </Paper>
                <br />
                {!query && recentlySearched?.length > 0 && <div className='discover_movies_title'>Recently searched</div>}
                <Grid container spacing={{ xs: 1, md: 1 }} columns={{ xs: 6, sm: 12, md: 24 }}>
                    {page == 1 && searchedUsers?.length > 0 &&
                        <>
                            {searchedUsers?.map((user, index) => {
                                return <User user={user} key={user.uid} index={index} />
                            })}
                        </>}
                    {query &&
                        <>
                            {contentM?.map((data, index) => {
                                return <SingleContentSearch data={data} id={data.id} type={data.media_type} key={data.id} index={index} />
                            })}
                        </>}
                    {!query &&
                        <>
                            {recentlySearched?.map((data, index) => {
                                return <SingleContentSearch data={data.data} id={data.data.id} type={data.data.media_type} key={data.data.id} index={index} />
                            })}
                        </>}
                </Grid>
                {contentM?.length === 0 && query && searchedUsers?.length === 0 && <center>
                    <img src={empty} className='empty' />
                    <h6 style={{ color: 'gray' }}>Nothing to show here</h6></center>}
                {numOfPagesM > 1 && contentM?.length > 0 && query && (
                    <SearchPagination page={page} numOfPages={numOfPagesM} handlePageChange={handlePageChange} />
                )}
            </div>
        </>

    )
}
