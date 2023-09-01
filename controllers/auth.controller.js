import { User } from "../models/User.js";
import jwt from "jsonwebtoken";
export const register = async (req, res) => {
    const { email, name, surname, password } = req.body;
    try {

        //alternativa buscando por email
        let user = await User.findOne({ email });
        if (user) throw ({ code: 11000 })


        user = new User({ email, name, surname, password });
        await user.save();

        return res.status(201).json({ success: true, message: "Usuario Registrado Correctamente" })
    } catch (error) {
        console.log(error);
        // Alternativa por defecto mongoose
        if (error.code === 11000) return res.status(403).json({ success: false, message: "Ya existe este usuario" });

        return res.status(500).json({ success: false, message: "Algo falló en el servidor",  });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        let user = await User.findOne({ email });
        if (!user) return res.status(403).json({ success: false, message: "No existe este usuario" });

        const resPassword = await user.comparePassword(password);
        if (!resPassword) return res.status(403).json({ success: false, message: "Contraseña Incorrecta" });

        //jwt token
        const token = jwt.sign({ uid: user.id,name: user.name, surname: user.surname }, process.env.JWT_SECRET);

        return res.json({ token });

        return res.status(202).json({ success: true, message: "Usuario Logueado" })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Algo falló en el servidor" });
    }
};