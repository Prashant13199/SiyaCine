import './style.css'
import { useHistory } from 'react-router-dom'
import Grid from '@mui/material/Unstable_Grid2';
import { Tooltip } from '@mui/material';
import { database } from '../../firebase';

export default function SingleContent({ data, setURL }) {

    const history = useHistory()

    const handleStoreSearched = () => {
        database.ref(`/Searched/${data?.id}`).update({
            data: data, timestamp: Date.now()
        }).catch((e) => console.log(e))
    }

    return (
        <Tooltip placement='top' title={data?.title || data?.name}>
            <Grid xs={2} sm={4} md={4} key={data.id}>
                <div className='postersearch'>
                    <img
                        loading='lazy'
                        onError={({ currentTarget }) => {
                            currentTarget.onerror = null;
                            currentTarget.src = "https://moviereelist.com/wp-content/uploads/2019/07/poster-placeholder.jpg";
                        }}
                        src={data?.poster_path ? `https://image.tmdb.org/t/p/w342/${data?.poster_path}` : "https://moviereelist.com/wp-content/uploads/2019/07/poster-placeholder.jpg"}
                        alt={data?.title || data?.name}
                        className="search_img"
                        onClick={() => {
                            setURL && setURL()
                            handleStoreSearched()
                            history.push(`/singlecontent/${data.id}/${data.media_type}`)
                        }}
                    />
                </div>
            </Grid>
        </Tooltip>
    )
}
