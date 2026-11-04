import { Router } from "express";
import { registrarLasEquivalencias, consultarLasEquivalencias, modificarLasEquivalencias, calcularLaNapa } from "../controllers/napa.controller.js";
const routerEquivalenciasNapa = Router()


routerEquivalenciasNapa.post("/", registrarLasEquivalencias)
routerEquivalenciasNapa.get("/", consultarLasEquivalencias)
routerEquivalenciasNapa.patch("/", modificarLasEquivalencias)
routerEquivalenciasNapa.post("/calculo", calcularLaNapa)

export default routerEquivalenciasNapa