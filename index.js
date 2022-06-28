const express = require("express");
const app = express();

const connectDB = require('./config/connect')
const notFound = require('./middlewares/not-found')
require('dotenv').config();

const products = require('./routes/route')

const port = process.env.PORT || 5000;

//Middleware
app.use(express.json());

//Routes
app.use('/api/v1/products', products)
app.use(notFound)

//Connecting before starting the server
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`Server started on port ${port}....`));
  } catch (error) {
    console.log(error);
  }
};

start();