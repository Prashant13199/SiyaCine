import React, { useEffect, useState } from 'react';
import './style.css';
import axios from 'axios';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { auth, database } from '../../firebase';
import { Modal } from 'react-bootstrap';
import CloseIcon from '@mui/icons-material/Close';
import { Button, ButtonGroup, IconButton } from '@mui/material';
import { useTheme } from '@mui/material';
import empty from '../../assets/empty.png';

export default function Seasons({ value, watchlist, setWatchlist, watched, setWatched }) {

    const theme = useTheme()

    const [content, setContent] = useState([])
    const [seasonNumber, setSeasonNumber] = useState(1)
    const [episodeNumber, setEpisodeNumber] = useState()
    const [lastPlayed, setLastPlayed] = useState({})
    const [totalEpisodes, setTotalEpisodes] = useState(0)
    const [premium, setPremium] = useState(false)
    const [server, setServer] = useState(1)

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
        database.ref(`/Users/${auth?.currentUser?.uid}/premium`).on('value', snapshot => {
            setPremium(snapshot.val())
        })
    }, [auth?.currentUser?.uid])

    const fetchDetails = async () => {
        setContent([])
        try {
            const { data } = await axios.get(
                `https://api.themoviedb.org/3/tv/${value?.id}/season/${seasonNumber}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
            );
            setContent(data);
            setTotalEpisodes(data?.episodes?.length)
        }
        catch (e) {
            console.log(e)
        }
    };

    const handleNext = () => {
        setEpisodeNumber(episodeNumber + 1)
        handleResume(episodeNumber + 1)
    }

    const handlePrevious = () => {
        setEpisodeNumber(episodeNumber - 1)
        handleResume(episodeNumber - 1)
    }

    return (
        <>
            <Modal show={show4} onHide={handleClose4} fullscreen>
                <Modal.Body style={{ backgroundColor: theme.palette.background.default, maxHeight: window.innerHeight }}>
                    <div className='player_header'>
                        <div className='player_name'>{value.name || value.title || value.original_name} S{seasonNumber}-E{episodeNumber}</div>
                        <IconButton onClick={() => handleClose4()}><CloseIcon className="close_icon" /></IconButton>
                    </div>
                    {server === 1 && <iframe title={value.name || value.title || value.original_name} allowFullScreen style={{ width: "100%", height: window.innerHeight - 125 }} scrolling="no" src={`https://vidsrc.cc/v2/embed/tv/${value?.id}/${seasonNumber}/${episodeNumber}`}></iframe>}
                    {server === 2 && <iframe title={value.name || value.title || value.original_name} allowFullScreen style={{ width: "100%", height: window.innerHeight - 125 }} scrolling="no" src={`https://multiembed.mov/directstream.php?video_id=${value?.id}&tmdb=1&s=${seasonNumber}&e=${episodeNumber}`}></iframe>}
                    <div className='player_bottom'>
                        <Button color='warning' disabled={episodeNumber == 1} onClick={() => handlePrevious()}>Previous</Button>
                        <ButtonGroup variant="outlined" size="small" color="warning">
                            <Button variant={server === 1 && 'contained'} onClick={() => setServer(1)}>Server 1</Button>
                            <Button variant={server === 2 && 'contained'} onClick={() => setServer(2)}>Server 2</Button>
                        </ButtonGroup>
                        <Button color='warning' disabled={episodeNumber === totalEpisodes} onClick={() => handleNext()}>Next</Button>
                    </div>
                </Modal.Body>
            </Modal>
            <div className='season_button'>
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
                {lastPlayed?.episode && <Button style={{ color: 'rgb(255, 167, 38)', marginLeft: '5px' }} onClick={() => handleShow4(lastPlayed?.episode)}>Resume Playing S{lastPlayed?.season}E{lastPlayed?.episode}</Button>}
            </div>
            <div className="episode_list">
                {content?.episodes?.map((datas) => {
                    return <div key={datas?.id} id={`${seasonNumber}${datas?.episode_number}`} className='single_episode' onClick={() => {
                        if (auth?.currentUser?.uid && premium) {
                            handleShow4(datas?.episode_number)
                        }
                    }}>
                        <div className='episode_header'>
                            <div className='episode_number'>S{datas.season_number}-E{datas.episode_number}</div>
                            <div className='air_date'>{datas?.air_date}</div>
                        </div>
                        <div className='relative'>
                            <img alt="" src={datas.still_path ? `https://image.tmdb.org/t/p/w500/${datas.still_path}` : "https://www.movienewz.com/img/films/poster-holder.jpg"} className='single_episode_image' />
                        </div>
                        <div className="episode_name">
                            {datas?.name?.length > 100 ? datas?.name?.substring(0, 100)?.concat('...') : datas?.name}
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
