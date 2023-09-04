import { User } from "../models/User.js";
import jwt from "jsonwebtoken";
import { generateRefreshToken, generateToken } from "../utils/tokenManager.js";
import { errorTokens } from "../utils/errorTokens.js";

export const register = async (req, res) => {
    const { email, name, surname, password } = req.body;
    try {

        //alternativa buscando por email
        let user = await User.findOne({ email });
        if (user) throw new Error("Email ya registrado 😒");

        user = new User({ email, name, surname, password });
        await user.save();

        const { token, expiresIn } = generateToken(user.id);
        generateRefreshToken(user.id, res);

        return res.json({ token, expiresIn });
    } catch (error) {
        console.log(error);
        // Alternativa por defecto mongoose
        if (error.code === 11000) return res.status(403).json({ success: false, message: "Ya existe este usuario" });

        return res.status(500).json({ success: false, message: "Algo falló en el servidor", });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        let user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) return res.status(403).json({ success: false, message: "Credenciales Incorrectas" });

        const { token, expiresIn } = generateToken(user.id);
        generateRefreshToken(user.id, res);

        return res.json({ token, expiresIn });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Algo falló en el servidor" });
    }
};

export const infoUser = async (req, res) => {
    try {
        const user = await User.findById(req.uid).lean(); // El método lean() devuelve un objeto sin las funcionalidades de mongoose.
        return res.json({ name: user.name, surname: user.surname, email: user.email });
    } catch (error) {
        console.log(error.message);
        const message = errorsValidateToken(error);

        res.status(401).json({ success: false, message });
    }
};
export const refreshToken = (req, res) => {
    try {
        const refreshTokenCookie = req.cookies?.refreshToken;
        if (!refreshTokenCookie) throw new Error('No existe el token');

        const { uid } = jwt.verify(refreshTokenCookie, process.env.JWT_REFRESH);

        const { token, expiresIn } = generateToken(uid);

        return res.json({ token, expiresIn });

    } catch (error) {
        console.log(error);
        const message = errorTokens(error);

        return res.status(401).json({ success: false, message });
    }

}

export const logout = (req, res) => {
    res.clearCookie('refreshToken')
    res.json({ success: true })
}
