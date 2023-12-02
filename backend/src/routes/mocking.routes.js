import { Router } from "express";
import { getMockingProducts } from "../controllers/mocking.controller.js";

const mockingRouter = Router();

mockingRouter.get("/mockingproducts", getMockingProducts);

export default mockingRouter;
