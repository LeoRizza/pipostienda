import nodemailer from 'nodemailer'
import 'dotenv/config'

const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.PASSWORD_EMAIL,
        authMethod: 'LOGIN'
    }
})

export const sendRecoveryMail = (email, recoveryLink) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Link para reestablecer su contraseña',
        text: `Haga click en el siguiente enlace para reestablecer su contraseña: ${recoveryLink}`
    }

    transport.sendMail(mailOptions, (error, info) => {
        if (error)
            console.error('Error al enviar el correo:', error);
        else
            console.log('Email enviado correctamente')
    })
}