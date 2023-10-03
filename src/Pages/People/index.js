import React, { useEffect, useState } from 'react'
import './style.css'
import { auth, database } from '../../firebase'
import User from '../../Components/User'
import Grid from '@mui/material/Unstable_Grid2';
import LoadingIcon from '../../assets/loading.gif'

export default function People() {

    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        window.scroll(0, 0)
        fetchUsers()
    }, [])

    const fetchUsers = () => {
        database.ref(`/Users`).orderByChild('createdAccountOn').on('value', snapshot => {
            let user = []
            snapshot.forEach((snap) => {
                if (snap.val().uid !== auth?.currentUser?.uid)
                    user.push({ data: snap.val() })
            })
            setUsers(user)
            setLoading(false)
        })
    }

    return !loading ? (
        <div className='people'>
            <Grid container spacing={{ xs: 1, md: 1 }} columns={{ xs: 4, sm: 12, md: 24 }}>
                {users && users.map((user) => {
                    return <User user={user.data} key={user.data.uid} />
                })}
            </Grid>
        </div>
    )
        : <div className="loading">
            <img src={LoadingIcon} alt="loadingicon" className="loadingicon" />
        </div>
}
