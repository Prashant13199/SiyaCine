import './style.css';
import useFetchContent from '../../hooks/useFetchContent';
import useEmblaCarousel from 'embla-carousel-react'
import ClassNames from 'embla-carousel-class-names'
import SingleSlide from '../../Components/SingleSlide/SingleSlide';
import Autoplay from 'embla-carousel-autoplay';

export default function Header() {

  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000 }), ClassNames()
  ])

  const nowPlaying = useFetchContent('upcoming', 'movie')

  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {nowPlaying?.map((data, index) => (
            <div className="embla__slide" key={index}>
              <div className="embla__slide__number">
                <SingleSlide key={data?.id} data={data} index={index} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
