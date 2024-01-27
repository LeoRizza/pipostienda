import { generateToken } from "../utils/jwt.js";

export const getCurrent = async (req, res) => {
    res.send(req.user)
}

export const getLogout = async (req, res) => {
    /* Si manejo las sessiones desde BDD 
    if (req.session.login) {
        req.session.destroy()
    } */
    res.clearCookie('jwtCookie')

    res.redirect('/login', 200, { resultado: 'Usuario deslogueado' })
}

export const postLogin = async (req, res) => {
    try {
        if(!req.user) {
            return res.status(401).send({mensaje: "Usuario Invalido"})
        }
        /* Si manejo las sessiones desde BDD
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email
            res.status(200).send({mensaje: "usuario logueado"})
        }
 */
        const token = generateToken(req.user, res)

        res.status(200).send({ token })
    } catch(error) {
        res.status(500).send({ mensaje: 'Error al iniciar session ${error}'})
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