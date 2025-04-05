import React, { useEffect, useState } from 'react'
import { getCurrentDate } from '../../Services/time'
import { auth, database } from '../../firebase'
import { IconButton } from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import './style.css';

export default function SingleEpisode({ datas, handleShow4, premium, seasonNumber }) {

    const [watchedEpisode, setWatchedEpisode] = useState(false)

    useEffect(() => {
        database.ref(`/Users/${auth?.currentUser?.uid}/watched/series/${datas?.id}`).on('value', snapshot => {
            if (snapshot?.val()) {
                setWatchedEpisode(true)
            } else {
                setWatchedEpisode(false)
            }
        })
    }, [datas, seasonNumber])

    const handleWatchedEpisode = () => {
        if (watchedEpisode) {
            database.ref(`/Users/${auth?.currentUser?.uid}/watched/series/${datas?.id}`).remove().then(() => {
                setWatchedEpisode(false)
            }).catch((e) => console.log(e))
        } else {
            database.ref(`/Users/${auth?.currentUser?.uid}/watched/series/${datas?.id}`).update(({
                id: datas?.id,
                timestamp: Date.now()
            })).then(() => {
                setWatchedEpisode(true)
            }).catch((e) => console.log(e))
        }
    }

    return (
        <div key={datas?.id} id={`${seasonNumber}${datas?.episode_number}`} className={datas?.air_date <= getCurrentDate() ? 'single_episode' : 'single_episode_fade'}>
            <div className='episode_header'>
                <div className='episode_number'>S{datas.season_number}-E{datas.episode_number}</div>
                <div className='air_date'>{datas?.air_date}</div>
                <IconButton onClick={handleWatchedEpisode}>{watchedEpisode ? <CheckCircleOutlineIcon color="warning" /> : <CheckCircleOutlineIcon />}</IconButton>
            </div>
            <div className='relative' onClick={() => {
                if (auth?.currentUser?.uid && premium && datas?.air_date <= getCurrentDate()) {
                    handleShow4(datas?.episode_number, seasonNumber)
                }
            }}>
                <img alt="" src={datas.still_path ? `https://image.tmdb.org/t/p/w500/${datas.still_path}` : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZloANkq34iji2rYsX6MRnvKxRauEujYNJ3_WlwOeWSksm7XJBTmHwOJg6pdcsDFUeG3M&usqp=CAU"} className='single_episode_image' />
            </div>
            <div className="episode_name">
                {datas?.name?.length > 100 ? datas?.name?.substring(0, 100)?.concat('...') : datas?.name}
            </div>
        </div>
    )
}
