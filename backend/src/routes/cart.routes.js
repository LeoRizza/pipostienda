import { Router } from "express";
import { getCart, postProduct, modifyProduct, deleteProduct  } from "../controllers/cart.controller.js";

const cartRouter = Router()

cartRouter.get('/:id', getCart)
cartRouter.post('/:cid/products/:pid', postProduct)
cartRouter.delete('/:cid/products/:pid', deleteProduct)
cartRouter.put('/:cid/products/:pid', modifyProduct)

export default cartRouter