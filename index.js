import 'dotenv/config'
import './database/connectDB.js'

import express from "express";
import authRouter from './routers/auth.route.js';

const app = express();
app.use(express.json());
app.use('/api/v1', authRouter);

const PORT = process.env.PORT || 9090;
app.listen(PORT, () => console.log("❤❤❤ http://localhost:9090:" + PORT));