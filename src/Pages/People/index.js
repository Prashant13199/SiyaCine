import React, { useEffect, useState } from 'react'
import './style.css'
import User from '../../Components/User'
import Grid from '@mui/material/Unstable_Grid2';
import { CircularProgress } from '@mui/material';
import { Helmet } from 'react-helmet';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import useFetchUsers from '../../hooks/useFetchUsers';

export default function People({ scrollTop, setBackdrop }) {

    const users = useFetchUsers()

    const [search, setSearch] = useState('')
    const [searchedUsers, setSearchedUsers] = useState([])

    useEffect(() => {
        scrollTop()
        setBackdrop()
    }, [])

    useEffect(() => {
        if (search?.length) {
            let arr = []
            users?.map((user) => {
                if (user?.username?.includes(search)) {
                    arr.push(user)
                }
            })
            setSearchedUsers(arr)
        } else {
            setSearchedUsers(users)
        }
    }, [search, users])

    const clear = () => {
        setSearch('')
    }

    return (
        <>
            <Helmet>
                <title>SiyaCine - People</title>
            </Helmet>
            <div className='people'>
                <Paper component="form" sx={{ p: '4px', display: 'flex', alignItems: 'center', width: '100%', borderRadius: '10px', margin: 'auto' }}>
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        className='input_search'
                        placeholder="Search for users"
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
                    {search?.length > 0 &&
                        <IconButton type="button" sx={{ p: '4px' }} aria-label="search" onClick={() => clear()} >
                            <CloseIcon />
                        </IconButton>
                    }
                </Paper>
                <br />
                {users?.length ? <Grid container spacing={{ xs: 1, md: 1 }} columns={{ xs: 4, sm: 12, md: 16, lg: 24 }}>
                    {searchedUsers?.map((user) => {
                        return <User user={user} key={user.uid} />
                    })}
                </Grid> : <div className="loading">
                    <CircularProgress color='warning' />
                </div>}
            </div>
        </>
    )
}
