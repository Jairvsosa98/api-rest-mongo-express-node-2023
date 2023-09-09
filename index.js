import 'dotenv/config'
import './database/connectDB.js'

import express from "express";
import cors from "cors";

import authRouter from './routers/auth.route.js';
import cookieParser from 'cookie-parser';
import linkRouter from './routers/link.route.js';
import redirectRouter from './routers/redirect.route.js';

const app = express();

const whiteList = [process.env.ORIGIN1];

app.use(cors({
    origin: function (origin, callback) {
        if (whiteList.includes(origin)) {
            return callback(null, origin);
        }
        return callback("Error de CORS origin: " + origin + " no autorizado!");
    }
}))

app.use(express.json());
app.use(cookieParser());

// Ejemplo back redirect (opcional)
app.use('/', redirectRouter);

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/links', linkRouter);
// solo para el ejemplo de login/token
app.use(express.static('public'));
const PORT = process.env.PORT || 9090;
app.listen(PORT, () => console.log("❤❤❤ http://localhost:" + PORT));