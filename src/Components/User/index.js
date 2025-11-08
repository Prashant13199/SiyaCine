import './style.css'
import { Link } from 'react-router-dom'
import Grid from '@mui/material/Unstable_Grid2';
import { useEffect, useState } from 'react';
import { database } from '../../firebase';
import { timeDifference } from '../../Services/time';

export default function User({ user, index }) {

  const [lastActive, setLastActive] = useState()

  useEffect(() => {
    database.ref(`/Users/${user?.uid}`).on('value', snapshot => {
      setLastActive(snapshot.val().timestamp)
    })
  }, [user])

  return (
    <>
      <Grid xs={2} sm={4} md={4} key={user.uid}>
        <Link to={`/user/${user.uid}`} style={{ textDecoration: 'none' }}>
          <div className='single_user'>
            <img src={user?.photo} className={"users_image"} />
            <div className='user_username'>
              {user.username.split('.')[0]?.length < 4 ? user.username?.split('@')[0] : user.username?.split('.')[0]}
            </div>
            <div className='user_lastactive'>
              Last Active {timeDifference(new Date(), new Date(lastActive))}
            </div>
          </div>
        </Link>
      </Grid>
    </>
  )
}
