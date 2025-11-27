import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import { useCart } from "../../context/cart";
import { Badge } from "antd";
import "./Header.css";
import axios from "../../config/axiosConfig.js";
import CHamburger from "./CHamburger.js";

const Header = () => {
  const [auth, setAuth] = useAuth();
  const [cart] = useCart();
  const [check, setCheck] = useState(true);

  useEffect(() => {
    const width = window.innerWidth;
    if (width <= 900) {
      setCheck(false);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get("/api/v1/auth/logOut", { withCredentials: true });
      setAuth({
        ...auth,
        user: null,
        token: "",
      });
    } catch (error) {
      console.error("Error logging out:", error);
    }
    delete axios.defaults.headers.common["Authorization"];
    toast.success("Logout Successfully");
  };

  const list = useRef();

  const handleClick = () => {
    list.current.classList.toggle("change");
  };

  useEffect(() => {
    let lastScrollTop = 0;

    const handleScroll = () => {
      const header = document.querySelector(".header-bar");
      if (header) {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop) {
          header.style.transform = "translateY(-100%)";
        } else {
          header.style.transform = "translateY(0)";
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="main-navbar">
      {check ? (
        <div className="fixed-top">
          <div className="border-b border-black bg-white/20 backdrop-blur-xl  border-white/40 shadow-lg px-6 py-3">
            <div className="flex justify-between">
              <h1 className="text-xl flex justify-center items-center text-gray-800">
                <Link to="/" className="navbar-brand">
                  E-MART
                </Link>
              </h1>
              <div>
                <ul className="flex justify-center items-cente gap-4">
                  {!auth?.user ? (
                    <>
                      <li className="text-xl text-grey">
                        <Link to="/login" className="navbar-brand text-gray-800">
                          Login
                        </Link>
                      </li>
                      <li className="text-xl text-grey">
                        <Link
                          to="/register"
                          className="navbar-brand text-gray-800"
                        >
                          Register
                        </Link>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <Link
                          to="/cart"
                          className="item bg-white rounded-full w-full"
                        >
                          <Badge
                            count={cart?.length}
                            showZero
                            offset={[0, 0]}
                            style={{ backgroundColor: "black", border: "none" }}
                          >
                            <div className="w-10">
                              <img src="/Cart.svg" alt="cart" />
                            </div>
                          </Badge>
                        </Link>
                      </li>
                      <li>
                        <Link
                          onClick={handleLogout}
                          to="/login"
                          className="item bg-white rounded-full w-full"
                        >
                          <div className="w-10 p-1">
                            <img src="/LogOut.svg" alt="logout" />
                          </div>
                        </Link>
                      </li>
                      <div className="item">
                        <Link
                          to={`/dashboard/${
                            auth?.user?.role === 1 ? "admin" : "user"
                          }`}
                          className="item flex"
                        >
                          <div className="item bg-white rounded-full w-full mr-1">
                            <div className="w-10">
                              <img src="/User.svg" alt="user" />
                            </div>
                          </div>
                          <div className="uppercase text-gray-800">
                            {auth?.user?.name}
                          </div>
                        </Link>
                      </div>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <CHamburger
            handleClick={handleClick}
            handleLogout={handleLogout}
            auth={auth}
            cart={cart}
            list={list}
          />
        </div>
      )}
    </div>
  );
};

export default Header;
