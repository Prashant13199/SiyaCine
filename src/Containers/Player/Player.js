import { IconButton } from '@mui/material';
import ReactPlayer from 'react-player';
import { PlayerContext } from '../../Services/PlayerContext';
import { useContext, useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import RemoveIcon from '@mui/icons-material/Remove';
import './style.css';
import wave from '../../assets/wave.gif'

export default function Player() {

    const { handleSetUrl, handleSetType, handleSetName, url, type, name } = useContext(PlayerContext);

    const [mini, setMini] = useState(false);

    useEffect(() => {
        setMini(false)
    }, [url])

    const handleClose4 = () => {
        handleSetUrl('');
        handleSetType('');
        handleSetName('');
    }

    const maximize = () => {
        setMini(!mini)
    }

    return url && (
        <>
            <div className='player'>
                {!mini && <div className='player_header'>
                    <div className='flex'>
                        <IconButton onClick={() => handleClose4()}><CloseIcon className="back_icon" /></IconButton>
                        <IconButton onClick={() => maximize()}><RemoveIcon className="back_icon" /></IconButton>
                        <div>{name}</div>
                    </div>
                </div>}
                {type === "live" && <ReactPlayer height={mini ? "0px" : "95vh"} width={mini ? '0px' : "100vw"} controls url={url} />}
            </div>
            {mini && <div className='miniPlayerContainer'>
                <div className='mini_player' >
                    <span onClick={() => maximize()}>
                        <img src={wave} className='waveIcon' />
                        &nbsp;Streaming {name}
                    </span>
                    &nbsp;
                    <CloseIcon onClick={() => handleClose4()} />
                </div>

            </div>}
        </>
    )
}
