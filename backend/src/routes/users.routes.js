import { Router } from "express";
import { getUser, getUserById, putUser, deleteUser, passwordRecovery, resetPassToken } from "../controllers/users.controller.js";

const userRouter = Router()

userRouter.get('/', getUser)
userRouter.get('/:id', getUserById)
userRouter.put('/:id', putUser)
userRouter.delete('/:id', deleteUser)
//recovery password
userRouter.post('/password-recovery', passwordRecovery);
userRouter.post('/reset-password/:token', resetPassToken);


export default userRouter