import { Router } from "express";
import { getUser, getUserById, putUser, deleteUser, passwordRecovery, resetPassToken, premiumUser } from "../controllers/users.controller.js";
import { passportError, authorization } from "../utils/messagesError.js";

const userRouter = Router()

userRouter.get('/', passportError('jwt'), authorization('admin'), getUser)
userRouter.get('/:id', getUserById)
userRouter.put('/:id', passportError('jwt'), authorization('admin'), putUser)
userRouter.delete('/:id', passportError('jwt'), authorization('admin'), deleteUser)
//recovery password
userRouter.post('/password-recovery', passwordRecovery);
userRouter.post('/reset-password/:token', resetPassToken);
//premium
userRouter.put('/:id/update-premium', passportError('jwt'), authorization('admin'), premiumUser);

export default userRouter