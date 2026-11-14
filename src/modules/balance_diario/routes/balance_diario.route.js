import { Router } from "express";
import { consultarElBalanceDiario } from "../controllers/balance_diario.controller.js";
const routerBalanceDiario = Router()

routerBalanceDiario.get("/balance-diario", consultarElBalanceDiario)


export default routerBalanceDiario;