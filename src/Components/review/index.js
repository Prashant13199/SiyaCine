import React, { useState } from 'react'
import { useTheme } from '@mui/material'

export default function Review({ review }) {
    const [readMore, setReadMore] = useState(false)
    const theme = useTheme()
    return (
        <div style={{ fontSize: '14px', marginTop: '5px' }}>{review?.length > 200 && !readMore ? review.substring(0, 200).concat('...') : review}
            <span className='readmore' style={{ color: theme.palette.warning.main }} onClick={() => setReadMore(!readMore)}>{review && review?.length > 200 && (!readMore ? 'read more.' : 'Less')}</span></div>
    )
}
