import React from 'react'
import './style.css'
import useFetchUserDetails from '../../hooks/useFetchUserDetails'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'
import { useTheme } from '@mui/material'
import { auth } from '../../firebase'

export default function ConnectionUser({ user }) {

    const username = useFetchUserDetails(user, 'username')
    const photo = useFetchUserDetails(user, 'photo')
    const theme = useTheme()

    return (
        <Link to={user === auth?.currentUser?.uid ? `/profile` : `/user/${user}`} style={{ textDecoration: 'none' }}>
            <div className='cast_single'>
                <img alt="" src={photo} className='cast_image' />
                <div style={{ marginTop: '5px' }}>
                    <div style={{ maxWidth: '150px', color: theme.palette.warning.main }}>{username}</div>
                </div>
            </div>
        </Link>
    )
}
