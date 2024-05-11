import { useEffect, useState } from 'react'
import { database } from '../firebase'

export default function useFetchDBData(uid, data) {

    const [content, setContent] = useState([])

    useEffect(() => {
        database.ref(`/Users/${uid}/${data}`).orderByChild('timestamp').on('value', snapshot => {
            let arr = []
            snapshot?.forEach((snap) => {
                arr.push({ id: snap.val().id, data: snap.val().data, type: snap.val().type })
            })
            setContent(arr.reverse())
        })
    }, [uid, data])

    return content;
}
