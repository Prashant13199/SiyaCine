import React, { useEffect, useState } from 'react';
import './style.css';
import axios from 'axios';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { auth, database } from '../../firebase';
import { Modal } from 'react-bootstrap';
import { Button, CircularProgress, IconButton } from '@mui/material';
import { useTheme } from '@mui/material';
import empty from '../../assets/empty.png';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SingleEpisode from '../../Components/SingleEpisode/SingleEpisode';
import CustomPagination from '../../Components/Pagination/CustomPagination';

export default function Seasons({ value }) {

    const [content, setContent] = useState([])
    const [seasonNumber, setSeasonNumber] = useState(1)
    const [episodeNumber, setEpisodeNumber] = useState(1)
    const [premium, setPremium] = useState(false)
    const [server, setServer] = useState(1)
    const [show4, setShow4] = useState(false);
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1);
    const [paginatedData, setPaginatedData] = useState([])
    const [perPage, setPerPage] = useState(25)
    const [numOfPages, setNumOfPages] = useState();
    const [resumeSeason, setResumeSeason] = useState(1)

    const theme = useTheme()

    useEffect(() => {
        fetchDetails()
    }, [seasonNumber, episodeNumber])

    useEffect(() => {
        handlePagination()
        setTimeout(() => {
            if (episodeNumber !== 1) {
                document.getElementById("episode_list")?.scroll({ left: resumeSeason === seasonNumber ? episodeNumber * 200 : 0, behavior: "smooth" })
            }
        }, 0);
    }, [page, content])

    useEffect(() => {
        database.ref(`/Users/${auth?.currentUser?.uid}/watching/${value?.id}`).on('value', snapshot => {
            if (snapshot.val()?.season && snapshot.val()?.episode) {
                setSeasonNumber(snapshot.val()?.season)
                setEpisodeNumber(snapshot.val()?.episode)
                setResumeSeason(snapshot.val()?.season)
            }
        })
        database.ref(`/Users/${auth?.currentUser?.uid}/premium`).on('value', snapshot => {
            setPremium(snapshot.val())
        })
    }, [auth?.currentUser?.uid])

    const handleClose4 = () => {
        setShow4(false)
        setEpisodeNumber()
    }

    const handleShow4 = (episode, season, id) => {
        setShow4(true)
        setEpisodeNumber(episode)
        handleResume(season, episode)
    }

    const handleResume = (season, episode) => {
        database.ref(`/Users/${auth?.currentUser?.uid}/watching/${value?.id}`).set({
            id: value?.id, data: value, type: 'tv', season: season, episode: episode, timestamp: Date.now()
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
            setNumOfPages(Math.ceil(data?.episodes?.length / perPage));
            setLoading(false)
        }
        catch (e) {
            console.log(e)
            setLoading(false)
        }
    };

    const handlePagination = () => {
        let start = (perPage * (page - 1))
        let end = (start + perPage)
        setPaginatedData(content?.episodes?.slice(start, end))
    }

    const handleNext = () => {
        setEpisodeNumber(episodeNumber + 1)
        handleMarkComplete()
    }

    const handlePrev = () => {
        setEpisodeNumber(episodeNumber - 1)
    }

    const handleMarkComplete = () => {
        database.ref(`/Users/${auth?.currentUser?.uid}/watched/series/${content?.episodes[episodeNumber - 1]?.id}`).update(({
            id: content?.episodes[episodeNumber - 1]?.id,
            timestamp: Date.now()
        })).catch((e) => console.log(e))
    }

    return (
        <>
            <Modal show={show4} onHide={handleClose4} fullscreen>
                <Modal.Body style={{ backgroundColor: theme.palette.background.default, maxHeight: window.innerHeight }}>
                    <div className='player_header'>
                        <div className='flex'>
                            <IconButton onClick={() => handleClose4()}><ArrowBackIcon className="back_icon" /></IconButton>
                            <div className='player_name'>{value.name || value.title || value.original_name} S{seasonNumber}-E{episodeNumber}</div>
                        </div>
                        <Dropdown>
                            <Dropdown.Toggle variant="secondary" size="sm">
                                {server === 1 && 'VidSrc'}
                                {server === 2 && '2 embed'}
                                {server === 3 && 'SuperEmbed'}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item style={{ backgroundColor: theme.palette.background.default }} className={server === 1 ? 'server_btn_selected' : 'server_btn'} onClick={() => setServer(1)}>VidSrc</Dropdown.Item>
                                <Dropdown.Item style={{ backgroundColor: theme.palette.background.default }} className={server === 2 ? 'server_btn_selected' : 'server_btn'} onClick={() => setServer(2)}>2 embed</Dropdown.Item>
                                <Dropdown.Item style={{ backgroundColor: theme.palette.background.default }} className={server === 3 ? 'server_btn_selected' : 'server_btn'} onClick={() => setServer(3)}>SuperEmbed</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    {server === 1 && <iframe title={value.name || value.title || value.original_name} allowFullScreen style={{ width: "100%", height: window.innerHeight - 125 }} scrolling="no" src={`https://vidsrc.me/embed/tv/${value?.id}/${seasonNumber}/${episodeNumber}`}></iframe>}
                    {server === 2 && <iframe title={value.name || value.title || value.original_name} allowFullScreen style={{ width: "100%", height: window.innerHeight - 125 }} scrolling="no" src={`https://www.2embed.cc/embedtv/${value?.id}&s=${seasonNumber}&e=${episodeNumber}`}></iframe>}
                    {server === 3 && <iframe title={value.name || value.title || value.original_name} allowFullScreen style={{ width: "100%", height: window.innerHeight - 125 }} scrolling="no" src={`https://multiembed.mov/?video_id=${value?.id}&tmdb=1&s=${seasonNumber}&e=${episodeNumber}`}></iframe>}
                    <div className='player_bottom'>
                        <Button color='warning' onClick={handlePrev} disabled={episodeNumber === 1}>Prev</Button>
                        <Button color='warning' onClick={handleNext} disabled={episodeNumber === content?.episodes?.length}>Next</Button>
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
            {!loading ?
                <>
                    <div className="episode_list" id="episode_list">
                        {paginatedData?.map((datas) => {
                            return <SingleEpisode datas={datas} handleShow4={handleShow4} seasonNumber={seasonNumber} premium={premium} />
                        })}
                    </div>
                    <>
                        {numOfPages > 1 && (
                            <CustomPagination setPage={setPage} page={page} numOfPages={numOfPages} />
                        )}
                    </>
                </>
                :
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
