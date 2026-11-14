import { consultarPlanificacionProduccion } from "../services/produccion.service.js";

export async function consultarLaPlanificacionProduccion(req, res) {
    try{
    const resultado = await consultarPlanificacionProduccion()
    res.status(200).json(resultado)
    }catch(error){
        console.error(error)
       res.status(500).json({
         statusCode : 500,
            success: false,
            message: 'Error al consultar la planificacion',
       })
    }
    
}