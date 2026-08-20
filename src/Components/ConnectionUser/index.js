import React from 'react'
import './style.css'
import useFetchUserDetails from '../../hooks/useFetchUserDetails'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'
import { useTheme } from '@mui/material'
import { auth } from '../../firebase'
import { timeDifference } from '../../Services/time'

export default function ConnectionUser({ user }) {

    const username = useFetchUserDetails(user, 'username')
    const photo = useFetchUserDetails(user, 'photo')
    const lastActive = useFetchUserDetails(user, 'lastActive')
    const theme = useTheme()
    console.log(lastActive)

    return (
        <Link key={user.uid} to={user === auth?.currentUser?.uid ? `/profile` : `/user/${user}`} style={{ textDecoration: 'none' }}>
            <div key={user.uid} className='cast_single'>
                <img alt="" src={photo} className='user_image' />
                <div style={{ marginTop: '5px' }}>
                    <div style={{ maxWidth: '150px', color: theme.palette.warning.main }}>{username}</div>
                    <div className='user_last_active'>{timeDifference(new Date(), new Date(lastActive))}</div>
                </div>
            </div>
        </Link>
    )
}
