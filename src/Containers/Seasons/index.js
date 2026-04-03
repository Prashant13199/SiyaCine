import { useEffect, useState } from 'react';
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

export default function Seasons({ value, watching, handleWatching }) {

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
    const [currentTime, setCurrentTime] = useState(0)
    const [progress, setProgress] = useState(0)

    const [dbSeason, setDbSeason] = useState(1)
    const [dbEpisode, setDbEpisode] = useState(1)

    const theme = useTheme()

    useEffect(() => {
        fetchDetails();
    }, [seasonNumber])

    useEffect(() => {
        handlePagination()
    }, [page, content])

    useEffect(() => {
        window.addEventListener("message", (event) => {
            console.log(event.data)
            if (event.origin !== "https://vidcore.net" && server !== 1) return;
            const { type, data } = event?.data;
            if (type === "PLAYER_EVENT") {
                setProgress(data.currentTime)
            }
            if (data?.event === "ended") {
                document.getElementById("next-button").click();
            }
        });
    }, [])

    useEffect(() => {
        database.ref(`/Users/${auth?.currentUser?.uid}/watching/${value?.id}`).once('value', snapshot => {
            if (snapshot.val()?.season && snapshot.val()?.episode) {
                setSeasonNumber(snapshot.val()?.season)
                setEpisodeNumber(snapshot.val()?.episode)
                setCurrentTime(snapshot.val()?.currentTime || 0)
                setDbSeason(snapshot.val()?.season)
                setDbEpisode(snapshot.val()?.episode)
            }
        })
        database.ref(`/Users/${auth?.currentUser?.uid}/premium`).once('value', snapshot => {
            setPremium(snapshot.val())
        })
    }, [auth?.currentUser?.uid, value])

    const handleClose4 = () => {
        setShow4(false)
        updateDB(episodeNumber, seasonNumber, progress)
    }

    const handleShow4 = (episode, season) => {
        handleWatching()
        if (dbSeason === season && dbEpisode === episode) {
            updateDB(episode, season, currentTime)
        } else {
            updateDB(episode, season, 0)
        }
        setShow4(true)
    }

    const updateDB = (episode, season, progress) => {
        database.ref(`/Users/${auth?.currentUser?.uid}/watching/${value?.id}`).update({
            id: value?.id, data: value, type: 'tv', season: season, episode: episode, timestamp: Date.now(), currentTime: progress
        }).then(() => {
            setSeasonNumber(season)
            setEpisodeNumber(episode)
            setDbSeason(season)
            setDbEpisode(episode)
            setCurrentTime(progress)
        }).catch((e) => console.log(e))
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
            setLoading(false);
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
        updateDB(episodeNumber + 1, seasonNumber, 0)
        handleMarkComplete()
    }

    const handlePrev = () => {
        setEpisodeNumber(episodeNumber - 1)
        updateDB(episodeNumber - 1, seasonNumber, 0)
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
                                {server === 1 && 'Server 1'}
                                {server === 2 && 'Server 2'}
                                {server === 3 && 'Server 3'}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item style={{ backgroundColor: theme.palette.background.default }} className={server === 1 ? 'server_btn_selected' : 'server_btn'} onClick={() => setServer(1)}>Server 1</Dropdown.Item>
                                <Dropdown.Item style={{ backgroundColor: theme.palette.background.default }} className={server === 2 ? 'server_btn_selected' : 'server_btn'} onClick={() => setServer(2)}>Server 2</Dropdown.Item>
                                <Dropdown.Item style={{ backgroundColor: theme.palette.background.default }} className={server === 3 ? 'server_btn_selected' : 'server_btn'} onClick={() => setServer(3)}>Server 3</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    {server === 1 && <iframe title={value.name || value.title || value.original_name} allowFullScreen style={{ width: "100%", height: window.innerHeight - 125 }} scrolling="no" src={`https://vidcore.net/tv/${value?.id}/${seasonNumber}/${episodeNumber}?autoPlay=true&startAt=${currentTime}&autoNext=false&nextButton=false&theme=FFA726&sub=en`}></iframe>}
                    {server === 2 && <iframe title={value.name || value.title || value.original_name} allowFullScreen style={{ width: "100%", height: window.innerHeight - 125 }} scrolling="no" src={`https://vidsrc.me/embed/tv/${value?.id}/${seasonNumber}/${episodeNumber}`}></iframe>}
                    {server === 3 && <iframe title={value.name || value.title || value.original_name} allowFullScreen style={{ width: "100%", height: window.innerHeight - 125 }} scrolling="no" src={`https://www.2embed.cc/embedtv/${value?.id}&s=${seasonNumber}&e=${episodeNumber}`}></iframe>}
                    <div className='player_bottom'>
                        <Button color='warning' onClick={handlePrev} disabled={episodeNumber === 1}>Prev</Button>
                        <Button color='warning' id="next-button" onClick={handleNext} disabled={episodeNumber === content?.episodes?.length}>Next</Button>
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
                            <Dropdown.Item key={index} onClick={(e) => setSeasonNumber(e.target.text)} className='dropdown_item'>
                                {index + 1}
                            </Dropdown.Item>
                        )
                    })}
                </DropdownButton>
                {watching && <Button variant='outlined' className='seriesResumeBtn' color='warning' onClick={() => {
                    handleShow4(dbEpisode, dbSeason)
                }}>Resume S{dbSeason}E{dbEpisode} {currentTime ? `${Math.floor(currentTime / 3600)}h${Math.floor((currentTime % 3600) / 60)}m` : '0h0m'}</Button>}
            </div>
            {!loading ?
                <>
                    <div className="episode_list" id="episode_list">
                        {paginatedData?.map((datas) => {
                            return <SingleEpisode id={value?.id} datas={datas} handleShow4={handleShow4} seasonNumber={seasonNumber} premium={premium} />
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
