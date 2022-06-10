const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

const UserModal = mongoose.Schema({
    name: { type: String, require: true },
    email: { type: String,unique: true, require: true },
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

UserModal.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

UserModal.pre("save", async function (next) {
    if (!this.isModified) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', UserModal);
module.exports = User;