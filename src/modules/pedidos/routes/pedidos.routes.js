import { Router } from "express";
import { registrarElPedido } from "../controllers/controller.js";
import { consultarElPedido } from "../controllers/controller.js";
import { modificarElPedido } from "../controllers/controller.js";
import { consultarPedidoPorLaFecha } from "../controllers/controller.js";
const routerPedidos = Router()

routerPedidos.post("/", registrarElPedido)
routerPedidos.get("/", consultarElPedido)
routerPedidos.patch("/:id", modificarElPedido)
routerPedidos.get("/pedido-fecha", consultarPedidoPorLaFecha)

export default routerPedidos