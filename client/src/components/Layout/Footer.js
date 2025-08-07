import React from "react";
import { Link } from "react-router-dom";
import './Footer.css';

const Footer = () => {
  return (
    <div className="footer">
      <div className="total">
      <div className="all-category">
      <p className='text-center'><Link to="/">Home</Link></p>
        <div className="categories">
          <p className="main">Categories</p>
          <div className="main-cat">
          <p>Watch</p>
          <p>Mobile</p>
          <p>Clothes</p>
          <p>Heaphones</p>
          </div>
        </div>
      </div>
      
      <div className="Other">
      <p className="text-center mt-3">
        <Link to="/about">About</Link>|<Link to="/contact">Contact</Link>|
        <Link to="/policy">Privacy Policy</Link>
        {/* About | Contact | PrivacyPolicy */}
      </p>
      </div>
      </div>
      <div className="text-center">
        All Right Reserved &copy; E-MART company
      </div>
    </div>
  );
};

export default Footer;
