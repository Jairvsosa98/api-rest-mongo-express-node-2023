import express from 'express'
import { login, register } from '../controllers/auth.controller.js';
import { body } from 'express-validator';
import { authValidation } from '../middlewares/authValidation.js';
const router = express.Router();

router.post('/register', [
    body('email', "Formato de e-mail incorrecto")
        .trim()
        .isEmail()
        .normalizeEmail(),
    body('password', "Mínimo 6 caracteres")
        .trim()
        .isLength({ min: 6 }),
    body('password', "Formato de password incorrecto")
        .custom((value, { req }) => {
            if (value !== req.body.repassword) {
                throw new Error('No coiniciden las contraseñas');
            }
            return value;
        })
], authValidation, register);

router.post('/login', [
    body('email', "Formato de e-mail incorrecto")
        .trim()
        .isEmail()
        .normalizeEmail(),
    body('password', "Mínimo 6 caracteres")
        .trim()
        .isLength({ min: 6 })
], authValidation, login)


export default router;