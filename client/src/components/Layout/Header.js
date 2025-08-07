import React, { useRef } from "react";
import {  Link } from "react-router-dom";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import useCategory from "../../hooks/useCategory";
import { useCart } from "../../context/cart";
import { Badge } from "antd";
import './Header.css';
import { useEffect,useState } from "react";
import { getSender } from "../../config/ChatLogics";
import { ChatState } from "../../context/ChatProvider";
import axios from '../../config/axiosConfig.js';
import CHamburger from "./CHamburger";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/menu";


const Header = () => {
  const [auth, setAuth] = useAuth();
  const [cart] = useCart();
  const categories = useCategory();
  const [check,setCheck] = useState(true);
  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
  } = ChatState();


  useEffect(() => {
            const width = window.innerWidth;
            if(width <= 900){
                      setCheck(false);
            }
  },[])
  const handleLogout = async () => {
    try {
      const response = await axios.get("/api/v1/auth/logOut", { withCredentials: true });
      // console.log(response.data.message); 
      // Redirect or update the state as needed
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
    // console.log('k');
  }


  useEffect(() => {
    let lastScrollTop = 0; // Variable to store last scroll position
  
    const handleScroll = () => {
      const header = document.querySelector(".header-bar");
  
      if (header) {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
        if (scrollTop > lastScrollTop) {
          // Scroll Down
          header.style.transform = "translateY(-100%)"; // Move header up
        } else {
          // Scroll Up
          header.style.transform = "translateY(0)"; // Move header back to its position
        }
  
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
      }
    };
  
    window.addEventListener("scroll", handleScroll);
  
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  

  return (
    <div className="main-navbar">
      {check ? (<div className="fixed-top header-bar">
        <div className="header-tab">
          <div className="first-nav">
           <div className="logo-title"> <Link to="/" className="navbar-brand">
               E-MART
            </Link></div>
            <div className="first-right">
            <ul>
            {!auth?.user ? (
                <>
                  <li>
                    <Link to="/login" className='item'>
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link to="/register" className='item'>
                     Register
                    </Link>
                  </li>
                  
                </>
              ) : (
                <>


                      <li>
                      <Link to="/cart" className='item bg-white rounded-full w-full'>
                      <Badge
                        count={cart?.length}
                        showZero
                        offset={[0, 0]}
                        style={{ backgroundColor: 'transparent', border: 'none', }}
                      >
                        <div className="w-10">
                          <img src="/Cart.svg" alt="cart" />
                        </div>
                      </Badge>

                      </Link>
                    </li>
                    <li> 
                      <Link 
                  to={auth?.user?.role === 1 ? "/chat/admin-chat" : "/chat/user-chat"} 
                  className="bg-white rounded-full w-full" 
      
                >
                 
                  <div className="w-10 p-1"><img src="/Message.svg" alt="cart" /></div>
               
                  </Link>
                    </li>
                  

                    <li>
                    <Menu>
            <MenuButton p={1}>
              <div className="bg-white rounded-full w-10 text-black"><img src="/Notify.svg" alt="notify" /></div>
            </MenuButton>
            <MenuList pl={2}>
                {!notification.length && "No New Messages"}
                {notification.map((notif) => (
                  <MenuItem
                    key={notif._id}
                    onClick={() => {
                      setSelectedChat(notif.chat);
                      setNotification(notification.filter((n) => n !== notif));
                    }}
                  >
                    {notif.chat.isGroupChat
                      ? `New Message in ${notif.chat.chatName}`
                      : `New Message from ${getSender(user, notif.chat.users)}`}
                  </MenuItem>
                ))}
              </MenuList>
          </Menu>
                    </li>
                    <li>
                        <Link
                          onClick={handleLogout}
                          to="/login"
                          className='item bg-white rounded-full w-full'
                        >
                           <div className="w-10 p-1"><img src="/LogOut.svg" alt="cart" /></div>
                        </Link>
                      </li>
                    <div className="item">
                    <Link
                          to={`/dashboard/${
                            auth?.user?.role === 1 ? "admin" : "user"
                          }`}
                          className='item flex'
                        >
                    <div className='item bg-white rounded-full w-full mr-1'>
                    <div className="w-10 ">
                          <img src="/User.svg" alt="cart" />
                        </div>
                      </div>
                      <div className="uppercase">
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
        {auth?.user ? (
          <>
        <div className="single-line"></div>
      <div className="second-nav">
        <ul>
              <li>
                <Link to="/" className='item'>
                  Home
                </Link>
              </li>
                  {categories?.map((c) => (
                    <li key={c.slug}>
                      <Link
                        className="item"
                        to={`/category/${c.slug}`}
                      >
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
      </div>
      </>
        ) : (
          <>
          </>
        )}
  </div>
  ): (
    <div className="">
       {/* <Hamburger handleClick={handleClick} handleLogout={handleLogout}  auth={auth} categories={categories} cart={cart} list={list}/> */}
       <CHamburger handleClick={handleClick} handleLogout={handleLogout}  auth={auth} categories={categories} cart={cart} list={list}/>
        
    </div>
  )}
    </div>
  );
};

export default Header;
