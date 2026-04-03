import './style.css';

import useFetchContent from '../../hooks/useFetchContent';
import useEmblaCarousel from 'embla-carousel-react'
import ClassNames from 'embla-carousel-class-names'
import SingleSlide from '../../Components/SingleSlide/SingleSlide';

export default function Header() {

  const [emblaRef] = useEmblaCarousel({}, [ClassNames()])

  const nowPlaying = useFetchContent('now_playing', 'movie')

  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {nowPlaying?.map((data, index) => (
            <SingleSlide data={data} index={index} />
          ))}
        </div>
      </div>
    </div>
  )
}
