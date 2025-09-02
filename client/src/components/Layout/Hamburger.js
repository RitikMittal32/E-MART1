import React, { useRef } from "react";
import {  Link } from "react-router-dom";
import { Badge } from "antd";
import './Header.css';
import { FaRegUserCircle } from "react-icons/fa";
// import {
//   Menu,
//   MenuButton,
//   MenuDivider,
//   MenuItem,
//   MenuList,
// } from "@chakra-ui/menu";
// import { getSender } from "../../config/ChatLogics";
// import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
// import { ChatState } from "../../context/ChatProvider";

const Hamburger = ({handleClick, handleLogout, auth, categories, cart, list}) => {
          // const list = useRef();
          // const {
          //   setSelectedChat,
          //   user,
          //   notification,
          //   setNotification,
          //   chats,
          //   setChats
          // } = ChatState();

  return (
          <div className="fixed-top h" ref={list}>
        
          <div className="ha">
          <div className="hamburgur" onClick={(e) => handleClick(e)} >
            <span></span>
            <span></span>
            <span></span>
          </div>
          </div>
        <div className="main-heading" >
        <div className="heading">
          <div className="nav">
           <div className="logo-title "> <Link to="/" className="navbar-brand">
               E-MART
            </Link></div>
            <div>
        <ul>
        {!auth?.user ? (
                <>
                  <li >
                    <Link to="/login" className='item text-black' >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link to="/register" className='item text-black'>
                     Register
                    </Link>
                  </li>
                  
                </>
              ) : (
                    <>
          <li>
          <div>
            <Link to="/cart" className='item bg-white rounded-full'>
              <Badge
                count={cart?.length}
                showZero
                offset={[0, 0]}
                style={{ backgroundColor: 'transparent', border: 'none' }}
              >
                <div className="w-10">
                  <img src="/Cart.svg" alt="cart" />
                </div>
              </Badge>
            </Link>
          </div>
          </li>
          {/* <li>
            <Link 
              to={auth?.user?.role === 1 ? "/admin-chat" : "/user-chat"} 
              className="item bg-white rounded-full w-full"
            >
              <div className="w-10 p-1">
                <img src="/Message.svg" alt="chat" />
              </div>
            </Link>
          </li> */}
          <li>
            <Link
              onClick={handleLogout}
              to="/login"
              className='item bg-white rounded-full w-full'
            >
              <div className="w-10 p-1">
                <img src="/LogOut.svg" alt="logout" />
              </div>
            </Link>
          </li>
          
          <li className="item">
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
                      {/* <div className="uppercase">
                        {auth?.user?.name}
                      </div> */}
                        </Link>
                  
                    </li>
                    {/* <li>
                    <Menu>
             <MenuButton p={1}>
              <div className="item bg-white rounded-full w-full"><div className="w-10"><img src="/Notify.svg" alt="notify" /></div></div>
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
                    </li> */}
                          
                    
                    </>
              )}
    
        </ul>
      </div>
          </div>
        </div>
        {auth?.user ? (
          <>
        <div className="single-line"></div>
      <div className="nav">
        <ul>
              <li>
                <Link to="/" className='item'>
                  Home
                </Link>
              </li>
             
                
    
                  {categories?.map((c) => (
                    <li>
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
      </div>
  )
}

export default Hamburger
