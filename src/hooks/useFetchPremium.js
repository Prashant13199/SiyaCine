import { useEffect, useState } from 'react'
import { database } from '../firebase'

export default function useFetchPremium(uid) {

    const [premium, setPremium] = useState(false)

    useEffect(() => {
        database.ref(`/Users/${uid}/premium`).on('value', snapshot => {
            setPremium(snapshot.val())
        })
    }, [uid])

    return premium;
}
