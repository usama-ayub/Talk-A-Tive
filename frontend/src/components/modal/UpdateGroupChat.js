import { CloseIcon, ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  Input,
  useToast,
  Box,
  IconButton,
  Spinner,
  Badge,
} from "@chakra-ui/react";
import { useState } from "react";
import { axiosClient } from "../../config/axios";
import { ChatState } from "../../context/ChatProvider";
import UserListItem from "../UserListItem";


const UpdateGroupChatModal = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameloading, setRenameLoading] = useState(false);
    const toast = useToast();
  
    const { selectedChat, setSelectedChat, user } = ChatState();
    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
          return;
        }
    
        try {
          setLoading(true);
          const { data } = await axiosClient.get(`user/search?search=${search}`);
          console.log(data);
          setLoading(false);
          setSearchResult(data);
        } catch (error) {
          toast({
            title: "Error Occured!",
            description: "Failed to Load the Search Results",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
          });
          setLoading(false);
        }
      };
      const handleAddUser = async (user1) => {}
      const handleRemove = async (user1) => {}
      const handleDelete = async (user1) => {}
      const handleRename = async () => {}
      const UserBadgeItem = () => {
        return  selectedChat ? selectedChat.users.map((u) => {
              return (
                  <Badge
                      px={2}
                      py={1}
                      borderRadius="lg"
                      m={1}
                      mb={2}
                      variant="solid"
                      fontSize={12}
                      colorScheme="purple"
                      cursor="pointer"
                      onClick={() => handleDelete(u)}
                      key={u._id}
                  >
                      {u.name}
                      {u._id === user._id && <span> (Admin)</span>}
                      <CloseIcon pl={1} />
                  </Badge>
              );
          }) : <></>
      };
    return (
        <>
          <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
    
          <Modal onClose={onClose} isOpen={isOpen} isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader
                fontSize="35px"
                fontFamily="Work sans"
                d="flex"
                justifyContent="center"
              >
                {selectedChat.chat_name}
              </ModalHeader>
    
              <ModalCloseButton />
              <ModalBody d="flex" flexDir="column" alignItems="center">
                <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
                  {UserBadgeItem()}
                </Box>
                <FormControl display="flex">
                  <Input
                    placeholder="Chat Name"
                    mb={3}
                    value={groupChatName}
                    onChange={(e) => setGroupChatName(e.target.value)}
                  />
                  <Button
                    variant="solid"
                    colorScheme="teal"
                    ml={1}
                    isLoading={renameloading}
                    onClick={handleRename}
                  >
                    Update
                  </Button>
                </FormControl>
                <FormControl>
                  <Input
                    placeholder="Add User to group"
                    mb={1}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </FormControl>
    
                {loading ? (
                  <Spinner size="lg" />
                ) : (
                  searchResult?.map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => handleAddUser(user)}
                    />
                  ))
                )}
              </ModalBody>
              <ModalFooter>
                <Button onClick={() => handleRemove(user)} colorScheme="red">
                  Leave Group
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      );

}

export default UpdateGroupChatModal;