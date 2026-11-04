import { registrarEntregaDinero, consultarEntregaDinero, corregirEntregaDinero } from "../services/entregas_dinero.service.js";

export async function registrarLaEntregaDinero(req, res) {
    try {
        const resultado = await registrarEntregaDinero(req.body.nombres, req.body.apellidos, req.body.dineroRecibido)
        if(resultado.success){
            res.status(200).json({
                success: true,
                message: resultado.message,
                dineroEsperado: resultado.dineroEsperado,
                diferencia: resultado.diferencia,
            })
        }else{
            res.status(400).json({
                success: false,
                message: resultado.message
            })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: "Error al registrar la entrega de dinero"
        })
    }
}
export async function consultarLaEntregaDinero(req, res) {
    try{
           if(req.query.nombres == undefined && req.query.apellidos == undefined && req.query.fecha == undefined){
       const result = await consultarEntregaDinero();
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
       const resultado = await consultarEntregaDinero(req.query.nombres, req.query.apellidos, req.query.fecha)
       if(resultado.success){
           res.status(200).json({
               success: true,
               message: resultado.message,
               entrega: resultado.entrega
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

export async function corregirLaEntregaDinero(req, res) {
    try{
       const resultado = await corregirEntregaDinero(req.body.nombres, req.body.apellidos, req.body.fecha, req.body.nuevoDineroRecibido)
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
           message: "Error al actualizar la entrega de dinero"
       })
   } 
}