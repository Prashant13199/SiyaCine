import React, { useEffect, useState } from 'react'
import './style.css'
import { auth, database } from '../../firebase'
import User from '../../Components/User'
import Grid from '@mui/material/Unstable_Grid2';
import { CircularProgress } from '@mui/material';
import { Helmet } from 'react-helmet';

export default function People({ scrollTop, setBackdrop }) {

    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        scrollTop()
        fetchUsers()
        setBackdrop()
    }, [])

    const fetchUsers = () => {
        database.ref(`/Users`).orderByChild('timestamp').on('value', snapshot => {
            let user = []
            snapshot.forEach((snap) => {
                if (snap.val().uid !== auth?.currentUser?.uid)
                    user.push({ data: snap.val() })
            })
            setUsers(user.reverse())
            setLoading(false)
        })
    }

    return (
        <>
            <Helmet>
                <title>SiyaCine - People</title>
            </Helmet>
            {!loading ? <div className='people'>
                <Grid container spacing={{ xs: 1, md: 1 }} columns={{ xs: 4, sm: 12, md: 16, lg: 24 }}>
                    {users && users.map((user) => {
                        return <User user={user.data} key={user.data.uid} />
                    })}
                </Grid>
            </div> : <div className="loading">
                <CircularProgress color='warning' />
            </div>}
        </>
    )
}
