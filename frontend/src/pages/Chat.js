import { Box } from "@chakra-ui/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatBox from "../components/Chatbox";
import MyChats from "../components/MyChats";
import SideDrawer from "../components/SideDrawer";
import { ChatState } from "../context/ChatProvider";

function ChatPage() {
    const { user } = ChatState();

    return (
     <div style={{ width: "100%" }}>
       {user && <SideDrawer />}
       <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
         {user && <MyChats />}
        {user && (
          <ChatBox  />
        )} 
      </Box>
     </div>
    );
  }
  
  export default ChatPage;