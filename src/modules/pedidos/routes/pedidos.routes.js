import { Router } from "express";
import { registrarElPedido } from "../controllers/controller.js";

const routerPedidos = Router()

routerPedidos.post("/", registrarElPedido)


export default routerPedidos