import React, { useEffect, useState } from 'react'
import './style.css';
import axios from "axios";
import { useParams } from 'react-router-dom';
import SingleContent from '../../Components/SingleContent';
import CustomPagination from '../../Components/Pagination/CustomPagination';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { ThemeProvider, createTheme } from '@mui/material/styles';

export default function Search() {

    const darkTheme = createTheme({
        palette: {
          mode: 'dark',
        },
      });

    const [pageM, setPageM] = useState(1);
    const [contentM, setContentM] = useState([]);
    const [numOfPagesM, setNumOfPagesM] = useState();
    const [pageT, setPageT] = useState(1);
    const [contentT, setContentT] = useState([]);
    const [numOfPagesT, setNumOfPagesT] = useState();
    const { query } = useParams()
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const fetchSearchMovie = async () => {
        try {
            const { data } = await axios.get(
                `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_API_KEY
                }&language=en-US&query=${query}&page=${pageM}`
            );
            setContentM(data.results);
            setNumOfPagesM(data.total_pages);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchSearchTV = async () => {
        try {
            const { data } = await axios.get(
                `https://api.themoviedb.org/3/search/tv?api_key=${process.env.REACT_APP_API_KEY
                }&language=en-US&query=${query}&page=${pageT}`
            );
            setContentT(data.results);
            setNumOfPagesT(data.total_pages);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchSearchMovie();
        fetchSearchTV();
    }, [pageM, pageT])

    return (
        <div className="Search">
            <div className='searchresultfor'>Search results for</div>
            <div className='discover_movies_title'>{query}</div>
            <ThemeProvider theme={darkTheme}>
            <Tabs value={value} onChange={handleChange} centered>
                <Tab label="Movie" />
                <Tab label="TV" />
            </Tabs>
            </ThemeProvider>
            <br />
            {contentM && value === 0 && contentM.map((data) => {
                return <SingleContent data={data} key={data.id} type='movie' />
            })}
            {numOfPagesM > 1 && value === 0 && (
                <CustomPagination setPage={setPageM} numOfPages={numOfPagesM} />
            )}
            {contentM.length===0 && value === 0 && <h2 style={{ textAlign: 'center' }}><br /><br />pops... no movies found</h2>}
            {contentT && value === 1 && contentT.map((data) => {
                return <SingleContent data={data} key={data.id} type='tv' />
            })}
            {numOfPagesT > 1 && value === 1 && (
                <CustomPagination setPage={setPageT} numOfPages={numOfPagesT} />
            )}
            {contentT.length===0 && value === 1 && <h2 style={{ textAlign: 'center' }}><br /><br />pops... no tv series found</h2>}
        </div>
    )
}
