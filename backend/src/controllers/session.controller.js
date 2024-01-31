import { generateToken } from "../utils/jwt.js";

export const getCurrent = async (req, res) => {
    res.send(req.user)
}

export const getLogout = async (req, res) => {
    res.clearCookie('jwtCookie')
    res.status(200).send({mensaje: 'Sesion cerrada'})
}

export const postLogin = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).send({ mensaje: "Usuario Inválido" });
        }

        const token = generateToken(req.user, res);

        req.user.last_connection = new Date();
        await req.user.save();

        res.status(200).send({ token });
    } catch (error) {
        res.status(500).send({ mensaje: `Error al iniciar sesión: ${error}` });
    }
}

export const postRegister = async (req, res) => {
    try {
        if(!req.user) {
            return res.status(400).send({ mensaje: "Usuario ya existente" })
        }

        res.status(201).send({ mensaje: "Usuario creado" })
    } catch(error) {
        res.status(500).send({ mensaje: 'Error al crear usuario ${error}'})
    }
}

export const getGithubCallback = async (req, res) => {
    req.session.user = req.user
    res.status(200).send({ mensaje: 'Usuario logueado' })
}

export const getGithub = async (req, res) => {
    
}