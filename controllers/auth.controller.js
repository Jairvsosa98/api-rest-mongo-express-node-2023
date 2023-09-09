import { User } from "../models/user.js";
import { generateRefreshToken, generateToken } from "../utils/tokenManager.js";

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
    console.log('¿Entró aquí?');
    try {
        const { email, password } = req.body;

        let user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) return res.status(403).json({ success: false, message: "Credenciales Incorrectas" });

        const { token, expiresIn } = generateToken(user.id);
        generateRefreshToken(user.id, res);

        return res.json({ token, expiresIn });
    } catch (error) {
        res.status(401).json({ success: false, message: "Error en el servidor" });
    }
};

export const infoUser = async (req, res) => {
    try {
        const user = await User.findById(req.uid).lean(); // El método lean() devuelve un objeto sin las funcionalidades de mongoose.
        return res.json({ name: user.name, surname: user.surname, email: user.email });
    } catch (error) {
        console.log(error.message);

        res.status(500).json({ success: false, message: "Error en el servidor" });
    }
};
export const refreshToken = (req, res) => {
    try {
        const { token, expiresIn } = generateToken(req.uid);
        return res.json({ token, expiresIn });

    } catch (error) {
        res.status(401).json({ success: false, message: "Error en el servidor" });
    }

}

export const logout = (req, res) => {
    res.clearCookie('refreshToken')
    res.json({ success: true })
}
