export const errorTokens = (message) => {
    switch (error) {
        case "invalid signature":
            return "Firma no válida";
            break;
        case "jwt expired":
            return "Token expirado";
            break;
        case "invalid token":
            return "No invente token";
            break;

        default:
            return error;
    }
}