import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import useCategory from "../../hooks/useCategory";

const Footer = () => {
  const categories = useCategory();

  return (
    <footer className="footer">
      <div className="total">
        <div className="all-category">
          <p className="text-center">
            <Link to="/">Home</Link>
          </p>
          <nav className="categories">
            <p className="main">Categories</p>
            <ul className="main-cat">
              {categories?.map((c) => (
                <li key={c.slug}>
                  <Link to={`/category/${c.slug}`}>{c.name}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="other">
          <p className="text-center mt-3">
            <Link to="/about">About</Link> |{" "}
            <Link to="/contact">Contact</Link> |{" "}
            <Link to="/policy">Privacy Policy</Link>
          </p>
        </div>
      </div>

      <div className="text-center copy">
        All Rights Reserved &copy; E-MART Company
      </div>
    </footer>
  );
};

export default Footer;
