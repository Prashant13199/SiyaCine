import React from 'react'
import './style.css'
import useFetchUserDetails from '../../hooks/useFetchUserDetails'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'
import { auth, database } from '../../firebase'
import { timeDifference } from '../../Services/time'

export default function Notification({ noti, handleClose }) {

    const photo = useFetchUserDetails(noti?.byuid, 'photo')
    const connectID = [auth?.currentUser?.uid, noti?.byuid].sort().join(':')
    const currentUsername = useFetchUserDetails(auth?.currentUser?.uid, 'username')

    const removeNotification = () => {
        database.ref(`/Users/${auth?.currentUser?.uid}/notifications/${noti.id}`)
            .remove().then(() => {
                if (noti?.connection) {
                    database.ref(`Connections/${connectID}`).remove()
                        .then(() => console.log('Connection declined'))
                        .catch((e) => console.log(e))
                }
            }).catch((e) => {
                console.log(e)
            })
    }

    const acceptConnection = () => {
        database.ref(`Connections/${connectID}`).update({
            connected: true,
            requested: false
        }).then(() => {
            console.log('Connection accepted')
            database.ref(`/Users/${noti?.byuid}/notifications/${auth?.currentUser?.uid}`).update({
                timestamp: Date.now(),
                by: currentUsername,
                byuid: auth?.currentUser?.uid,
                id: auth?.currentUser?.uid,
                text: `${currentUsername} accepted your connection request`,
            }).then(() => {
                console.log('Notification Sent')
                database.ref(`/Users/${auth?.currentUser?.uid}/notifications/${noti.id}`).remove()
                    .then(() => console.log('Self notification removed')).catch((e) => console.log(e))
            }).catch((e) => console.log(e))
        }).catch((e) => console.log(e))
    }

    return (
        <div className='notification'>
            <Link onClick={handleClose} to={`/user/${noti.byuid}`}>
                <img src={photo} className='notification_image' />
            </Link>
            <div className='notification_right'>
                {noti.text} <span className='noti_time'>{timeDifference(new Date(), new Date(noti.timestamp))}</span>
                <div className='notification_btns'>
                    {noti?.connection && <div onClick={acceptConnection} className='notification_accept'>accept</div>}
                    <div onClick={removeNotification} className='notification_delete'>{noti?.connection ? 'decline' : 'clear'}</div>
                </div>
            </div>
            {noti?.poster && <Link onClick={handleClose} to={`/singlecontent/${noti.id}/${noti.type}`}>
                <img src={`https://image.tmdb.org/t/p/w500/${noti.poster}`} className='notification_poster' />
            </Link>}
        </div>
    )
}
