
import "./Carousel.css";
import { useState } from "react";
import Slider from "react-slick";


export const Carousel = ({Icons}) => {
  // const NextArrow = ({ onClick }) => {
  //   return (
  //     <div className="arrow next" onClick={onClick}>
  //       <FaArrowRight />
  //     </div>
  //   );
  // };

  // const PrevArrow = ({ onClick }) => {
  //   return (
  //     <div className="arrow prev" onClick={onClick}>
  //       <FaArrowLeft />
  //     </div>
  //   );
  // };

  const [imageIndex, setImageIndex] = useState(0);

  const settings = {
    infinite: true,
    lazyLoad: true,
    speed: 300,
    slidesToShow: 5,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: 0,
    beforeChange: (current, next) => setImageIndex(next),
    autoplay: true,  // Enable auto scroll
    autoplaySpeed: 1000,  // Set delay to 2 seconds
    pauseOnHover: false,  // Pause on hover
    arrows: false,  // Disable next/prev arrows
    responsive: [
      {
        breakpoint: 768,  // For mobile devices
        settings: {
          slidesToShow: 3,  // Show 3 slides on mobile
        },
      },
      {
        breakpoint: 1024,  // For tablet and below desktop
        settings: {
          slidesToShow: 5,  // Show 5 slides on larger screens
        },
      },
    ],
  };
  


  return (
    <div>
      <Slider {...settings}>
        {Icons.map((img, idx) => (
          <div key={idx} className={idx === imageIndex ? "slide activeSlide" : "slide"}>
            <img src={img.imgs} alt={img} />
          </div>
        ))}
      </Slider>
    </div>
  );
}

