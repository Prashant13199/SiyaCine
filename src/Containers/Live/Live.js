import { useContext } from 'react';
import './style.css';
import { PlayerContext } from '../../Services/PlayerContext';

export default function Live() {

    const { handleSetUrl, handleSetType, handleSetName } = useContext(PlayerContext);

    const data = [
        { id: 1, name: "Aaj Tak", url: "https://www.youtube.com/live/Nq2wYlWFucg", photo: "https://i3.ytimg.com/vi/Nq2wYlWFucg/maxresdefault.jpg", type: "live" },
        { id: 2, name: "India TV", url: "https://www.youtube.com/watch?v=YIkoXVyVOSI", photo: "https://i3.ytimg.com/vi/YIkoXVyVOSI/maxresdefault.jpg", type: "live" },
        { id: 3, name: "NDTV", url: "https://www.youtube.com/watch?v=8ZqHaMASZd8", photo: "https://i3.ytimg.com/vi/8ZqHaMASZd8/maxresdefault.jpg", type: "live" },
        { id: 4, name: "9xm", url: "https://da86m1sqpm3o0.cloudfront.net/28072023/smil:9xmusic4.smil/playlist.m3u8", photo: "https://www.9xm.in/images/video-cover.jpg", type: "live" },
        { id: 5, name: "Pop Music", url: "https://www.youtube.com/watch?v=3MOrgUjiigE", photo: "https://i3.ytimg.com/vi/3MOrgUjiigE/maxresdefault.jpg", type: "live" },
        { id: 6, name: "Lofi Mashup", url: "https://www.youtube.com/watch?v=2RGXX8QQk8g", photo: "https://i3.ytimg.com/vi/2RGXX8QQk8g/maxresdefault.jpg", type: "live" },
        { id: 7, name: "Summer Mix", url: "https://www.youtube.com/watch?v=dnpRUk2be84", photo: "https://i3.ytimg.com/vi/dnpRUk2be84/maxresdefault.jpg", type: "live" },
        { id: 8, name: "Tom & Jerry", url: "https://www.youtube.com/watch?v=rEKifG2XUZg", photo: "https://i3.ytimg.com/vi/rEKifG2XUZg/maxresdefault.jpg", type: "live" },
        { id: 9, name: "Oggy and the Cockroaches", url: "https://www.youtube.com/watch?v=1R8767hzeLk", photo: "https://i3.ytimg.com/vi/1R8767hzeLk/maxresdefault.jpg", type: "live" },
        { id: 10, name: "Harry Potter", url: "https://www.youtube.com/watch?v=JSVny7yLc3s", photo: "https://i3.ytimg.com/vi/JSVny7yLc3s/maxresdefault.jpg", type: "live" },
        { id: 11, name: "The Office", url: "https://www.youtube.com/watch?v=AJmaVPfyudQ", photo: "https://i3.ytimg.com/vi/AJmaVPfyudQ/maxresdefault.jpg", type: "live" }
    ]

    return (
        <>
            <div className='trending_scroll'>
                {data?.map((item) => {
                    return <img key={item.id} src={item.photo} className='livetv_image' onClick={() => {
                        handleSetName(item.name);
                        handleSetUrl(item.url);
                        handleSetType(item.type);
                    }} />
                })}
            </div>
        </>
    )
}
