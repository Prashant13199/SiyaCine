import { useEffect, useState } from 'react'
import { database } from '../firebase'

export default function useFetchDBData(uid, data) {

    const [content, setContent] = useState([])

    useEffect(() => {
        database.ref(`/Users/${uid}/${data}`).orderByChild('timestamp').once('value', snapshot => {
            let arr = []
            snapshot?.forEach((snap) => {
                if (snap.key !== "series") {
                    arr.push({ id: snap.val().id, data: snap.val().data, type: snap.val().type })
                }
            })
            setContent(arr.reverse())
        })
    }, [uid, data])

    return content;
}
