import React, { useState } from 'react'
import './style.css';
import { Modal } from 'react-bootstrap';
import { IconButton } from '@mui/material';
import { useTheme } from '@mui/material';
import ReactPlayer from 'react-player';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function Live() {

    const theme = useTheme()
    const [vid, setVid] = useState('')
    const [show4, setShow4] = useState(false);
    const [name, setName] = useState('')

    const handleShow4 = () => {
        setShow4(true)
    }
    const handleClose4 = () => {
        setShow4(false)
        setVid('')
        setName('')
    }

    const data = [
        { name: "Aaj Tak", url: "https://www.youtube.com/watch?v=Nq2wYlWFucg", photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjkqUHAD7Q999Bgymec0r_DnSTkFjZQHtUMy5NB_cZhA&s=10" },
        { name: "India TV", url: "https://www.youtube.com/watch?v=YIkoXVyVOSI", photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6eNF9MNsMoeHyat5nOHFgBz1yB96KOcciqUyy-axIeg&s=10" },
        { name: "Pop Music", url: "https://www.youtube.com/watch?v=3MOrgUjiigE", photo: "https://i3.ytimg.com/vi/3MOrgUjiigE/maxresdefault.jpg" },
        { name: "Lofi Mashup", url: "https://www.youtube.com/watch?v=2RGXX8QQk8g", photo: "https://i3.ytimg.com/vi/2RGXX8QQk8g/maxresdefault.jpg" },
        { name: "Summer Mix", url: "https://www.youtube.com/watch?v=dnpRUk2be84", photo: "https://i3.ytimg.com/vi/dnpRUk2be84/maxresdefault.jpg" }
    ]

    return (
        <>
            <Modal show={show4} onHide={handleClose4} fullscreen>
                <Modal.Body style={{ backgroundColor: theme.palette.background.default }}>
                    <div className='player_header'>
                        <div className='flex'>
                            <IconButton onClick={() => handleClose4()}><ArrowBackIcon className="back_icon" /></IconButton>
                            <div>{name}</div>
                        </div>
                    </div>
                    <ReactPlayer url={vid} width={'100%'} height={window.innerHeight - 100} controls />
                </Modal.Body>
            </Modal>
            <div>
                {data?.map((item) => {
                    return <img src={item.photo} className='livetv_image' onClick={() => {
                        setName(item.name);
                        setVid(item.url);
                        handleShow4();
                    }} />
                })}
            </div>
        </>
    )
}
