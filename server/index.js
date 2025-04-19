const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');  // Add user routes

dotenv.config();

const app = express();

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/post', postRoutes);
app.use('/user', userRoutes);  // Add the user routes here

mongoose.connect(MONGO_URL)
  .then(() => {             
    app.listen(PORT, () => {                
      console.log(`✅ Server is running on port ${PORT}`);  // Ensure DB connection before server starts
    });
  })
  .catch((err) => {
    console.error('❌ Connection to Database Failed', err);
  });
