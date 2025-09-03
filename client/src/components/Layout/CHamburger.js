import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Badge } from "antd";
import "./CHamburger.css";

const CHamburger = ({ handleClick, handleLogout, auth, cart }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={menuRef}>
      <div>
        <div
          className={`hamburger-icon ${isOpen ? "done" : ""}`}
          onClick={toggleMenu}
        >
          <span></span>
        </div>

        <div className={`circ-line ${isOpen ? "open" : ""}`}>
          <span></span>
        </div>
        <div className={`radial-quarter-shadow ${isOpen ? "open" : ""}`}></div>
      </div>

      <div className={`menu-items ${isOpen ? "open" : ""}`}>
        {!auth?.user ? (
          <ul className="menu-it">
            <li className="items">
              <Link
                to="/login"
                className="item rounded-full w-full bg-white p-2 "
              >
                <div className="w-10">
                  <img src="/Login1.svg" alt="login" />
                </div>
              </Link>
            </li>
            <li className="items">
              <Link
                to="/register"
                className="item rounded-full w-full bg-white p-2"
              >
                <div className="w-10">
                  <img src="/Register.png" alt="login" />
                </div>
              </Link>
            </li>
          </ul>
        ) : (
          <ul className="menu-i">
            <li className="menu-item">
              <Link to="/" className="item rounded-full w-full">
                <div className="w-10">
                  <img src="/Home.svg" alt="cart" />
                </div>
              </Link>
            </li>

            <li className="menu-item">
              <Link
                to={`/dashboard/${auth?.user?.role === 1 ? "admin" : "user"}`}
                className="item flex"
              >
                <div className="item rounded-full w-full mr-1">
                  <div className="w-10">
                    <img src="/User.svg" alt="cart" />
                  </div>
                </div>
              </Link>
            </li>

            <li className="menu-item">
              <div>
                <Link to="/cart" className="item rounded-full w-full">
                  <Badge
                    count={cart?.length}
                    showZero
                    offset={[0, 0]}
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                    }}
                  >
                    <div className="w-10">
                      <img src="/Cart.svg" alt="cart" />
                    </div>
                  </Badge>
                </Link>
              </div>
            </li>

            <li className="menu-item">
              <Link
                onClick={handleLogout}
                to="/login"
                className="item rounded-full w-full"
              >
                <div className="w-12 p-1">
                  <img src="/LogOut.svg" alt="logout" />
                </div>
              </Link>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default CHamburger;
