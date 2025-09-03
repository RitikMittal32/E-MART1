import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { BACKEND_URL } from "../config/axiosConfig";
import { useAuth } from "./auth";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [user] = useAuth();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (user?.user?._id) {
      const newSocket = io(`${BACKEND_URL}`, {
        transports: ["websocket", "polling"],
      });
      setSocket(newSocket);

      newSocket.on("connect", () => {
        if (user.user._id === "6595132ddd5e54715069ab59") {
          newSocket.emit("admin setup");
        }
        newSocket.emit("setup", user.user._id);
      });

      return () => {
        if (newSocket) {
          newSocket.disconnect();
        }
      };
    }
  }, [user]);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        notification,
        setNotification,
        socket,
        chats,
        setChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => useContext(ChatContext);
