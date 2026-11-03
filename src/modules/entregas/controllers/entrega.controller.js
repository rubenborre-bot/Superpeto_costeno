import { registrarEntrega, consultarEntregas, corregirEntrega } from "../services/entrega.service.js";
export async function registrarLaEntrega(req, res) {
    try{
    const resultado = await registrarEntrega(req.body.nombres, req.body.apellidos, req.body.num, req.body.petosAdicionales);
    if(resultado.success){
        res.status(200).json({
            success: true,
            message: resultado.message,
        })
    }
    else{
        res.status(400).json({
            success: false,
            message: resultado.message
        })
    }
    }catch(error){
        console.error(error)
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error al registrar la entrega",
        })

    }
}
export async function consultarLaEntrega(req, res) {
    try{
        if(req.query.nombres == undefined && req.query.apellidos == undefined && req.query.fecha == undefined){
    const result = await consultarEntregas();
    if(result.success){
        res.status(200).json({
            success: true,
            message: result.message,
            entregas: result.entregas
        })
    }else{
        res.status(400).json({
            success: false,
            message: result.message
        })
    }
        }
        else{
    const resultado = await consultarEntregas(req.query.nombres, req.query.apellidos, req.query.fecha)
    if(resultado.success){
        res.status(200).json({
            success: true,
            message: resultado.message,
            entregas: resultado.entrega
        })
    }else{
        res.status(400).json({
            success: false,
            message: resultado.message
        })
    }
}
}catch(error){
console.error(error)
res.status(500).json({
    statusCode: 500,
    success: false,
    message: "Error al consultar los registros"
})
}
}

export async function corregirLaEntrega(req, res) {
    try{
    const resultado = await corregirEntrega(req.body.nombres, req.body.apellidos, req.body.fecha, req.body.nuevaCantidad, req.body.nuevosPetosAdicionales)
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
}catch(error){
    console.error(error)
    res.status(500).json({
        statusCode: 500,
        success: false,
        message: "Error al actualizar la entrega"
    })
}
}