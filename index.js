import 'dotenv/config'
import './database/connectDB.js'

import express from "express";
import authRouter from './routers/auth.route.js';
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/v1/auth', authRouter);
// solo para el ejemplo de login/token
app.use(express.static('public'));
const PORT = process.env.PORT || 9090;
app.listen(PORT, () => console.log("❤❤❤ http://localhost:" + PORT));