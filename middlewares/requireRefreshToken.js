import jwt from "jsonwebtoken";
import { TokenVerificationErrors } from "../utils/tokenManager.js";

export const requireRefreshToken = (req,res,next) => {

     try {
        const refreshTokenCookie = req.cookies?.refreshToken;
        if (!refreshTokenCookie) return res.status(401).json({success: false, message : "No existe el token"});

        const { uid } = jwt.verify(refreshTokenCookie, process.env.JWT_REFRESH);

        req.uid = uid
        next();
     } catch (error) {
      console.log(error.message);
        res.status(401).json({success : false, message : TokenVerificationErrors[error.message]})
     }
}