import { Router } from "express";
import { registrarLaEntregaDinero, consultarLaEntregaDinero, corregirLaEntregaDinero } from "../controllers/entregas_dinero.controller.js";
const routerEntregasDinero = Router()

routerEntregasDinero.post("/", registrarLaEntregaDinero)
routerEntregasDinero.get("/", consultarLaEntregaDinero)
routerEntregasDinero.patch("/", corregirLaEntregaDinero)

export default routerEntregasDinero