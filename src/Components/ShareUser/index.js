import React, { useEffect, useState } from 'react'
import useFetchUserDetails from '../../hooks/useFetchUserDetails'
import { auth, database } from '../../firebase'

export default function ShareUser({ user, index, setMessage, setSnackBar, id, data, type, handleClose2 }) {

    const [connected, setConnected] = useState(false)

    const currentUsername = useFetchUserDetails(auth?.currentUser?.uid, 'username')
    const connectID = [auth?.currentUser?.uid, user.uid].sort().join(':')

    useEffect(() => {
        database.ref(`/Connections/${connectID}/connected`).on('value', snapshot => {
            if (snapshot.val()) {
                setConnected(true)
            } else {
                setConnected(false)
            }
        })
    }, [])

    const handleSend = (user, name) => {
        database.ref(`/Users/${user}/suggestions/${id}`).update({
            type: type, data: data, id: id, by: currentUsername, byuid: auth?.currentUser?.uid, timestamp: Date.now()
        }).then(() => {
            database.ref(`/Users/${user}/notifications/${id}`).update({
                timestamp: Date.now(),
                by: currentUsername,
                byuid: auth?.currentUser?.uid,
                id: id,
                text: `${currentUsername} suggested you to watch ${data.name || data.title || data.original_name}`,
                type: type,
                poster: data.poster_path
            })
            handleClose2()
            setMessage(`Suggested to ${name?.split('@')[0]}`)
            setSnackBar(true)
        }).catch((e) => { console.log(e) })
    }

    return connected && (
        <div key={index} className='share_user' onClick={() => {
            handleSend(user.uid, user.username)
        }}>
            <div>
                <img src={user.photo} className="share_user_image" />
            </div>
            <div className='share_user_username'>
                {user.username.split('@')[0]}
            </div>
        </div>
    )
}
