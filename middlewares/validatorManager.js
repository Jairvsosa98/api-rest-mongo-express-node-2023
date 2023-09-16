import axios from "axios";
import { validationResult, body, param } from "express-validator";

export const authValidation = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    next();
}

export const paramsLinkValidator = [
    param("id", "Formato no válido (express validator)")
        .trim()
        .notEmpty()
        .escape(),
    authValidation
]

export const bodyLinkValidator = [
    body('longLink', "Formato link incorrecto")
        .trim()
        .notEmpty()
        .custom(async (value) => {
            try {
                if (!value.startsWith('https://')) {
                    value = 'https://' + value;
                }
                await axios.get(value);
                return value;
            } catch (error) {
                // console.log(error);
                throw new Error("Link Inválido")
            }
        }),
    authValidation
]

export const bodyRegisterValidator = [
    body('name', "El nombre es requerido")
        .trim()
        .notEmpty(),
    body('surname', "El apellido es requerido")
        .trim()
        .notEmpty(),
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
        }),
    authValidation
];
export const bodyLoginValidator = [
    body('email', "Formato de e-mail incorrecto")
        .trim()
        .isEmail()
        .normalizeEmail(),
    body('password', "Mínimo 6 caracteres")
        .trim()
        .isLength({ min: 6 }),
    authValidation
];