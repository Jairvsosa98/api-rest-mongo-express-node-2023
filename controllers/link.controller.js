import { nanoid } from "nanoid";
import { Link } from "../models/Link.js";

export const getLinks = async (req, res) => {

    try {

        const links = await Link.find({ uid: req.uid })

        return res.status(200).json({ succes: true, data: links })
    } catch (error) {
        res.status(500).json({ success: false, message: "Error de servidor" });
    }
}
export const getLink = async (req, res) => {
    try {
        const { id } = req.params;

        const link = await Link.findById(id)

        if (!link) return res.status(404).json({ success: false, message: "No existe el link" });

        if (!link.uid.equals(req.uid)) return res.status(401).json({ success: false, message: "No le pertenece ese link 🤡" })

        return res.status(200).json({ succes: true, data: link })
    } catch (error) {
        console.log(error.kind);
        if (error.kind === "ObjectId") return res.status(403).json({ success: false, message: "Formato id incorrecto" })
        return res.status(500).json({ success: false, message: "Error de servidor" });
    }
}

export const createLink = async (req, res) => {
    try {

        let { longLink } = req.body;
        if (!longLink.startsWith('https://')) {
            longLink = 'https://' + longLink;
        }

        const link = new Link({ longLink, nanoLink: nanoid(6), uid: req.uid })
        const newLink = await link.save();

        return res.status(200).json({ newLink });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error de servidor" });
    }
}

export const updateLink = async(req, res) => {
    try {
        
    } catch (error) {
        console.log(error);
    }
}

export const removeLink = async (req, res) => {
    try {
        const { id } = req.params;
        const link = await Link.findById(id);

        if (!link) return res.status(404).json({ error: "no existe link" });

        if (!link.uid.equals(req.uid))
            return res.status(401).json({ error: "no es tu link payaso 🤡" });

        await link.deleteOne();
        return res.json({ link });
    } catch (error) {
        console.log(error);
        if (error.kind === "ObjectId") return res.status(403).json({ error: "Formato id incorrecto" });

        return res.status(500).json({ error: "Error de servidor" });
    }
}