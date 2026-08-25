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

    return (
        <Link key={user.uid} to={user === auth?.currentUser?.uid ? `/profile` : `/user/${user}`} style={{ textDecoration: 'none' }}>
            <div key={user.uid} className='cast_single'>
                <img alt="" src={photo ?? `https://api.dicebear.com/9.x/dylan/svg?seed=fun?size=96`} className='user_image' />
                <div style={{ marginTop: '5px' }}>
                    {username && <div style={{ color: theme.palette.warning.main }}>{username?.replace(/\d+$/, "")}</div>}
                    {lastActive && <div className='user_last_active'>{timeDifference(new Date(), new Date(lastActive))}</div>}
                </div>
            </div>
        </Link>
    )
}
