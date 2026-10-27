import express from 'express'
import router from './routes/health.routes.js';
import routerTrabajadores from './modules/trabajadores/routes/trabajadores.routes.js';
import routerPedidos from './modules/pedidos/routes/pedidos.routes.js';
const app = express();
app.use(express.json());
app.use("/health", router)
app.use("/trabajadores", routerTrabajadores)
app.use("/pedidos", routerPedidos)
export default app;
