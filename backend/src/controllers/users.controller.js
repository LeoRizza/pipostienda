import { userModel } from "../models/users.models.js";
import { sendRecoveryMail } from "../config/nodemailer.js";
import crypto from 'crypto';

const recoveryLinks = {};

export const getUser = async (req, res) => {
    try {
        const users = await userModel.find()
        res.status(200).send({ respuesta: 'Todos los usuarios', mensaje: users })
    } catch (error) {
        res.status(400).send({ respuesta: 'Error en consultar usuarios', mensaje: error })
    }
}

export const getUserById = async (req, res) => {
    const { id } = req.params
    try {
        const user = await userModel.findById(id)
        if (user) {
            res.status(200).send({ respuesta: 'Informacion de usuario', mensaje: user })
        } else {
            res.status(404).send({ respuesta: 'Error en consultar usuario', mensaje: 'User not Found' })
        }
    } catch (error) {
        res.status(400).send({ respuesta: 'Error en consultar usuario', mensaje: error })
    }
}

export const putUser = async (req, res) => {
    const { id } = req.params
    const { first_name, last_name, age, email, password } = req.body
    try {
        const user = await userModel.findByIdAndUpdate(id, { first_name, last_name, age, email, password })
        if (user) {
            res.status(200).send({ respuesta: 'Usuario modificado', mensaje: user })
        } else {
            res.status(404).send({ respuesta: 'Error en actualizar usuario', mensaje: 'User not Found' })
        }
    } catch (error) {
        res.status(400).send({ respuesta: 'Error en actualizar usuario', mensaje: error })
    }
}

export const deleteUser = async (req, res) => {
    const { id } = req.params
    try {
        const user = await userModel.findByIdAndDelete(id)
        if (user) {
            res.status(200).send({ respuesta: 'Usuario eliminado', mensaje: user })
        } else {
            res.status(404).send({ respuesta: 'Error en eliminar usuario', mensaje: 'User not Found' })
        }
    } catch (error) {
        res.status(400).send({ respuesta: 'Error en eliminar usuario', mensaje: error })
    }
}

//recuperacion contraseña

export const passwordRecovery = async (req, res) => {
    const { email } = req.body;

    try {
        // Genera un token único
        const token = crypto.randomBytes(20).toString('hex');

        // Buscar y actualizar el usuario con el token de recuperación
        const result = await userModel.findOneAndUpdate(
            { email },
            { $set: { recoveryToken: token } },
            { new: true } // Devuelve el documento actualizado
        );

        if (!result) {
            return res.status(404).send('Usuario no encontrado');
        }

        recoveryLinks[token] = { email, timestamp: Date.now() };

        // Construye la URL de recuperación con el token
        const recoveryLink = `http://localhost:8080/api/users/reset-password/${token}`;

        // Envía el correo de recuperación
        sendRecoveryMail(email, recoveryLink);

        res.status(200).send('Correo de recuperación enviado');
    } catch (error) {
        res.status(500).send(`Error al enviar el correo: ${error}`);
    }
};

export const resetPassToken = async (req, res) => {
    const { token } = req.params;
    const { newPassword, newPassword2 } = req.body;

    try {
        const linkData = recoveryLinks[token];

        if (linkData && Date.now() - linkData.timestamp <= 3600000) {
            const { email } = linkData;

            if (newPassword === newPassword2) {
                // Modificar usuario con nueva contraseña y limpiar el token de recuperación
                const user = await userModel.findOneAndUpdate(
                    { email, recoveryToken: token },
                    { password: newPassword, recoveryToken: null }
                );

                if (!user) {
                    return res.status(404).send('Usuario no encontrado');
                }

                delete recoveryLinks[token];

                return res.status(200).send('Contraseña modificada correctamente');
            } else {
                return res.status(400).send('Las contraseñas deben ser idénticas');
            }
        } else {
            return res.status(400).send('Token inválido o expirado. Pruebe nuevamente');
        }
    } catch (error) {
        return res.status(500).send(`Error al modificar la contraseña: ${error}`);
    }
};

export { recoveryLinks };

//premium user
export const premiumUser = async (req, res) => {
    const { id } = req.params;
    const { premium } = req.body;

    try {
        const user = await userModel.findByIdAndUpdate(id, { premium }, { new: true });

        if (user) {
            res.status(200).send({ respuesta: 'Estado premium actualizado', mensaje: user });
        } else {
            res.status(404).send({ respuesta: 'Error al actualizar estado premium', mensaje: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(400).send({ respuesta: 'Error al actualizar estado premium', mensaje: error });
    }
};

export const uploadFile = async (req, res) => {
    const { id } = req.params
    const files = req.files
    if (!files || files.length === 0) {
        return res.status(400).send({ respuesta: 'No se subieron archivos.' });
    }
    try {
        const user = await userModel.findById(id)
        if (!user) {
            return res.status(404).send({ respuesta: 'Usuario no encontrado.' });
        }
        const updatedDocuments = files.map(file => ({
            name: file.originalname,
            reference: file.path
        }))
        user.documents.push(...updatedDocuments);
        await user.save();

        res.status(200).send({
            respuesta: 'Documentos subidos exitosamente.',
            userId: user._id,
            documentos: user.documents
        });
    } catch (error) {
        console.error('Error al subir documentos:', error);
        res.status(500).send({ respuesta: 'Error al subir documentos' });
    }
}