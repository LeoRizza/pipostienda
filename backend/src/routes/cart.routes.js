import { Router } from "express";
import { getCart, postProduct, modifyProduct, deleteProduct, getCarts, purchaseCart, putCart, deleteCart } from "../controllers/cart.controller.js";
import { passportError, authorization } from "../utils/messagesError.js";

const cartRouter = Router()

cartRouter.get('/:id', getCart)
cartRouter.get('/', passportError('jwt'), authorization('admin'), getCarts)
cartRouter.post('/:cid/products/:pid', passportError('jwt'), authorization('user'), postProduct)
cartRouter.delete('/:cid/products/:pid', passportError('jwt'), authorization('user'), deleteProduct)
cartRouter.delete('/:cid', passportError('jwt'), authorization('user'), deleteCart)
cartRouter.put('/:cid', passportError('jwt'), authorization('user'), putCart)
cartRouter.put('/:cid/products/:pid', passportError('jwt'), authorization('user'), modifyProduct)
cartRouter.post('/:cid/purchase', passportError('jwt'), authorization('user'), purchaseCart)

export default cartRouter