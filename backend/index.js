const express = require('express');
const dotenv = require('dotenv');
const colors = require("colors");

const connectDB = require('./config/db');

dotenv.config();

connectDB();
const app = express();

const port = process.env.PORT || 5000;
app.listen(5000,console.log(`Server running on PORT ${port}...`.yellow.bold))