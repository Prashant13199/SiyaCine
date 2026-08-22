import React from 'react';
import './style.css';
import { Link } from 'react-router-dom/cjs/react-router-dom';

export default function Providers({ data, type }) {
    return (
        <Link to={`/singlecategory/provider/${type}/${data?.provider_name} ${type}/$$/${data?.provider_id}`}>
            <img src={`https://image.tmdb.org/t/p/w500/${data?.logo_path}`} className='provider' />
        </Link>
    )
}
