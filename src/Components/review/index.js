import React, { useState } from 'react'

export default function Review({ review }) {
    const [readMore, setReadMore] = useState(false)
    return (
        <div style={{ fontSize: '14px',marginTop: '5px' }}>{review?.length > 200 && !readMore ? review.substring(0, 200).concat('...') : review}
            <span className='readmore' onClick={() => setReadMore(!readMore)}>{review && (!readMore ? 'read more.' : 'Less')}</span></div>
    )
}
