import './style.css';
import SingleSlide from '../../Components/SingleSlide/SingleSlide';
import { RecommendContext } from '../../Services/RecommendContext';
import { useContext } from 'react';

export default function Header() {

  const { nowPlaying } = useContext(RecommendContext);

  return (
    <div className="slider-container">
      <div className="slider-track">
        {nowPlaying?.map((data, index) => (
          <div key={index}>
            <SingleSlide key={data?.id} data={data} index={index} />
          </div>
        ))}
      </div>
    </div>
  )
}
