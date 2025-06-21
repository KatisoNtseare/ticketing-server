import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js'; // your existing db connection
import authRoutes from './routes/authRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import cors from 'cors';

dotenv.config();

const app = express();

connectDB();

app.use(cors({
  origin: 'http://localhost:5173',  // frontend URL
  credentials: true,                // allow cookies to be sent
}));

app.use(express.json());
app.use(cookieParser());



// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);

// Error handling middleware could be added here...

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
