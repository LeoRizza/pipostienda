import { Router } from "express";
import { getTicket, createTicket, deleteTicket } from "../controllers/ticket.controller.js";

const ticketRouter = Router()

ticketRouter.get('/:tid', getTicket)
ticketRouter.post('/purchase', createTicket)
ticketRouter.delete('/purchase/:tid', deleteTicket)

export default ticketRouter