// src/index.js
import { config } from 'dotenv';
import express, { json } from 'express';
import connectDB from './config/db.js';
const app = express();
const port = process.env.PORT || 8000;

config();
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';


app.use(json());

connectDB();



app.get('/', (req, res) => {
    res.send('Everyone deserves to live in a world where they feel safe!');
});
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});