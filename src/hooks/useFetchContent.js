import { useEffect, useState } from 'react'
import axios from "axios";
import useFetchDBData from './useFetchDBData';
import { auth } from '../firebase';
import useGenre from './useGenre';

export default function useFetchContent(value, type) {

    const [content, setContent] = useState([])

    const genres = useFetchDBData(auth?.currentUser?.uid, 'genres')
    const genreforURL = useGenre(genres ?? []);

    useEffect(() => {
        if (value === 'trending') {
            fetchDataTrending()
        } else if (value === 'discover') {
            fetchDataIndian()
        } else if (value === 'providers') {
            fetchProviders()
        } else {
            fetchData()
        }
    }, [value])

    useEffect(() => {
        if (value === 'genres' && genres?.length > 0) {
            fetchGenres()
        }
    }, [genres])

    const fetchGenres = async () => {
        try {
            const { data } = await axios.get(
                `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_API_KEY}&with_genres=${genreforURL}`
            );

            setContent(data?.results);
        }
        catch (e) {
            console.log(e)
        }
    }

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

    const fetchProviders = async () => {
        try {
            const { data } = await axios.get(
                `https://api.themoviedb.org/3//watch/${value}/${type}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&watch_region=IN`
            );

            setContent(data?.results);
        }
        catch (e) {
            console.log(e)
        }
    };
    return content
}
