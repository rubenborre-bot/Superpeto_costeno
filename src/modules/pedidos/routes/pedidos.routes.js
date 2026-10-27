import { Router } from "express";
import { registrarElPedido } from "../controllers/controller.js";
import { consultarElPedido } from "../controllers/controller.js";
const routerPedidos = Router()

routerPedidos.post("/", registrarElPedido)
routerPedidos.get("/", consultarElPedido)

export default routerPedidos