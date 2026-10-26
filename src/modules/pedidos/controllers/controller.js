import { registrarPedido } from "../services/service.js";
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