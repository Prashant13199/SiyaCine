import React, { useEffect, useState } from 'react'
import './style.css'
import { database } from '../../firebase'
import User from '../../Components/User'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';

export default function People() {

    const [users, setUsers] = useState([])
    const uid = localStorage.getItem('uid')

    useEffect(() => {
        database.ref(`/Users`).orderByChild('createdAccountOn').on('value', snapshot => {
            let user = []
            snapshot.forEach((snap) => {
                if (snap.val().uid !== uid)
                    user.push({ data: snap.val() })
            })
            setUsers(user)
        })
    }, [])

    return (
        <Box sx={{ flexGrow: 1, marginY: 10, marginX: 2 }}>
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 12, md: 16 }}>
                {users && users.map((user) => {
                    return <User user={user.data} key={user.data.uid} />
                })}
            </Grid>
        </Box>
    )
}
