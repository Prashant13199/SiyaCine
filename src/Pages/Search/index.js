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
import { CircularProgress } from '@mui/material';

export default function Search({ scrollTop }) {

    let data = useQuery();
    const query = data.get('query')
    const page = data.get('page')
    const history = useHistory()
    const users = useFetchUsers()

    const [contentM, setContentM] = useState([]);
    const [numOfPagesM, setNumOfPagesM] = useState();
    const [search, setSearch] = useState(query ? query : '')
    const [pageM, setPageM] = useState(page ? page : 1)
    const [searchedUsers, setSearchedUsers] = useState([])
    const [recentlySearched, setRecentlySearched] = useState([])
    const [loading, setLoading] = useState(true)

    function useQuery() {
        const { search } = useLocation();
        return React.useMemo(() => new URLSearchParams(search), [search]);
    }

    useEffect(() => {
        scrollTop();
        fetchRecentlySearched();
    }, [])

    useEffect(() => {
        fetchSearch();
    }, [pageM, search, users])

    const setURL = () => {
        if (search.length > 0 || pageM > 1) {
            history.push(`/search?query=${search}&page=${pageM}`)
        }
    }

    const fetchRecentlySearched = () => {
        database.ref(`/Searched`).orderByChild('timestamp').on('value', snapshot => {
            let arr = []
            snapshot.forEach((snap) => {
                arr.push(snap.val())
            })
            setRecentlySearched(arr.reverse().splice(0, 12))
            setLoading(false)
        })
    }

    const fetchSearch = async () => {
        if (search?.length) {
            setLoading(true)
            try {
                const { data } = await axios.get(
                    `https://api.themoviedb.org/3/search/multi?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&query=${search}&page=${pageM}`
                );
                setContentM(data.results.filter((value) => value.media_type !== 'person'));
                setNumOfPagesM(data.total_pages);
                setLoading(false)
            } catch (error) {
                console.error(error);
            }
            if (search?.length > 2) {
                let arr = []
                users?.map((user) => {
                    if (user?.username?.includes(search.toLowerCase())) {
                        arr.push(user)
                    }
                })
                setSearchedUsers(arr)
                setLoading(false)
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

    useEffect(() => {
        if (query === null) {
            clear()
        }
    }, [query])

    return (
        <>
            <Helmet>
                <title>SiyaCine - Search</title>
            </Helmet>
            <div className="search">
                <Paper component="form" className='search_container'>
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
                    {search?.length > 0 &&
                        <IconButton type="button" sx={{ p: '4px' }} aria-label="search" onClick={() => clear()} >
                            <CloseIcon />
                        </IconButton>}
                </Paper>
                <br />
                {!search && recentlySearched?.length > 0 && <h3>Recently searched</h3>}
                {!loading ? <Grid container spacing={{ xs: 1, md: 1 }} columns={{ xs: 6, sm: 12, md: 24 }}>
                    {pageM == 1 && searchedUsers?.length > 0 &&
                        <>
                            {searchedUsers?.map((user, index) => {
                                return <User user={user} key={user.uid} index={index} />
                            })}
                        </>}
                    {search ?
                        <>
                            {contentM?.map((data, index) => {
                                return <SingleContentSearch setURL={setURL} data={data} id={data.id} type={data.media_type} key={data.id} index={index} />
                            })}
                        </>
                        :
                        <>
                            {recentlySearched?.map((data, index) => {
                                return <SingleContentSearch data={data.data} id={data.data.id} type={data.data.media_type} key={data.data.id} index={index} />
                            })}
                        </>
                    }
                </Grid>
                    :
                    <div className="loading">
                        <CircularProgress color='warning' />
                    </div>}
                {contentM?.length === 0 && search && searchedUsers?.length === 0 && <center>
                    <img src={empty} className='empty' />
                    <h6 style={{ color: 'gray' }}>Nothing to show here</h6></center>}
                {numOfPagesM > 1 && contentM?.length > 0 && search && (
                    <SearchPagination page={pageM} numOfPages={numOfPagesM} handlePageChange={handlePageChange} />
                )}
            </div>
        </>

    )
}
