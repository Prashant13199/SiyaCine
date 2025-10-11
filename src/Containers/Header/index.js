import React, { useState } from 'react';
import './style.css';
import { Link } from 'react-router-dom';
import Carousel from 'react-bootstrap/Carousel';
import useFetchContent from '../../hooks/useFetchContent';

export default function Header() {

  const [index, setIndex] = useState(0);

  const nowPlaying = useFetchContent('now_playing', 'movie')

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel activeIndex={index} touch={true} onSelect={handleSelect} controls={false} indicators={true}>
      {nowPlaying?.map((data) => {
        return <Carousel.Item key={data?.id}>
          <Link to={`/singlecontent/${data?.id}/movie`} style={{ textDecoration: 'none' }}>
            <div className='welcome' style={{ backgroundImage: data?.length !== 0 ? `url(https://image.tmdb.org/t/p/original/${window.innerWidth > 900 ? data?.backdrop_path : data?.poster_path})` : 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(231,145,10,1) 0%, rgba(255,0,187,1) 100%)' }}>
              <div className='welcome_backdrop'>
                <Carousel.Caption>
                  <h3>{data?.title}</h3>
                  <p>{data?.overview.substring(0, 100).concat('...')}</p>
                </Carousel.Caption>
              </div>
            </div>
          </Link>
        </Carousel.Item>
      })}
    </Carousel>
  )
}
