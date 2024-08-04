import { useEffect, useState } from 'react'
import axios from "axios";

export default function useFetchContent(value, type) {

    const [content, setContent] = useState([])

    useEffect(() => {
        if (value === 'trending') {
            fetchDataTrending()
        } else if (value === 'discover') {
            fetchDataIndian()
        } else {
            fetchData()
        }
    }, [value])

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

            setContent((data?.results).splice(0, 10));
        }
        catch (e) {
            console.log(e)
        }
    };

    const fetchDataIndian = async () => {
        try {
            const { data } = await axios.get(
                `https://api.themoviedb.org/3/${value}/${type}?api_key=${process.env.REACT_APP_API_KEY}&with_origin_country=IN`
            );

            setContent(data?.results);
        }
        catch (e) {
            console.log(e)
        }
    };
    return content
}
