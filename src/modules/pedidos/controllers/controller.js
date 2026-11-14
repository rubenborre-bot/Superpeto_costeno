import { registrarPedido } from "../services/service.js";
import { consultarPedidos } from "../services/service.js";
import { modificarPedido } from "../services/service.js";
import { consultarPedidoPorFecha } from "../services/service.js";
export async function registrarElPedido(req, res) {
    try {
        const resultado = await registrarPedido(req.body.id, req.body.cantidadSolicitada, req.body.fecha);
        if(resultado.success){
        res.status(201).json({
            message: resultado.message
        })
        }
        else{
         res.status(400).json({
            message: resultado.message
        })
        }
        
    } catch (error) {
        console.error(error)
        res.status(500).json({
            statusCode : 500,
            success: false,
            message: 'Error al registrar pedido',
        });
    }
}

export async function consultarElPedido(req, res) {
    try{
    const result = await consultarPedidos();
    if(result.success){
      res.status(200).json({
        pedidos: result.pedidos,
        message: result.message
      })
    }
    }
     catch(error){
        console.error(error)
        res.status(500).json({
          statusCode : 500,
          success: false,
          message: 'Error al consultar pedidos',
        })
    }
}
export async function modificarElPedido(req, res) {
    try {
        const result = await modificarPedido(req.params.id, req.body.nuevaCantidad);
        if(result.success){
           res.status(200).json({
            message: result.message
           })
        }
        else{
            res.status(400).json({
                message: result.message
            })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            statusCode :500,
            success: false,
            message: 'Error al modificar pedidos',
        })

    }
}
export async function consultarPedidoPorLaFecha(req, res) {
    try {
        const resultado = await consultarPedidoPorFecha(req.query.nombres, req.query.apellidos, req.query.fecha)
        if(resultado.success){
            res.status(200).json({
            message: resultado.message,
            pedido: resultado.pedido
           })
        }else{
            res.status(400).json({
                message: resultado.message
            })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            statusCode :500,
            success: false,
            message: 'Error al consultar el pedido por fecha',
        })
    }
    
}