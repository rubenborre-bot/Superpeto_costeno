import { registrarEquivalencias, consultarEquivalencias, modificarEquivalencias, calcularNapa } from "../services/napa.service.js";
export async function registrarLasEquivalencias(req, res) {
    try{
    const resultado = await registrarEquivalencias(req.body.equivalencias)
    if(resultado.success){
        res.status(resultado.statusCode).json({
            success: true,
            message: resultado.message
        })
    }else{
        res.status(resultado.statusCode).json({
            success: false,
            message: resultado.message
        })
    }
    }catch(error){
        console.error(error)
        if(error.code == 11000){
            res.status(409).json({
                success: false,
                message: "Ya hay unas equivalencias de ñapa registradas"
            })
        }
        else{
            res.status(500).json({
                success: false,
                message: "Error al registrar las equivalencias de ñapa"
            })
        }
    }
}
export async function consultarLasEquivalencias(req, res) {
    try {
        const resultado = await consultarEquivalencias()
        if(resultado.success){
            res.status(200).json({
                success: true,
                message: resultado.message,
                equivalencias: resultado.equivalencias
            })
        }
        else{
            res.status(404).json({
                success: false,
                message: resultado.message,
            }) 
        }
    } catch (error) {
         res.status(500).json({
                success: false,
                message: "Error al consultar las equivalencias"
            })
    }
}
export async function modificarLasEquivalencias(req, res) {
    try{
    const resultado = await modificarEquivalencias(req.body.equivalencias)
    if(resultado.success){
        res.status(resultado.statusCode).json({
            success: true,
            message: resultado.message
        })
    }else{
        res.status(resultado.statusCode).json({
            success: false,
            message: resultado.message
        })
    }
    }catch(error){
        console.error(error)
            res.status(500).json({
                success: false,
                message: "Error al registrar las equivalencias de ñapa"
            })
    }
}
export async function calcularLaNapa(req, res) {
    try{
    const resultado = await calcularNapa(req.body.cantidadCucharones)
    if(resultado.success){
        res.status(200).json({
            success: true,
            message: resultado.message,
            napa: resultado.napa
        })
    }else{
        res.status(400).json({
            success: false,
            message: resultado.message
        })
    }
    }catch(error){
        console.error(error)
            res.status(500).json({
                success: false,
                message: "Error al calcular la ñapa"
            })
    }
}