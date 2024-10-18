import './style.css'
import { Link } from 'react-router-dom'
import Grid from '@mui/material/Unstable_Grid2';
import { useEffect, useState } from 'react';
import { database, auth } from '../../firebase';
import LockIcon from '@mui/icons-material/Lock';

export default function User({ user }) {

  const [publicAcc, setPublicAcc] = useState(true)
  const [admin, setAdmin] = useState(false)

  useEffect(() => {
    database.ref(`/Users/${user?.uid}/public`).on('value', snapshot => {
      setPublicAcc(snapshot.val())
    })
  }, [user])

  useEffect(() => {
    database.ref(`/Users/${auth?.currentUser?.uid}/admin`).on('value', snapshot => {
      setAdmin(snapshot.val())
    })
  }, [auth?.currentUser?.uid])

  return (
    <Grid xs={2} sm={4} md={4} key={user.uid}>
      {(admin || publicAcc) ? <Link to={`/user/${user.uid}`} style={{ textDecoration: 'none' }}>
        <div className='single_user'>
          <img src={user?.photo ? user?.photo : "https://api.dicebear.com/8.x/fun-emoji/svg?seed=loading?size=96"} className={publicAcc ? "users_image" : 'users_image_faded'} />
          <div className='user_username'>
            {user.username.split('.')[0]?.length < 4 ? user.username?.split('@')[0] : user.username?.split('.')[0]}
          </div>
        </div>
      </Link>
        :
        <div className='single_user'>
          <img src={`${user?.photo}`} className={publicAcc ? "users_image" : 'users_image_faded'} />
          <div className='user_username'>
            {user.username.split('.')[0]?.length < 4 ? user.username?.split('@')[0] : user.username?.split('.')[0]}
          </div>
        </div>
      }
    </Grid>
  )
}
