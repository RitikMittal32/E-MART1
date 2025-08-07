import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text, Button, Spinner } from "@chakra-ui/react"; // Import Spinner for loading state
import { useToast } from "@chakra-ui/toast";
import axios from "../config/axiosConfig";
import { useEffect, useState } from "react";
import { getSender } from "../config/ChatLogics";
import { ChatLoading } from "./ChatLoading";
// import GroupChatModal from "./miscellaneous/GroupChatModal";
import { ChatState } from "../context/ChatProvider";
import { useAuth } from "../context/auth";

export const MyChats = () => {

  const [loadingChats, setLoadingChats] = useState(true); // State to manage loading
  const { selectedChat, setSelectedChat } = ChatState(); // Initialize chats as an empty array
  const toast = useToast();
  const [chats, setChats] = useState();
  const fetchChats = async (p) => {
    try {
      const res = await axios.get("/api/v1/users");
      if(res && res.data.success){
          setChats(res.data.data);
      }
    
      setLoadingChats(false); // Set loading to false after fetching chats
    }catch(error) {
      setLoadingChats(false); // Set loading to false on error
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
      fetchChats(); 
  },[]);

  return (
    <Box
      d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      width="100%"
      height="100%"
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        d="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
      </Box>
      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {loadingChats ? ( // Show loading spinner if loading chats
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            size="lg"
            alignSelf="center"
          />
        ) : chats && chats.length > 0 ? ( // Check if chats array is defined and has length
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                {/* <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text> */}
                {/* {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name}:</b>{" "}
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )} */}
                <span className="ml-2">{chat.name}</span>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading /> // Use ChatLoading component if no chats found
        )}
      </Box>
    </Box>
  );
};
