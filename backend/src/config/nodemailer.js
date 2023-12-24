import nodemailer from 'nodemailer'

const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    service: 'gmail',
    auth: {
        user: 'leonardor.prueba1@gmail.com',
        pass: 'vmml pogl biaf sapl',
        authMethod: 'LOGIN'
    }
})

export const sendRecoveryMail = (email, recoveryLink) => {
    const mailOptions = {
        from: 'leonardor.prueba1@gmail.com',
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