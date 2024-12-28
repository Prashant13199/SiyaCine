import React, { useEffect, useState } from 'react'
import { auth } from '../firebase'
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
                                arr.push(val)
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
