const mongoose = require('mongoose');

const MessageModal = mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    content: { type: String, trim: true },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat"
    },
}, { timestamps: true });

const Message = model('Message', MessageModal);
module.exports = { Message };