const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const Chat = require("../models/chat");
const User = require("../models/user");

const router = express.Router();


// Single Chat
router.post('/create',[authMiddleware], async (req, res) => {
    const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  var isChat = await Chat.findOne({
    is_group_chat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } }, // login user
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latest_message");

  isChat = await User.populate(isChat, {
    path: "latest_message.sender",
    select: "name pic email",
  });

  if (isChat) {
    res.send(isChat);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

router.get('/',[authMiddleware], async (req, res) => {
    try {
        // Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
        //   .populate("users", "-password")
        //   .populate("group_admin", "-password")
        //   .populate("latest_message")
        //   .sort({ updatedAt: -1 })
        //   .then(async (results) => {
        //     results = await User.populate(results, {
        //       path: "latestMessage.sender",
        //       select: "name pic email",
        //     });
        //     res.status(200).send(results);
        //   });
        const chat = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
          .populate("users", "-password -is_admin")
          .populate("group_admin", "-password")
          .populate("latest_message")
          .sort({ updatedAt: -1 })
        res.status(200).send(chat);
      } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }
});


// Group Chat
router.post('/group', async (req, res) => {
    const {members,name,user} = req.body;
    if (!members || !name) {
        return res.status(400).send({ message: "Please Fill all the feilds" });
      }
    
      var groupMember = JSON.parse(members);
    
      if (groupMember.length < 2) {
        return res
          .status(400)
          .send("More than 2 member are required to form a group chat");
      }
    
      groupMember.push(user); // login user also add
    
      try {
        const groupChat = await Chat.create({
          chatName: name,
          users: groupMember,
          isGroupChat: true,
          groupAdmin: user,
        });
    
        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
          .populate("users", "-password -is_admin")
          .populate("groupAdmin", "-password -is_admin");
    
        res.status(200).json(fullGroupChat);
      } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }
});

// rename group
router.put('/group/rename', async (req, res) => {
 
});

// remove someone from group
router.put('/group/remove', async (req, res) => {
 
});

// add someone from group
router.put('/group/add', async (req, res) => {
 
});
module.exports = router;