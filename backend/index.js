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
app.listen(5000,console.log(`Server running on PORT ${port}...`.yellow.bold))