import React, { useEffect, useState } from 'react'
import './style.css'
import axios from 'axios';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { auth, database } from '../../firebase'
import { Modal } from 'react-bootstrap';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import { useTheme } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import empty from '../../assets/empty.png'

export default function Seasons({ value, watchlist, setWatchlist, watched, setWatched }) {

    const theme = useTheme()

    const [content, setContent] = useState([])
    const [seasonNumber, setSeasonNumber] = useState(1)
    const [episodeNumber, setEpisodeNumber] = useState()
    const [lastPlayed, setLastPlayed] = useState({})

    const [show4, setShow4] = useState(false);
    const handleClose4 = () => {
        setShow4(false)
        setEpisodeNumber()
    }
    const handleShow4 = (number) => {
        setShow4(true)
        setEpisodeNumber(number)
        handleResume(number)
    }

    const handleResume = (number) => {
        database.ref(`/Users/${auth?.currentUser?.uid}/watching/${value?.id}`).set({
            id: value?.id, data: value, type: 'tv', season: seasonNumber, episode: number, timestamp: Date.now()
        }).then(() => {
            if (watchlist) {
                database.ref(`/Users/${auth?.currentUser?.uid}/watchlist/${value?.id}`).remove().then(() => {
                    setWatchlist(false)
                })
            }
            if (watched) {
                database.ref(`/Users/${auth?.currentUser?.uid}/watched/${value?.id}`).remove().then(() => {
                    setWatched(false)
                })
            }
        })
    }

    useEffect(() => {
        fetchDetails()
    }, [seasonNumber])

    useEffect(() => {
        database.ref(`/Users/${auth?.currentUser?.uid}/watching/${value?.id}`).on('value', snapshot => {
            if (snapshot.val()?.season && snapshot.val()?.episode) {
                setLastPlayed({ season: snapshot.val()?.season, episode: snapshot.val()?.episode })
                setSeasonNumber(snapshot.val()?.season)
            } else {
                setLastPlayed({})
            }
        })
    }, [])

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
            <Modal show={show4} onHide={handleClose4} fullscreen>
                <Modal.Body style={{ backgroundColor: theme.palette.background.default }}>
                    <IconButton onClick={() => handleClose4()} className='close_icon_button'><CloseIcon className="close_icon" /></IconButton>
                    <div className='padding40'>
                        <iframe allowFullScreen style={{ width: "100%", height: "100%" }} src={`https://www.2embed.cc/embedtv/${value?.id}&s=${seasonNumber}&e=${episodeNumber}`}></iframe>
                    </div>
                </Modal.Body>
            </Modal>
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
            <div className="episode_list">
                {content?.episodes?.map((datas) => {
                    return <div key={datas?.id} id="single_episode" className='single_episode' onClick={() => {
                        if (auth?.currentUser?.uid) {
                            handleShow4(datas?.episode_number)
                        }
                    }}>
                        <span className='episode_number'>S{datas.season_number} E{datas.episode_number}</span>
                        <div className='relative'>
                            <img alt="" src={datas.still_path ? `https://image.tmdb.org/t/p/w500/${datas.still_path}` : "https://www.movienewz.com/img/films/poster-holder.jpg"} className='single_episode_image' />
                            {auth?.currentUser?.uid && <div className="play_icon"><PlayArrowIcon sx={{ fontSize: '30px', color: 'rgb(255, 167, 38)' }} /></div>}
                        </div>
                        <div className="episode_name">
                            {datas?.name?.length > 55 ? datas?.name?.substring(0, 55)?.concat('...') : datas?.name}
                        </div>
                        {lastPlayed?.season === seasonNumber && lastPlayed?.episode === datas?.episode_number && <div className='playing'>Last Played</div>}
                    </div>
                })}
            </div>
            {content?.length === 0 && <center>
                <img src={empty} className='empty_series' alt="" />
                <h6 style={{ color: 'gray' }}>No shows available</h6></center>}
        </>
    )
}
