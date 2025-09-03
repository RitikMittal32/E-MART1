import "./Carousel.css";
import { useState } from "react";
import Slider from "react-slick";

const Carousel = ({ Icons }) => {
  const [imageIndex, setImageIndex] = useState(0);

  const settings = {
    infinite: true,
    lazyLoad: true,
    speed: 300,
    slidesToShow: 5,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: 0,
    beforeChange: (_, next) => setImageIndex(next),
    autoplay: true,
    autoplaySpeed: 1000,
    pauseOnHover: false,
    arrows: false,
    responsive: [
      {
        breakpoint: 768,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 1024,
        settings: { slidesToShow: 5 },
      },
    ],
  };

  return (
    <div>
      <Slider {...settings}>
        {Icons.map((img, idx) => (
          <div
            key={idx}
            className={idx === imageIndex ? "slide activeSlide" : "slide"}
          >
            <img src={img.imgs} alt={img} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel; 