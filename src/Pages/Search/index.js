import React, { useEffect, useState } from 'react'
import './style.css'
import axios from "axios";
import { useParams } from 'react-router-dom';
import SingleContent from '../../Components/SingleContent';
import CustomPagination from '../../Components/Pagination/CustomPagination';

export default function Search() {

    const [page, setPage] = useState(1);
    const [content, setContent] = useState([]);
    const [numOfPages, setNumOfPages] = useState();
    const { query, type } = useParams()

    const fetchSearchMovie = async () => {
        try {
            const { data } = await axios.get(
                `https://api.themoviedb.org/3/search/${type==='tv' ? 'tv' : 'movie'}?api_key=${process.env.REACT_APP_API_KEY
                }&language=en-US&query=${query}&page=${page}&include_adult=false`
            );
            setContent(data.results);
            setNumOfPages(data.total_pages);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchSearchMovie();
    })

    return (
        <div className="Search">
            {content && content.map((data) => {
                return <SingleContent data={data} key={data.id} type={type==='tv' ? 'tv' : 'movie'} />
            })}
            {numOfPages > 1 && (
                <CustomPagination setPage={setPage} numOfPages={numOfPages} />
            )}
        </div>
    )
}
