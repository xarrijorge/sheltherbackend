// src/index.js
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import express, { json } from 'express';
const app = express();
const port = process.env.PORT || 8000;

dotenv.config();
connectDB();
// Middleware
app.use(json());

// Connect to MongoDB




// Basic route
app.get('/', (req, res) => {
    res.send('Everyone deserves to live in a world where they feel safe!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});