import { useContext } from 'react';
import './style.css';
import { PlayerContext } from '../../Services/PlayerContext';

export default function Live() {

    const { handleSetUrl, handleSetType, handleSetName } = useContext(PlayerContext);

    const data = [
        { id: 1, name: "Aaj Tak", url: "https://www.youtube.com/live/Nq2wYlWFucg", photo: "https://i3.ytimg.com/vi/Nq2wYlWFucg/maxresdefault.jpg" },
        { id: 2, name: "India TV", url: "https://www.youtube.com/watch?v=YIkoXVyVOSI", photo: "https://i3.ytimg.com/vi/YIkoXVyVOSI/maxresdefault.jpg" },
        { id: 3, name: "NDTV", url: "https://www.youtube.com/watch?v=8ZqHaMASZd8", photo: "https://i3.ytimg.com/vi/8ZqHaMASZd8/maxresdefault.jpg" },
        { id: 4, name: "Pop Music", url: "https://www.youtube.com/watch?v=3MOrgUjiigE", photo: "https://i3.ytimg.com/vi/3MOrgUjiigE/maxresdefault.jpg" },
        { id: 5, name: "Lofi Mashup", url: "https://www.youtube.com/watch?v=2RGXX8QQk8g", photo: "https://i3.ytimg.com/vi/2RGXX8QQk8g/maxresdefault.jpg" },
        { id: 6, name: "Summer Mix", url: "https://www.youtube.com/watch?v=dnpRUk2be84", photo: "https://i3.ytimg.com/vi/dnpRUk2be84/maxresdefault.jpg" },
        { id: 7, name: "Tom & Jerry", url: "https://www.youtube.com/watch?v=rEKifG2XUZg", photo: "https://i3.ytimg.com/vi/rEKifG2XUZg/maxresdefault.jpg" },
        { id: 8, name: "Oggy and the Cockroaches", url: "https://www.youtube.com/watch?v=1R8767hzeLk", photo: "https://i3.ytimg.com/vi/1R8767hzeLk/maxresdefault.jpg" },
        { id: 9, name: "Harry Potter", url: "https://www.youtube.com/watch?v=JSVny7yLc3s", photo: "https://i3.ytimg.com/vi/JSVny7yLc3s/maxresdefault.jpg" },
        { id: 10, name: "The Office", url: "https://www.youtube.com/watch?v=AJmaVPfyudQ", photo: "https://i3.ytimg.com/vi/AJmaVPfyudQ/maxresdefault.jpg" }
    ]

    return (
        <>
            <div className='trending_scroll'>
                {data?.map((item) => {
                    return <img key={item.id} src={item.photo} className='livetv_image' onClick={() => {
                        handleSetName(item.name);
                        handleSetUrl(item.url);
                        handleSetType("live");
                    }} />
                })}
            </div>
        </>
    )
}
