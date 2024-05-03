import React, { useEffect, useState } from 'react'
import axios from "axios";

export default function useFetchContent(value, type) {

    const [content, setContent] = useState([])

    useEffect(() => {
        if (value == 'trending') {
            fetchDataTrending()
        } else {
            fetchData()
        }
    }, [value, type])

    const fetchData = async () => {
        try {
            const { data } = await axios.get(
                `https://api.themoviedb.org/3/${type}/${value}?api_key=${process.env.REACT_APP_API_KEY}`
            );

            setContent(data?.results);
        }
        catch (e) {
            console.log(e)
        }
    };
    const fetchDataTrending = async () => {
        try {
            const { data } = await axios.get(
                `https://api.themoviedb.org/3/${value}/${type}/day?api_key=${process.env.REACT_APP_API_KEY}`
            );

            setContent(data?.results);
            console.log(data.results)
        }
        catch (e) {
            console.log(e)
        }
    };
    return content
}
