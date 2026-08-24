import React, { createContext, useState } from 'react';

export const PlayerContext = createContext();

export default function PlayerProvider(props) {

    const [url, setUrl] = useState('');
    const [type, setType] = useState('');
    const [name, setName] = useState('');

    const handleSetUrl = (link) => {
        setUrl(link)
    }

    const handleSetType = (type) => {
        setType(type)
    }

    const handleSetName = (name) => {
        setName(name)
    }

    return (
        <PlayerContext.Provider value={{ handleSetUrl, handleSetType, handleSetName, url, type, name }}>
            {props.children}
        </PlayerContext.Provider>
    );
}