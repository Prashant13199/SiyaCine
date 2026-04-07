import React, { useEffect, useState } from 'react'
import { auth, database } from '../firebase'
import axios from 'axios'
import useFetchDBData from './useFetchDBData'

export default function useFetchMyShows() {

    const [myShows, setMyShows] = useState([])
    const tracking = useFetchDBData(auth?.currentUser?.uid, 'tracking')

    useEffect(() => {
        fetchData()
    }, [auth?.currentUser?.uid, tracking])

    const fetchData = async () => {
        try {
            const { data } = await axios.get(
                `https://api.themoviedb.org/3/tv/on_the_air?api_key=${process.env.REACT_APP_API_KEY}`
            );
            let count = data?.results?.length
            let arr = []
            while (count > 0) {
                try {
                    const { data } = await axios.get(
                        `https://api.themoviedb.org/3/tv/on_the_air?api_key=${process.env.REACT_APP_API_KEY}&page=${count}`
                    );
                    data?.results?.map((val) => {
                        tracking?.map((val2) => {
                            if (val?.id == val2?.id) {
                                if (!arr.find((val3) => val3?.id === val?.id)) {
                                    arr.push(val)
                                    database.ref(`/Users/${auth?.currentUser?.uid}/watched/series/${val2?.data?.next_episode_to_air?.id}`).once('value', snapshot => {
                                        if (!snapshot.val()) {
                                            database.ref(`/Users/${auth?.currentUser?.uid}/watching/${val.id}`).once('value', snapshot2 => {
                                                if (!snapshot2.val()) {
                                                    database.ref(`/Users/${auth?.currentUser?.uid}/watching/${val.id}`).update({
                                                        id: val.id, data: val, type: 'tv', timestamp: Date.now(), new: true, season: val2.season, episode: val2.episode
                                                    }).then(() => {
                                                        database.ref(`/Users/${auth?.currentUser?.uid}/watched/${val.id}`).remove()
                                                    }).catch((e) => console.log(e))
                                                }
                                            })
                                        }
                                    })
                                }
                            }
                        })
                    })
                    count--
                }
                catch (e) {
                    console.log(e)
                }
            }
            setMyShows(arr)
        }
        catch (e) {
            console.log(e)
        }
    };

    return myShows;
}
