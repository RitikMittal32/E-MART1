import React, { useState, useEffect } from 'react';
import './HeroBanner.css';
import SearchInput from '../components/Form/SearchInput';


export const HeroBanner = () => {
  const images = [
    'banner/image-1.jpeg',
    'banner/image-2.jpeg',
    'banner/image-3.jpeg',
    'banner/image-4.jpeg',
    // Add more image URLs here
  ];

  const [randomImage, setRandomImage] = useState('');

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * images.length);
    setRandomImage(images[randomIndex]);
  }, []);

  return (
    <div 
      className="hero-banner" 
      style={{ backgroundImage: `url(${randomImage})` }}
    >
      <div className="hero-content">
        <h1>Shop the Latest Trends</h1>
        <p>Exclusive collections just for you!</p>
        <div className="search"><SearchInput /></div>
      </div>
    </div>
  );
};

// export default HeroBanner;
