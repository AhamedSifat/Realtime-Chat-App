import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.route.js';
import conncecDB from './config/db.js';
import cookieParser from 'cookie-parser';
import messageRoutes from './routes/message.route.js';
import { io, server, app } from './utils/socket.js';

dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

const PORT = process.env.PORT || 3000;
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

server.listen(PORT, () => {
  conncecDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});
