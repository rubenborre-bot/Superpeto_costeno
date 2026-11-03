import { Router } from "express";
import { registrarLaEntrega, consultarLaEntrega, corregirLaEntrega } from "../controllers/entrega.controller.js";
const entregasRouter = Router();

entregasRouter.post("/", registrarLaEntrega);
entregasRouter.get("/", consultarLaEntrega);
entregasRouter.patch("/", corregirLaEntrega);

export default entregasRouter;