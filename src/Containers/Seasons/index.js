import React, { useEffect, useState } from 'react'
import './style.css';
import axios from 'axios';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import empty from '../../assets/empty.png';

export default function Seasons({ value }) {

    const [content, setContent] = useState([])
    const [seasonNumber, setSeasonNumber] = useState(1)

    useEffect(() => {
        fetchDetails()
    }, [seasonNumber])

    const fetchDetails = async () => {
        setContent([])
        try {
            const { data } = await axios.get(
                `https://api.themoviedb.org/3/tv/${value?.id}/season/${seasonNumber}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
            );
            setContent(data);
        }
        catch (e) {
            console.log(e)
        }
    };

    return (
        <>
            <div className='play_buttons'>
                <DropdownButton
                    variant="warning"
                    title={`Season ${seasonNumber}`}
                    className="seasons_button"
                >
                    {value.seasons?.map((dat, index) => {
                        return (
                            <Dropdown.Item key={index} onClick={(e) => setSeasonNumber(e.target.text)} eventKey={index} className='dropdown_item'>
                                {index + 1}
                            </Dropdown.Item>
                        )
                    })}
                </DropdownButton>
            </div>
            <div className="episode_list">
                {content?.episodes?.map((datas) => {
                    return <div key={datas?.id} id={`${seasonNumber}${datas?.episode_number}`} className='single_episode'>
                        <div className='episode_header'>
                            <div className='episode_number'>S{datas.season_number} E{datas.episode_number}</div>
                            <div className='air_date'>{datas?.air_date}</div>
                        </div>
                        <div className='relative'>
                            <img alt="" src={datas.still_path ? `https://image.tmdb.org/t/p/w500/${datas.still_path}` : "https://www.movienewz.com/img/films/poster-holder.jpg"} className='single_episode_image' />
                        </div>
                        <div className="episode_name">
                            {datas?.name?.length > 55 ? datas?.name?.substring(0, 55)?.concat('...') : datas?.name}
                        </div>
                    </div>
                })}
            </div>
            {content?.length === 0 && <center>
                <img src={empty} className='empty_series' alt="" />
                <h6 style={{ color: 'gray' }}>No shows available</h6></center>}
        </>
    )
}
