import { Router } from "express";
import { registrar } from "../controllers/controller.js";
import { consultar } from "../controllers/controller.js";
import { desactivar } from "../controllers/controller.js";
const routerTrabajadores = Router()

routerTrabajadores.post("/", registrar)
routerTrabajadores.get("/", consultar)
routerTrabajadores.patch("/:id", desactivar)

export default routerTrabajadores