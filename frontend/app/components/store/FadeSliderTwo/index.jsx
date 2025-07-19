import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const FadeSlider = (props) => {
  const {
    dots,
    infinite,
    speed,
    slidesToShow,
    slidesToScroll,
    fade,
    autoplay,
    autoplaySpeed,
    children,
    nextArrow,
    prevArrow,
    arrows,
    swipeToSlide
  } = props;

  return (
    <Slider
      dots={dots}
      infinite={infinite}
      speed={speed}
      slidesToShow={slidesToShow}
      slidesToScroll={slidesToScroll}
      fade={fade}
      autoplay={autoplay}
      autoPlaySpeed={autoplaySpeed}
      nextArrow={nextArrow}
      prevArrow={prevArrow}
      arrows={arrows}
      swipeToSlide={swipeToSlide}
      touchThreshold={10}
    >
      {children}
    </Slider>
  )
}

export default FadeSlider;