import { cartModel } from "../models/carts.models.js";
import { productModel } from "../models/products.models.js";
import { sendTicket } from "../config/nodemailer.js"
import { ticketModel } from "../models/ticket.models.js";

export const getCart = async (req, res) => {
    const { id } = req.params;

    try {
        const cart = await cartModel.findById(id).populate('products.id_prod');

        if (cart) {
            res.status(200).send({ respuesta: 'OK', mensaje: cart });
        } else {
            res.status(404).send({ respuesta: 'Error en consultar Carrito', mensaje: 'Not Found' });
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({ respuesta: 'Error en consulta carrito', mensaje: error });
    }
}

export const getCarts = async (req, res) => {
    const { limit } = req.query

    try {
        const carts = await cartModel.find().limit(limit)
        res.status(200).send({ respuesta: 'OK', mensaje: carts })
    } catch (error) {
        res.status(400).send({ respuesta: 'Error en traer carritos', mensaje: error })
    }
}

export const postProduct = async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        const cart = await cartModel.findById(cid);
        if (cart) {
            const prod = await productModel.findById(pid);

            if (prod) {
                const indice = cart.products.findIndex(item => item.id_prod._id == pid);
                if (indice !== -1) {
                    cart.products[indice].quantity += quantity;
                } else {
                    cart.products.push({ id_prod: pid, quantity: quantity });
                }

                const respuesta = await cartModel.findByIdAndUpdate(cid, { products: cart.products }, { new: true });
                res.status(200).send({ respuesta: 'OK', mensaje: respuesta });
            } else {
                res.status(404).send({ respuesta: 'Error en agregar producto al Carrito', mensaje: 'Producto no encontrado' });
            }
        } else {
            res.status(404).send({ respuesta: 'Error en agregar producto al Carrito', mensaje: 'Carrito no encontrado' });
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({ respuesta: 'Error en agregar producto al Carrito', mensaje: error.message });
    }
};

export const putCart = async (req, res) => {
    const { cid } = req.params;
    const productsArray = req.body;

    try {
        const cart = await cartModel.findById(cid);
        if (!cart) {
            return res.status(404).send({ respuesta: "Error", mensaje: "Carrito no encontrado" });
        }

        if (!Array.isArray(productsArray)) {
            return res.status(400).send({ respuesta: "Error", mensaje: "Los productos deben estar en un array" });
        }

        const updatedProducts = [];

        for (const prod of productsArray) {
            const product = await productModel.findById(prod.id_prod);

            if (!product) {
                return res.status(404).send({ respuesta: "Error", mensaje: `Producto con ID ${prod.id_prod} no encontrado` });
            }

            const updatedProduct = {
                id_prod: prod.id_prod,
                quantity: prod.quantity
            };

            updatedProducts.push(updatedProduct);
        }

        const updatedCart = await cartModel.findByIdAndUpdate(cid, { products: updatedProducts }, { new: true });

        res.status(200).send({
            mensaje: "Carrito actualizado exitosamente",
            carrito: updatedCart
        });
    } catch (error) {
        res.status(500).send({ respuesta: "Error", mensaje: "Ha ocurrido un error en el servidor" });
    }
};

export const modifyProduct = async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        const cart = await cartModel.findById(cid);

        if (cart) {
            const productIndex = cart.products.findIndex(item => item.id_prod._id == pid);

            if (productIndex != -1) {
                cart.products[productIndex].quantity = quantity;

                await cartModel.findByIdAndUpdate(cid, cart);

                res.status(200).send({ respuesta: 'OK', mensaje: 'Cantidad de producto actualizada en el carrito' });
            } else {
                res.status(404).send({ respuesta: 'Error en actualizar cantidad del producto en el Carrito', mensaje: 'Producto no encontrado en el carrito' });
            }
        } else {
            res.status(404).send({ respuesta: 'Error en actualizar cantidad del producto en el Carrito', mensaje: 'Carrito no encontrado' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ respuesta: 'Error en actualizar cantidad del producto en el Carrito', mensaje: error.message });
    }
}

export const deleteCart = async (req, res) => {
    const { cid } = req.params
    try {
        await cartModel.findByIdAndUpdate(cid, { products: [] })
        res.status(200).send({ respuesta: 'ok', mensaje: 'Carrito vacio' })
    } catch (error) {
        res.status(400).send({ respuesta: 'Error getting cart by id', mensaje: error })
    }
}

export const deleteProduct = async (req, res) => {
    const { cid, pid } = req.params;

    try {
        const cart = await cartModel.findById(cid);

        if (cart) {
            const productIndex = cart.products.findIndex(item => item.id_prod._id == pid);

            if (productIndex != -1) {
                cart.products.splice(productIndex, 1);

                await cartModel.findByIdAndUpdate(cid, cart);

                res.status(200).send({ respuesta: 'OK', mensaje: 'Producto eliminado del carrito' });
            } else {
                res.status(404).send({ respuesta: 'Error en eliminar producto del Carrito', mensaje: 'Producto no encontrado en el carrito' });
            }
        } else {
            res.status(404).send({ respuesta: 'Error en eliminar producto del Carrito', mensaje: 'Carrito no encontrado' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ respuesta: 'Error en eliminar producto del Carrito', mensaje: error.message });
    }
}

export const purchaseCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const { _id, email } = req.user.user;

        /*         console.log('UserID:', _id);
                console.log('CartID (token):', req.user.user.cart);
                console.log('CartID (ruta):', cid); */

        const userCartId = req.user.user.cart;

        if (!userCartId || userCartId.toString() !== cid) {
            console.log('El usuario no es el propietario de este carrito:', req.user);
            return res.status(403).send({ respuesta: 'Error', message: 'El usuario no es el propietario de este carrito' });
        }

        const cart = await cartModel.findById(cid);
        if (!cart) {
            return res.status(404).send({ respuesta: 'Error', message: `Carrito ${cid} no existe` });
        }

        let totalAmount = 0;
        const productsWithStock = [];
        const productsNoStock = [];

        if (req.body) {
            for (const cartProduct of cart.products) {
                const product = await productModel.findById(cartProduct.id_prod);

                if (!product) {
                    return res.status(404).send({ respuesta: 'Error', mensaje: `Producto ${cartProduct.id_prod} no existe` });
                }

                if (cartProduct.quantity <= product.stock) {
                    totalAmount += product.price * cartProduct.quantity;
                    product.stock -= cartProduct.quantity;
                    cartProduct.quantity = 0;
                    await productModel.findByIdAndUpdate(cartProduct.id_prod, product);
                    productsWithStock.push(cartProduct);
                } else {
                    productsNoStock.push(cartProduct);
                }
            }
        }

        const discountedAmount = req.user.premium ? totalAmount * 0.9 : totalAmount;

        const ticket = await ticketModel.create({ amount: discountedAmount, purchaser: email });
        if (ticket) {
            // Actualizar el carrito después de crear el ticket
            const updatedCart = await cartModel.findByIdAndUpdate(cid, { products: [] }, { new: true });

            if (updatedCart) {
                sendTicket(email, ticket);
                return res.status(200).send({ mensaje: 'Ticket creado satisfactoriamente', payload: { ticket } });
            }
        }

        res.status(500).send({ respuesta: 'Error', mensaje: 'Error del servidor' });
    } catch (error) {
        console.error('Error en finalización del carrito:', error);
        res.status(400).send({ res: 'Error en finalización del carrito', message: error.message });
    }
};

