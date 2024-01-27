import 'dotenv/config'
import jwt from 'jsonwebtoken'

export const generateToken = (user, res) => {
    const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '24h' });

    // Configura la cookie
    res.cookie('jwtCookie', token, { httpOnly: true, secure: false });

    return token;
}


export const authToken = (req, res, next) => {
    /* const authHeader = req.headers.Authorization */
    const authHeader = req.headers.Authorization || req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send({ error: 'Usuario no autenticado' })
    }

    const token = authHeader.split(' ')[1]//borro el espacio y me quedo con el token [1] (bearer seria el 0)

    jwt.verify(token, process.env.JWT_SECRET, (error, credential) => {
        if (error) {
            return res.status(403).send({ error: 'Usuario no autorizado, token invalido' })
        }
    })

    req.user = credential.user
    next()

}