import { Router } from "express";
import { getUser, getUserById, putUser, deleteUser, passwordRecovery, resetPassToken, premiumUser, uploadFile } from "../controllers/users.controller.js";
import { passportError, authorization } from "../utils/messagesError.js";
import upload from '../config/multer.js';

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
// multer
userRouter.post('/upload/profile/:id', upload.array('profileImage', 1), uploadFile);
userRouter.post('/upload/product/:id', passportError('jwt'), authorization('admin'), upload.array('productImage', 4), uploadFile);
userRouter.post('/upload/document/:id', upload.array('document', 4), uploadFile);


export default userRouter