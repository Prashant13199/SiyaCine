import { useState, useEffect } from 'react'
import { database } from '../firebase';

export default function useFetchUserDetails(uid, data) {

    const [content, setContent] = useState(null)

    useEffect(() => {
        database.ref(`/Users/${uid}`).on('value', snapshot => {
            if (data === 'photo') {
                setContent(snapshot.val()?.photo)
            } else if (data === 'username') {
                setContent(snapshot.val()?.username)
            }
        })
    }, [uid, data])

    return content
}
