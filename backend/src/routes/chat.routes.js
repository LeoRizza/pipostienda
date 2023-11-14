import { Router } from "express";
import { getMessages, postMessages } from "../controllers/chat.controller.js";
import { passportError, authorization } from "../utils/messagesError.js";


const chatRouter = Router()

chatRouter.get('/', getMessages)
chatRouter.post('/', passportError('jwt'), authorization('user'), postMessages)

export default chatRouter;
