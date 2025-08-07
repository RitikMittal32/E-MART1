import { Box } from "@chakra-ui/layout";
import { useState, useRef, useEffect } from "react";
import Chatbox from "../components/Chatbox";
import { MyChats } from "../components/MyChats";
import Layout from "../components/Layout/Layout";
import { ChatState } from "../context/ChatProvider";

const UserChatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();
  const chatboxRef = useRef(null);



  return (
    <Layout title={"Message"}>
      <Box className="container-fluid" p={0} mb={4} height="calc(100vh-150px)" mt="150px" display="flex">
     
          <Box 
            width="100%"  
            height="100%"
          >
             <div className="text-lg font-bold text-center">Review Chat History</div> 
            <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </Box>
      </Box>
    </Layout>
  );
};

export default UserChatpage;
