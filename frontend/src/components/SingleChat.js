import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import { IconButton, Spinner, useToast } from "@chakra-ui/react";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import Lottie from "react-lottie";
import { ChatState } from "../context/ChatProvider";
import { getSender, getSenderFull } from "../config/helper";
import ProfileModal from "./modal/Profile";
import UpdateGroupChatModal from "./modal/UpdateGroupChat";
import { axiosClient } from "../config/axios";
import ScrollableMessage from "./ScrollableMessage";
import typingData from "../config/typing.json";
const ENDPOINT = "http://localhost:5000"; // "https://talk-a-tive.herokuapp.com"; -> After deployment
let socket;
const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: typingData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const SingleChat = () => {
    const toast = useToast();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [socketConnected, setSocketConnected] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);

  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();
    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
          socket.emit("stop typing", selectedChat._id);
          try {
            setNewMessage("");
            const { data } = await axiosClient.post(
              "message",
              {
                content: newMessage,
                chat_id: selectedChat,
              }
            );
            socket.emit("new message", data);
            setMessages([...messages, data]);
          } catch (error) {
            toast({
              title: "Error Occured!",
              description: "Failed to send the Message",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
          }
        }
      };
      const fetchMessages = async () => {
        if (!selectedChat) return;
    
        try {
          setLoading(true);
          const { data } = await axiosClient.get(
            `message/${selectedChat._id}`
          );
          setMessages(data);
          setLoading(false);
          socket.emit("join chat", selectedChat._id);
        //   socket.emit("join chat", selectedChat._id);
        } catch (error) {
          toast({
            title: "Error Occured!",
            description: "Failed to Load the Messages",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        }
      };
      const typingHandler = (e) => {
        setNewMessage(e.target.value);
        if (!socketConnected) return;

        if (!typing) {
          setTyping(true);
          socket.emit("typing", selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
          var timeNow = new Date().getTime();
          var timeDiff = timeNow - lastTypingTime;
          if (timeDiff >= timerLength && typing) {
            socket.emit("stop typing", selectedChat._id);
            setTyping(false);
          }
        }, timerLength);
      }
      useEffect(() => {
        fetchMessages();
      }, [selectedChat]);
      useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", (socket_id) => {
          console.log(socket_id)
          setSocketConnected(true)
        });
        socket.on("typing", () => {
          setIsTyping(true)
        });
        socket.on("stop typing", () => setIsTyping(false));
        console.log(84)
      }, []);
      useEffect(() => {
        socket.on("message recieved", (newMessageRecieved) => {
          if (
            !selectedChat || // if chat is not selected or doesn't match current chat
            selectedChat._id !== newMessageRecieved.chat._id
          ) {
            if (!notification.includes(newMessageRecieved)) {
              setNotification([newMessageRecieved, ...notification]);
            }
          } else {
            setMessages([...messages, newMessageRecieved]);
          }
        });
      });
  return (
    <>
      {selectedChat ? (
        <>
         <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            {true &&
              (!selectedChat.is_group_chat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  {selectedChat.chat_name.toUpperCase()}
                  <UpdateGroupChatModal/>
                </>
              ))}
          </Text>

          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableMessage messages={messages} />
              </div>
            )}
            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
            >
              {istyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    // height={50}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;