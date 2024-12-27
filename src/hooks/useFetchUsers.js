import { useEffect, useState } from 'react'
import { database, auth } from '../firebase'

export default function useFetchUsers() {

    const [users, setUsers] = useState([])

    useEffect(() => {
        database.ref(`/Users`).orderByChild('timestamp').once('value', snapshot => {
            let user = []
            snapshot.forEach((snap) => {
                if (snap.key !== auth?.currentUser?.uid) {
                    user.push(snap.val())
                }
            })
            setUsers(user.reverse())
        })
    }, [])

    return users;
}
