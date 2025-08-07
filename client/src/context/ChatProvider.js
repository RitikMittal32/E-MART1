import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client"; // Import io from socket.io-client
import { BACKEND_URL } from "../config/axiosConfig";
import { useAuth } from "./auth";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [user] = useAuth(); // Access the user directly
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (user?.user?._id) {
      // Initialize socket when user data is available
      const newSocket = io(`${BACKEND_URL}`, {
        transports: ["websocket", "polling"],
      });
      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log("Connected to server");
        
        // Emit user ID to set up the user connection on the server
        if (user.user._id === "6595132ddd5e54715069ab59") {
          newSocket.emit("admin setup");
        }
        newSocket.emit("setup", user.user._id);
      });

      newSocket.on("connected", () => {
        console.log("Successfully joined room");
      });

      // Cleanup socket connection when component unmounts or when user data changes
      return () => {
        if (newSocket) {
          newSocket.disconnect();
        }
      };
    } else {
      console.error("User information is not available");
    }
  }, [user]); // Dependency on `user` to reset the socket connection when user changes

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        notification,
        setNotification,
        socket, // Provide socket to the context
        chats, // Provide chat data if needed
        setChats, // Provide setter function for chats
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => useContext(ChatContext);
