import React, { useEffect, useState } from 'react'
import useFetchUserDetails from '../../hooks/useFetchUserDetails'
import { auth, database } from '../../firebase'
import { Modal } from 'react-bootstrap';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton, TextField, Button } from '@mui/material';
import { useTheme } from '@mui/material';
import './style.css'

export default function ShareUser({ user, index, setMessage, setSnackBar, id, data, type, handleClose2 }) {

    const [connected, setConnected] = useState(false)
    const [show, setShow] = useState(false);

    const currentUsername = useFetchUserDetails(auth?.currentUser?.uid, 'username')
    const connectID = [auth?.currentUser?.uid, user.uid].sort().join(':')
    const [comment, setComment] = useState('')

    const handleClose = () => {
        setShow(false);
        setComment('');
    };
    const handleShow = () => setShow(true);
    const theme = useTheme()

    useEffect(() => {
        database.ref(`/Connections/${connectID}/connected`).on('value', snapshot => {
            if (snapshot.val()) {
                setConnected(true)
            } else {
                setConnected(false)
            }
        })
    }, [])

    const handleSend = (user, name) => {
        database.ref(`/Users/${user}/suggestions/${id}`).update({
            type: type,
            data: data,
            id: id,
            by: currentUsername,
            byuid: auth?.currentUser?.uid,
            timestamp: Date.now(),
            comment: comment
        }).then(() => {
            database.ref(`/Users/${user}/notifications/${id}`).update({
                timestamp: Date.now(),
                by: currentUsername,
                byuid: auth?.currentUser?.uid,
                id: id,
                text: `${currentUsername} suggested you to watch ${data.name || data.title || data.original_name}`,
                type: type,
                poster: data.poster_path
            })
            setComment('')
            handleClose2()
            setMessage(`Suggested to ${name?.split('@')[0]}`)
            setSnackBar(true)
        }).catch((e) => { console.log(e) })
    }

    return connected && (
        <>
            <Modal size='md' show={show} onHide={handleClose} centered>
                <Modal.Body style={{ backgroundColor: theme.palette.background.default }}>
                    <IconButton onClick={() => handleClose()} style={{ position: 'absolute', top: 0, right: 0 }}><CloseIcon style={{ color: 'red' }} /></IconButton>
                    <div>Suggesting to <span className='suggestionUsername'>{user.username}</span></div>
                    <div style={{ margin: '10px 0px' }}>
                        <TextField
                            fullWidth
                            id="standard-multiline-static"
                            label="Add your comment here (optional)"
                            multiline
                            rows={5}
                            variant="standard"
                            color='warning'
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </div>
                    <Button fullWidth color='warning' variant="contained" onClick={() => handleSend(user.uid, user.username)}>Send suggestion</Button>
                </Modal.Body>
            </Modal>

            <div key={index} className='share_user' onClick={() => {
                handleShow()
            }}>
                <div>
                    <img src={user.photo} className="share_user_image" />
                </div>
                <div className='share_user_username'>
                    {user.username.split('@')[0]}
                </div>
            </div>
        </>
    )
}
