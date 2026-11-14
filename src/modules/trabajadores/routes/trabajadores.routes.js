import { Router } from "express";
import { registrar } from "../controllers/controller.js";
import { consultar } from "../controllers/controller.js";
import { desactivar } from "../controllers/controller.js";
import { consultarElTrabajadorPorNombre } from "../controllers/controller.js";
import { actualizarElTrabajador } from "../controllers/controller.js";
const routerTrabajadores = Router()

routerTrabajadores.post("/", registrar)
routerTrabajadores.get("/", consultar)
routerTrabajadores.patch("/actualizar", actualizarElTrabajador)
routerTrabajadores.patch("/:id", desactivar)
routerTrabajadores.get("/buscar", consultarElTrabajadorPorNombre)


export default routerTrabajadores