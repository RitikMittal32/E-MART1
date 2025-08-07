import { Box } from "@chakra-ui/layout";
import "./styles.css";
import AdminChatWindow from "./AdminChatWindow"; // Import Admin Chat Window
import ChatWindow from "./ChatWindow";
import { ChatState } from "../context/ChatProvider";
import { useAuth } from "../context/auth";
import { useRef,useEffect } from "react";
const Chatbox = () => {
  const { selectedChat} = ChatState();
  const [auth, setAuth] = useAuth();

  return (
    <Box
      d={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      height="calc(100vh+150px)" 
      width="100%"
      borderRadius="lg"
      borderWidth="1px"
      overflow="hidden"
    >
      {auth?.user?.role === 1 ? ( // Check if the user is an admin
        <AdminChatWindow selectedChat={selectedChat}/> // Render AdminChatWindow if admin
      ) : (
        <ChatWindow  /> // Render ChatWindow if regular user
      )}
    </Box>
  );
};

export default Chatbox;
