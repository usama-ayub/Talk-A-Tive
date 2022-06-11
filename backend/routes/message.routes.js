const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const Chat = require("../models/chat");
const User = require("../models/user");
const Message = require("../models/message");

const router = express.Router();

router.get('/:chat_id',[authMiddleware], async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chat_id })
          .populate("sender", "name profile_image email")
          .populate("chat","-latest_message -users");
        res.json(messages);
      } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }
})

router.post('/',[authMiddleware], async (req, res) => {
    const { content, chat_id } = req.body;
    if (!content || !chat_id) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
      }
    
  try {
    let message = await Message.create({
        sender: req.user._id,
        content: content,
        chat: chat_id,
      });
      await Chat.findByIdAndUpdate(chat_id, { latest_message: message._id });
      message = await message.populate("sender", "name profile_image");
      message = await message.populate("chat");
      message = await User.populate(message, {
          path: "chat.users",
          select: "name profile_image email",
      });
      res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
})

module.exports = router;