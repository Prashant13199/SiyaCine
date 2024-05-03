import React, { useState, useEffect } from 'react'
import { auth, database } from '../firebase';

export default function useFetchDB(data) {

    const [content, setContent] = useState(null)

    useEffect(() => {
        database.ref(`/Users/${auth?.currentUser?.uid}`).on('value', snapshot => {
            if (data === 'photo') {
                setContent(snapshot.val()?.photo)
            } else if (data === 'username') {
                setContent(snapshot.val()?.username)
            }
        })
    }, [auth?.currentUser?.uid])

    return content
}
