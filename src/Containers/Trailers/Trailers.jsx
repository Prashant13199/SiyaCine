import React, { useState } from 'react';
import './style.css';
import { Modal } from 'react-bootstrap';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import { useTheme } from '@mui/material';
import ReactPlayer from 'react-player';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function Trailers({ data }) {

    const theme = useTheme()
    const [vid, setVid] = useState('')
    const [show4, setShow4] = useState(false);
    const handleShow4 = () => {
        setShow4(true)
    }
    const handleClose4 = () => {
        setShow4(false)
        setVid('')
    }

    return (
        <>
            <Modal show={show4} onHide={handleClose4} fullscreen>
                <Modal.Body style={{ backgroundColor: theme.palette.background.default }}>
                    <div className='player_header'>
                        <IconButton onClick={() => handleClose4()}><ArrowBackIcon className="back_icon" /></IconButton>
                        <div>{data?.name || data?.title || data?.original_name} Trailer</div>
                    </div>
                    <ReactPlayer url={`https://www.youtube.com/watch?v=${vid}`} width={'100%'} height={window.innerHeight - 100} controls />
                </Modal.Body>
            </Modal>
            <div className="trailer_list">
                {data?.map((datas) => {
                    return <div key={datas?.id} className='single_episode' onClick={() => {
                        setVid(datas.key)
                        handleShow4()
                    }}>
                        <div className='relative'>
                            <img alt="" src={datas.key ? `https://img.youtube.com/vi/${datas.key}/maxresdefault.jpg` : "https://www.movienewz.com/img/films/poster-holder.jpg"} className='single_episode_image' />
                        </div >
                        <div className="episode_name">
                            {datas?.name?.length > 100 ? datas?.name?.substring(0, 100)?.concat('...') : datas?.name}
                        </div>
                    </div>
                })}
            </div >
        </>
    )
}
