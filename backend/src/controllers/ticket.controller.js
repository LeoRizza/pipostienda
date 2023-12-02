import { ticketModel } from "../models/ticket.models.js";
import { cartModel } from "../models/carts.models.js";
import crypto from 'node:crypto';

export const getTicket = async (req, res) => {
    const { id } = req.params;

    try {
        const ticket = await ticketModel.findById(id).populate('purchaser', 'email');

        if (ticket) {
            res.status(200).send({ respuesta: 'OK', mensaje: ticket });
        } else {
            res.status(404).send({ respuesta: 'Error en consultar Ticket', mensaje: 'Ticket Not Found' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ respuesta: 'Error en consulta de Ticket', mensaje: error.message });
    }
}

export const createTicket = async (req, res) => {
    try {
        const { cartId } = req.cookies;

        const randomBytes = crypto.randomBytes(16);
        const code = randomBytes.toString('hex');
        const currentTimestamp = Date.now();

        const calculateTotalAmount = (products) => {
            return products.reduce((total, product) => total + (product.quantity * product.id_prod.price), 0);
        };

        const [cart, existingTickets] = await Promise.all([
            cartModel.findById(cartId).populate('products.id_prod'),
            ticketModel.find({ purchaser: cartId })
        ]);

        if (!cart) {
            return res.status(404).send({ respuesta: 'Error en creación de Ticket', mensaje: 'Carrito no encontrado' });
        }

        if (existingTickets.length > 0) {
            return res.status(400).send({ respuesta: 'Error en creación de Ticket', mensaje: 'Ya existe un ticket para este carrito' });
        }

        const ticketData = {
            code: code,
            amount: calculateTotalAmount(cart.products),
            purchaser: cart.user || null,
            date: currentTimestamp
        };

        const newTicket = new ticketModel(ticketData);
        const savedTicket = await newTicket.save();

        res.status(201).send({ respuesta: 'OK', mensaje: savedTicket });
    } catch (error) {
        console.error('Error en creación de Ticket:', error);
        res.status(500).send({ respuesta: 'Error en creación de Ticket', mensaje: error.message });
    }
};


export const deleteTicket = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedTicket = await ticketModel.findByIdAndDelete(id);

        if (deletedTicket) {
            res.status(200).send({ respuesta: 'OK', mensaje: 'Ticket eliminado' });
        } else {
            res.status(404).send({ respuesta: 'Error en eliminar Ticket', mensaje: 'Ticket Not Found' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ respuesta: 'Error en eliminar Ticket', mensaje: error.message });
    }
}
