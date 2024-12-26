import React, { useEffect, useState } from 'react';
import './style.css';
import axios from 'axios';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { auth, database } from '../../firebase';
import { Modal } from 'react-bootstrap';
import { Button, ButtonGroup, CircularProgress, IconButton } from '@mui/material';
import { useTheme } from '@mui/material';
import empty from '../../assets/empty.png';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getCurrentDate } from '../../Services/time';

export default function Seasons({ value, watchlist, setWatchlist, watched, setWatched, resumeSeries, setResumeSeries }) {

    const [content, setContent] = useState([])
    const [seasonNumber, setSeasonNumber] = useState(1)
    const [episodeNumber, setEpisodeNumber] = useState()
    const [lastPlayed, setLastPlayed] = useState({})
    const [totalEpisodes, setTotalEpisodes] = useState(0)
    const [premium, setPremium] = useState(false)
    const [server, setServer] = useState(1)
    const [played, setPlayed] = useState(false)
    const [show4, setShow4] = useState(false);
    const [loading, setLoading] = useState(true)

    const theme = useTheme()

    useEffect(() => {
        fetchDetails()
    }, [seasonNumber])

    useEffect(() => {
        if (lastPlayed && resumeSeries && !played) {
            handleEpisodeScroll()
            setSeasonNumber(lastPlayed?.season ? lastPlayed?.season : seasonNumber)
            handleShow4(lastPlayed?.episode ? lastPlayed?.episode : 1, lastPlayed?.season ? lastPlayed?.season : seasonNumber)
            setPlayed(true)
        }
    }, [lastPlayed, resumeSeries])

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

    const handleEpisodeScroll = () => {
        setTimeout(() => {
            document.getElementById(`${lastPlayed?.season}${lastPlayed?.episode}`)?.scrollIntoView({ behavior: "smooth", block: "center", inline: "start" })
        }, 250)
    }

    const handleClose4 = () => {
        setShow4(false)
        setEpisodeNumber()
        setResumeSeries(false)
        setPlayed(false)
        handleEpisodeScroll()
    }

    const handleShow4 = (episode, season) => {
        setShow4(true)
        setEpisodeNumber(episode)
        handleResume(episode, season)
    }

    const handleResume = (episode, season) => {
        database.ref(`/Users/${auth?.currentUser?.uid}/watching/${value?.id}`).set({
            id: value?.id, data: value, type: 'tv', season: season, episode: episode, timestamp: Date.now()
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

    const fetchDetails = async () => {
        setContent([])
        setLoading(true)
        try {
            const { data } = await axios.get(
                `https://api.themoviedb.org/3/tv/${value?.id}/season/${seasonNumber}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
            );
            setContent(data);
            setTotalEpisodes(data?.episodes?.length)
            setLoading(false)
        }
        catch (e) {
            console.log(e)
            setLoading(false)
        }
    };

    const handleNext = () => {
        setEpisodeNumber(episodeNumber + 1)
        handleResume(episodeNumber + 1, seasonNumber)
    }

    const handlePrevious = () => {
        setEpisodeNumber(episodeNumber - 1)
        handleResume(episodeNumber - 1, seasonNumber)
    }

    return (
        <>
            <Modal show={show4} onHide={handleClose4} fullscreen>
                <Modal.Body style={{ backgroundColor: theme.palette.background.default, maxHeight: window.innerHeight }}>
                    <div className='player_header'>
                        <IconButton onClick={() => handleClose4()}><ArrowBackIcon className="back_icon" /></IconButton>
                        <div className='player_name'>{value.name || value.title || value.original_name} S{seasonNumber}-E{episodeNumber}</div>
                    </div>
                    {server === 1 && <iframe title={value.name || value.title || value.original_name} allowFullScreen style={{ width: "100%", height: window.innerHeight - 125 }} scrolling="no" src={`https://vidbinge.dev/embed/tv/${value?.id}/${seasonNumber}/${episodeNumber}`}></iframe>}
                    {server === 2 && <iframe title={value.name || value.title || value.original_name} allowFullScreen style={{ width: "100%", height: window.innerHeight - 125 }} scrolling="no" src={`https://vidsrc.cc/v3/embed/tv/${value?.id}/${seasonNumber}/${episodeNumber}`}></iframe>}
                    <div className='player_bottom'>
                        <Button color='warning' disabled={episodeNumber == 1} onClick={() => handlePrevious()}>Previous</Button>
                        <Dropdown>
                            <Dropdown.Toggle variant="warning" className='servers_dropdown'>
                                Servers
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item style={{ backgroundColor: theme.palette.background.default }} className={server === 1 ? 'server_btn_selected' : 'server_btn'} onClick={() => setServer(1)}>Vid Binge</Dropdown.Item>
                                <Dropdown.Item style={{ backgroundColor: theme.palette.background.default }} className={server === 2 ? 'server_btn_selected' : 'server_btn'} onClick={() => setServer(2)}>VidSrc</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        <Button color='warning' disabled={(episodeNumber === totalEpisodes) || (episodeNumber && content?.episodes[episodeNumber]?.air_date >= getCurrentDate())} onClick={() => handleNext()}>Next</Button>
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
            </div>
            {!loading ? <div className="episode_list">
                {content?.episodes?.map((datas) => {
                    return <div key={datas?.id} id={`${seasonNumber}${datas?.episode_number}`} className={datas?.air_date <= getCurrentDate() ? 'single_episode' : 'single_episode_fade'} onClick={() => {
                        if (auth?.currentUser?.uid && premium && datas?.air_date <= getCurrentDate()) {
                            handleShow4(datas?.episode_number, seasonNumber)
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
                        {lastPlayed?.season === seasonNumber && lastPlayed?.episode === datas?.episode_number && <div className='playing'>Playing</div>}
                    </div>
                })}
            </div> :
                <div className="loading_episodes">
                    <CircularProgress color='warning' />
                </div>
            }
            {content?.length === 0 && !loading && <center>
                <img src={empty} className='empty_series' alt="" />
                <h6 style={{ color: 'gray' }}>No episode available</h6></center>}
        </>
    )
}
