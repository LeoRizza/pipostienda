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

export const sendTicket = (email, ticket) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Ticket de su compra',
        html: `<div>
            <h1>Pipos tienda</h1>
            ${ticket.purchaser},<br/>

            Gracias por comprar con nosotros. El código de tu ticket es: ${ticket.code}.<br/>
            La compra fue realizada el día ${ticket.purchase_datetime}.<br/>

            Estamos a su disposición por cualquier consulta.<br/>

            Muchas gracias,<br/>
            El que manda los ticket<br/>
            <h3>Información de su compra</h3>
            <b>Código: ${ticket.code}</b><br/>
            <b>Comprador: ${ticket.purchaser}</b><br/>
            <b>Precio: $${ticket.amount}</b><br/>
            <b>Fecha de compra: ${ticket.purchase_datetime}</b><br/>
        </div>`,
    };

    transport.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            return;
        }
        console.log('Email enviado correctamente');
    });
};

export const deletedUser = (email) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Usuario eliminado.',
        html: `<div><h1>Su usuario ha sido eliminado</h1><br/>
        <h4>Cumplimos en informarle que su usuario ha sido eliminado por inactividad ya que ha pasado demasiado tiempo desde su ultima conexion.</h4><br/>
        <p>Saludos cordiales, Pipos tienda.</p></div>`
    }
    transport.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error)
        } else {
            console.log('Email enviado correctamente')
        }
    })
}