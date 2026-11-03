import { registrarPrecios, actualizarPrecios, consultarPrecios } from "../services/configuracion.service.js";

export async function registrarLosPrecios(req, res) {
    try {
        const resultado = await registrarPrecios(req.body.precioCucharon, req.body.precioPetoAdicional)
        if(resultado.success){
            res.status(200).json({
                success: true,
                message: resultado.message
            })
        }
        else{
            res.status(400).json({
                success: false,
                message: resultado.message
            })
        }
    } catch (error) {
        console.error(error)
        if(error.code == 11000){
        res.status(409).json({
            statusCode: 409,
            success: false,
            message: "Ya hay un registro"
        })
    }
     else{
         res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error al registrar los precios"
         })
       }
}
}

export async function actualizarLosPrecio(req, res) {
    try {
        const resultado = await actualizarPrecios(req.body.precioCucharon, req.body.precioPetoAdicional)
        if(resultado.success){
            res.status(200).json({
                success: true,
                message: resultado.message,
                precios: resultado.precios,
            })
        }else{
            res.status(404).json({
                success: false,
                message: resultado.message
            })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error al actualizar los precios"
        })
    }
}
export async function consultarLosPrecios(req, res) {
    try{
    const resultado = await consultarPrecios()
    if(resultado.success){
         res.status(200).json({
                success: true,
                message: resultado.message,
                precios: resultado.precios,
            })
        }else{
            res.status(404).json({
                success: false,
                message: resultado.message
            })
        }
    }catch(error){
        console.error(error)
         res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error al consultar los precios"
        })
    }
    
}