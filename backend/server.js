import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js';
import connectToMongoDb from './db/connectToMongoDb.js';
import userRoutes from './routes/user.routes.js';


const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config();


app.use(express.json());
app.use(cookieParser());

app.use("/api/auth/", authRoutes);
app.use("/api/messages/", messageRoutes);
app.use("/api/users/", userRoutes);

app.get("/", (req, res) => {
  res.send("welcome to my first chat app");
});


app.listen(PORT, () => {
    connectToMongoDb();
    console.log(`Server is running on port ${PORT}`);
});

// Backend is done. Now let's move to the frontend.