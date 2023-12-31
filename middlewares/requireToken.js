import jwt from "jsonwebtoken";
import { TokenVerificationErrors } from "../utils/tokenManager.js";

export const requireToken = (req, res, next) => {
    try {
        let token = req.headers?.authorization;

        if (!token) return res.status(401).json({ success: false, message: "No existe el token en el header, usa Bearer" });

        token = token.split(" ")[1];
        const { uid } = jwt.verify(token, process.env.JWT_SECRET);

        req.uid = uid;

        next();
    } catch (error) {
        console.log(error.message);
        res.status(401).json({ success: false, message: TokenVerificationErrors[error.message] });
    }
}