import { ticketModel } from "../models/ticket.models.js";

export const getTicket = async (req, res) => {
    const { id } = req.params;

    try {
        const ticket = await ticketModel.findById(id).populate('purchaser', 'email');

        if (ticket) {
            res.status(200).send({ respuesta: 'OK', mensaje: ticket });
        } else {
            res.status(404).send({ respuesta: 'Error en consultar Ticket', mensaje: 'Not Found' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ respuesta: 'Error en consulta de Ticket', mensaje: error.message });
    }
}

export const createTicket = async (req, res) => {
    const { cartId } = req.params;
    const currentTimestamp = Date.now();
    const randomCode = Math.floor(100000000000 + Math.random() * 900000000000);
    const calculateTotalAmount = (products) => {
        return products.reduce((total, product) => total + (product.quantity * product.id_prod.price), 0);
    };

    try {
        const cart = await cartModel.findById(cartId).populate('products.id_prod');

        if (!cart) {
            return res.status(404).send({ respuesta: 'Error en creación de Ticket', mensaje: 'Carrito no encontrado' });
        }

        const ticketData = {
            code: `${currentTimestamp}${randomCode}`,
            amount: calculateTotalAmount(cart.products),
            purchaser: cart.user,
            date: currentTimestamp
        };      
        
        const newTicket = new ticketModel(ticketData);
        const savedTicket = await newTicket.save();

        res.status(201).send({ respuesta: 'OK', mensaje: savedTicket });
    } catch (error) {
        console.log(error);
        res.status(500).send({ respuesta: 'Error en creación de Ticket', mensaje: error.message });
    }
}

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
