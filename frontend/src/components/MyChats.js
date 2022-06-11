import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import { useEffect, useState } from "react";
// import { getSender } from "../config/ChatLogics";
// import ChatLoading from "./ChatLoading";
// import GroupChatModal from "./miscellaneous/GroupChatModal";
import { Button } from "@chakra-ui/react";
import { ChatState } from "../context/ChatProvider";
import { axiosClient } from "../config/axios";
import ChatSkeleton from "./ChatSkeleton";
import { getSender } from "../config/helper";
import GroupChat from "./modal/GroupChat";


function MyChats() {
    const [loggedUser, setLoggedUser] = useState();
    const [chats, setChats] = useState();
    const { selectedChat, setSelectedChat, user } = ChatState();
    const toast = useToast();

    const fetchChats = async () => {
        // console.log(user._id);
        try {
          const { data } = await axiosClient.get("chat");
          setChats(data);
        } catch (error) {
          toast({
            title: "Error Occured!",
            description: "Failed to Load the chats",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
          });
        }
      };
      useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
        fetchChats();
        // eslint-disable-next-line
      }, []);
   return (
        <Box
          d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
          flexDir="column"
          alignItems="center"
          p={3}
          bg="white"
          w={{ base: "100%", md: "31%" }}
          borderRadius="lg"
          borderWidth="1px"
        >
          <Box
            pb={3}
            px={3}
            fontSize={{ base: "28px", md: "30px" }}
            fontFamily="Work sans"
            display='flex'
            w="100%"
            justifyContent="space-between"
            alignItems="center"
          >
            My Chats
            <GroupChat>
              <Button
               display='flex'
                fontSize={{ base: "17px", md: "10px", lg: "17px" }}
                rightIcon={<AddIcon />}
              >
                New Group Chat
              </Button>
            </GroupChat>
          </Box>
          <Box
            display='flex'
            flexDir="column"
            p={3}
            bg="#F8F8F8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {chats ? (
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
                    <Text>
                      {!chat.is_group_chat
                        ? getSender(loggedUser, chat.users)
                        : chat.chat_name}
                    </Text>
                    {chat.latest_message && (
                      <Text fontSize="xs">
                        <b>{chat.latest_message.sender.name} : </b>
                        {chat.latest_message.content.length > 50
                          ? chat.latest_message.content.substring(0, 51) + "..."
                          : chat.latest_message.content}
                      </Text>
                    )}
                  </Box>
                ))}
              </Stack>
            ) : (
              <ChatSkeleton />
            )}
          </Box>
        </Box>
      );
   }
   
   export default MyChats;