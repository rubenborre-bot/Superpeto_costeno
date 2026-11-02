import { Router } from "express";
import { registrarLaEntrega, consultarLaEntrega } from "../controllers/entrega.controller.js";
const entregasRouter = Router();

entregasRouter.post("/", registrarLaEntrega);
entregasRouter.get("/", consultarLaEntrega);

export default entregasRouter;