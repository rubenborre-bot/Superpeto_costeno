import express from 'express'
import router from './routes/health.routes.js';
import routerTrabajadores from './modules/trabajadores/routes/trabajadores.routes.js';
import routerPedidos from './modules/pedidos/routes/pedidos.routes.js';
import entregasRouter from './modules/entregas/routes/entrega.route.js';
import configuracionRouter from './modules/configuracion/routes/configuracion.route.js';
import routerEquivalenciasNapa from './modules/equivalencia_napa/routes/napa.route.js';
import routerEntregasDinero from './modules/entregas_dinero/routes/entregas_dinero.route.js';
import routerPlanificacion from './modules/planificacion_produccion/routes/produccion.route.js';
import routerBalanceDiario from './modules/balance_diario/routes/balance_diario.route.js';
const app = express();
app.use(express.json());
app.use("/health", router)
app.use("/trabajadores", routerTrabajadores)
app.use("/pedidos", routerPedidos)
app.use("/entregas", entregasRouter)
app.use("/configuracion", configuracionRouter)
app.use("/equivalencias-napa", routerEquivalenciasNapa)
app.use("/entregas-dinero", routerEntregasDinero)
app.use("/produccion", routerPlanificacion)
app.use("/balance", routerBalanceDiario)
export default app;
