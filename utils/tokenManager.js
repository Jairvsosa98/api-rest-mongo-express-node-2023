import jwt from "jsonwebtoken";
import { errorTokens } from "./errorTokens.js";

export const generateToken = (uid) => {

    const expiresIn = 1000 * 60 * 15;

    try {
        const token = jwt.sign({ uid }, process.env.JWT_SECRET, { expiresIn });
        return { token, expiresIn }

    } catch (error) {
        const message = errorTokens(error)
        console.log(message);
    }
};

export const generateRefreshToken = (uid, res) => {
    const expiresIn = 1000 * 60 * 60 * 24 * 30;
    try {
        const refreshToken = jwt.sign({ uid }, process.env.JWT_REFRESH, { expiresIn });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: !(process.env.APP_MODE === 'developer'),
            expires: new Date(Date.now() + expiresIn)
        });
    } catch (error) {
        console.error(error);
    }
}