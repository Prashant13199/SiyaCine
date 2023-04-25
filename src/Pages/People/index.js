import React, { useEffect, useState } from 'react'
import './style.css'
import { database } from '../../firebase'
import User from '../../Components/User'

export default function People() {

    const [users, setUsers] = useState([])
    const uid = localStorage.getItem('uid')

    useEffect(() => {
        database.ref(`/Users`).orderByChild('createdAccountOn').on('value', snapshot => {
            let user = []
            snapshot.forEach((snap) => {
                if(snap.val().uid!==uid)
                    user.push({ data: snap.val() })
            })
            setUsers(user)
        })
    }, [])

    return (
        <div className='People'>
            {users && users.map((user) => {
                return <User user={user.data} key={user.data.uid} />
            })}
        </div>
    )
}
