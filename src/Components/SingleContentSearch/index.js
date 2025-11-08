import React, { useEffect, useState } from 'react'
import './style.css'
import { useHistory } from 'react-router-dom'
import Grid from '@mui/material/Unstable_Grid2';
import TvIcon from '@mui/icons-material/Tv';
import { Tooltip, Zoom } from '@mui/material';
import { database } from '../../firebase';
import axios from "axios";

export default function SingleContent({ data, index, id, type }) {

    const [watchprovider, setWatchProvider] = useState({})

    const history = useHistory()

    useEffect(() => {
        fetchProvider()
    }, [index])

    const fetchProvider = async () => {
        try {
            const { data } = await axios.get(
                `https://api.themoviedb.org/3/${type}/${id}/watch/providers?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
            );
            if (data.results?.IN?.flatrate) {
                setWatchProvider({ path: data.results?.IN?.flatrate[0] ? data.results?.IN?.flatrate[0]?.logo_path : '', link: data.results?.IN ? data.results?.IN?.link : '' });
            }
        }
        catch (e) {
            console.log(e)
        }
    };

    const handleStoreSearched = () => {
        database.ref(`/Searched/${data?.id}`).update({
            data: data, timestamp: Date.now()
        }).catch((e) => console.log(e))
    }

    return (
        <Tooltip placement='top' title={data?.title || data?.name}>
            <Grid xs={2} sm={4} md={4} key={data.id}>
                <div className='postersearch'>
                    <img
                        loading='lazy'
                        src={data?.poster_path ? `https://image.tmdb.org/t/p/w500/${data?.poster_path}` : "https://www.movienewz.com/img/films/poster-holder.jpg"}
                        alt={data?.title || data?.name}
                        className="search_img"
                        onClick={() => {
                            handleStoreSearched()
                            history.push(`/singlecontent/${data.id}/${data.media_type}`)
                        }}
                    />
                    {watchprovider && <div className='platform'><img alt="" src={`https://image.tmdb.org/t/p/w500/${watchprovider.path}`} className='platform_icon' /></div>}
                    {data.media_type === 'tv' && <div className='searchtv'><TvIcon sx={{ fontSize: '14px', color: 'rgb(255, 167, 38)' }} /></div>}
                </div>
            </Grid>
        </Tooltip>
    )
}
