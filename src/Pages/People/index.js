import React, { useEffect, useState } from 'react'
import './style.css'
import { database } from '../../firebase'
import User from '../../Components/User'
import Grid from '@mui/material/Unstable_Grid2';
import Grow from '@mui/material/Grow';

export default function People() {

    const [users, setUsers] = useState([])
    const uid = localStorage.getItem('uid')
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        database.ref(`/Users`).orderByChild('createdAccountOn').on('value', snapshot => {
            let user = []
            snapshot.forEach((snap) => {
                if (snap.val().uid !== uid)
                    user.push({ data: snap.val() })
            })
            setUsers(user)
            setChecked(true)
        })
    }, [])

    return (
        <div className='people'>
            <Grow in={checked} {...(checked ? { timeout: 1000 } : {})} style={{ transformOrigin: '0 0 0' }}>
                <Grid container spacing={{ xs: 1, md: 1 }} columns={{ xs: 4, sm: 12, md: 24 }}>
                    {users && users.map((user) => {
                        return <User user={user.data} key={user.data.uid} />
                    })}
                </Grid>
            </Grow>
        </div>
    )
}
