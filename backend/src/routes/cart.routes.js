import { Router } from "express";
import { getCart, postProduct, modifyProduct, deleteProduct, getCarts, purchaseCart  } from "../controllers/cart.controller.js";
import { passportError, authorization } from "../utils/messagesError.js";

const cartRouter = Router()

cartRouter.get('/:id', getCart)
cartRouter.get('/', passportError('jwt'), authorization('admin'), getCarts)
cartRouter.post('/:cid/products/:pid', postProduct)
cartRouter.delete('/:cid/products/:pid', deleteProduct)
cartRouter.put('/:cid/products/:pid', modifyProduct)
cartRouter.post('/:cid/purchase', passportError('jwt'), authorization('user'), purchaseCart)

export default cartRouter