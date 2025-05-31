// src/app.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import noteRoutes from './routes/noteRoutes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());



app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);


// Routes will be added here
// app.get('/', (_, res) => res.send('Smart Notes API is running 🚀'));

export default app;
