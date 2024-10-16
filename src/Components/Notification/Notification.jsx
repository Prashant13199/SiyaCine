import React from 'react'
import './style.css'
import useFetchUserDetails from '../../hooks/useFetchUserDetails'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'
import { auth, database } from '../../firebase'

export default function Notification({ noti, handleClose }) {

    const photo = useFetchUserDetails(noti?.byuid, 'photo')

    const removeNotification = () => {
        database.ref(`/Users/${auth?.currentUser?.uid}/notifications/${noti.id}`)
            .remove().then(() => {
                console.log('Notification removed')
            }).catch((e) => {
                console.log(e)
            })
    }

    return (
        <div className='notification'>
            <Link onClick={handleClose} to={`/user/${noti.byuid}`}>
                <img src={photo} className='notification_image' />
            </Link>
            <div className='notification_right'>
                {noti.text}
                <div onClick={removeNotification} className='notification_delete'>remove</div>
            </div>

            <Link onClick={handleClose} to={`/singlecontent/${noti.id}/${noti.type}`}>
                <img src={`https://image.tmdb.org/t/p/w500/${noti.poster}`} className='notification_poster' />
            </Link>
        </div>
    )
}
