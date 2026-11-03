import { Router } from "express";
import { registrarLosPrecios, actualizarLosPrecio, consultarLosPrecios } from "../controllers/configuracion.controller.js";
const configuracionRouter = Router()

configuracionRouter.post("/", registrarLosPrecios)
configuracionRouter.patch("/", actualizarLosPrecio)
configuracionRouter.get("/", consultarLosPrecios)

export default configuracionRouter;