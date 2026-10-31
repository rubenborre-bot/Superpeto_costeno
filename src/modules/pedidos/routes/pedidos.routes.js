import { Router } from "express";
import { registrarElPedido } from "../controllers/controller.js";
import { consultarElPedido } from "../controllers/controller.js";
import { modificarElPedido } from "../controllers/controller.js";
const routerPedidos = Router()

routerPedidos.post("/", registrarElPedido)
routerPedidos.get("/", consultarElPedido)
routerPedidos.patch("/:id", modificarElPedido)

export default routerPedidos