import React, { createContext, useEffect, useState } from 'react';
import { getRandomInt } from './utlitities';
import { auth } from '../firebase';
import useFetchDBData from '../hooks/useFetchDBData';
import axios from 'axios';
import useFetchContent from '../hooks/useFetchContent';

export const RecommendContext = createContext();

export default function RecommendProvider(props) {

    const [number, setNumber] = useState(0)
    const [recommendation, setRecommendation] = useState([])
    const [favouriteData, setFavoriteData] = useState({})

    const favourite = useFetchDBData(auth?.currentUser?.uid, 'favourites')

    const nowplaying = useFetchContent('now_playing', 'movie')
    const topratedmovie = useFetchContent('top_rated', 'movie')
    const topratedtv = useFetchContent('top_rated', 'tv')
    const trendingMovie = useFetchContent('trending', 'movie')
    const trendingTv = useFetchContent('trending', 'tv')
    const providersMovie = useFetchContent('providers', 'movie')
    const providersTV = useFetchContent('providers', 'tv')
    const genres = useFetchContent('genres', 'movie')
    const nowPlaying = useFetchContent('upcoming', 'movie')

    useEffect(() => {
        setNumber(getRandomInt(0, favourite?.length))
    }, [favourite])

    useEffect(() => {
        fetchRecommendation();
    }, [number])

    const fetchRecommendation = async () => {
        try {
            if (favourite[number]?.type) {
                const { data } = await axios.get(
                    `https://api.themoviedb.org/3/${favourite[number]?.type}/${favourite[number]?.id}/recommendations?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&sort_by=popularity.desc&include_video=false`
                );
                setRecommendation(data.results.splice(0, 10));
                setFavoriteData(favourite[number])
            }
        }
        catch (e) {
            console.log(e)
        }
    };

    return (
        <RecommendContext.Provider
            value={{
                recommendation, favouriteData, nowplaying,
                topratedmovie, topratedtv, trendingMovie,
                trendingTv, providersMovie, providersTV, genres, nowPlaying
            }}>
            {props.children}
        </RecommendContext.Provider>
    );
}