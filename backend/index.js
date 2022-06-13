const express = require('express');
const dotenv = require('dotenv');
const colors = require("colors");
const cors = require('cors');

const userRoutes = require("./routes/user.routes");
const chatRoutes = require("./routes/chat.routes");
const messageRoutes = require("./routes/message.routes");
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

connectDB();
const app = express();

// accept json
app.use(cors());
app.use(express.json());
 app.get('/api/test', (req, res) => {
                res.send({
                    message: 'request not found'
                })
            });
// routes
app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes);
app.use('/api/message',messageRoutes);
// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);
console.log(`ProcessID: ${process.pid}`.blue.bold);
const port = process.env.PORT || 5000;
const server = app.listen(5000,console.log(`Server running on PORT ${port}...`.yellow.bold));

const io = require("socket.io")(server, {
    cors: {
      origin: process.env.SOCKET_ORIGIN,
      // credentials: true,
    },
  });

io.on("connection", (socket) => {
    console.log('new user connect to socket', socket.id);
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected", socket.id);
    });
    socket.on("join chat", (chat_id) => {
        socket.join(chat_id);
        console.log("User Joined Chat: " + chat_id);
    });
    socket.on("new message", (newMessageRecieved) => {
        let chat = newMessageRecieved.chat;

        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) => {
            if (user._id == newMessageRecieved.sender._id) return;
            console.log(user._id, 60)
            socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
    });
    socket.on("typing", (chat_id) => {
        console.log(chat_id,64)
        socket.in(chat_id).emit("typing")
    });
    socket.on("stop typing", (chat_id) => {
        socket.in(chat_id).emit("stop typing")
    });
    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
})