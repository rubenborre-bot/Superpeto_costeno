import { Router } from "express";
import { consultarLaPlanificacionProduccion } from "../controllers/produccion.controller.js";
const routerPlanificacion = Router()

routerPlanificacion.get("/planificacion-produccion", consultarLaPlanificacionProduccion)

export default routerPlanificacion;