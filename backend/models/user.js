const mongoose = require('mongoose');

const UserModal = mongoose.Schema({
    name: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    name: { type: String, require: true },
    profile_image: {
        type: "String",
        required: true,
        default:
          "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    online_status: {
        type: "String",
        default:"active",
    },
    is_admin: {
        type: Boolean,
        default: false,
    },
    status:{
        type: "String",
        default:"active",
    }
}, { timestamps: true });

const User = model('User', UserModal);
module.exports = { User };