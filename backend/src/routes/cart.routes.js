import { Router } from "express";
import { getCart, postProduct, modifyProduct, deleteProduct  } from "../controllers/cart.controller.js";

const cartRouter = Router()

cartRouter.get('/:id', getCart)
cartRouter.post('/:cid/products/:pid', postProduct)
cartRouter.delete('/:cid/products/:pid', deleteProduct)
cartRouter.put('/:cid/products/:pid', modifyProduct)

/* cartRouter.post('/', async (req, res) => {

    try {
        const cart = await cartModel.create({})
        res.status(200).send({ respuesta: 'OK', mensaje: cart })
    } catch (error) {
        res.status(400).send({ respuesta: 'Error en crear Carrito', mensaje: error })
    }
}) */

/* cartRouter.delete('/:cid', async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await cartModel.findByIdAndDelete(cid);

        if (cart) {
            res.status(200).send({ respuesta: 'OK', mensaje: 'Carrito y productos relacionados eliminados' });
        } else {
            res.status(404).send({ respuesta: 'Error en eliminar carrito', mensaje: 'Carrito no encontrado' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ respuesta: 'Error en eliminar carrito', mensaje: error.message });
    }
}); */

export default cartRouter