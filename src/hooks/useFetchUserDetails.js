import { useState, useEffect } from 'react'
import { database } from '../firebase';

export default function useFetchUserDetails(uid, data) {

    const [content, setContent] = useState(null)

    useEffect(() => {
        setContent(null)
        database.ref(`/Users/${uid}`).on('value', snapshot => {
            if (data === 'photo') {
                setContent(snapshot.val()?.photo)
            } else if (data === 'username') {
                setContent(snapshot.val()?.username)
            } else if (data === 'lastActive') {
                setContent(snapshot.val()?.timestamp)
            }
        })
    }, [uid, data])

    return content
}
