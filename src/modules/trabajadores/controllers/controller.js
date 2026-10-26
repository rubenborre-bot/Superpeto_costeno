import { registrarTrabajador} from "../services/service.js";
import { consultarTrabajador } from "../services/service.js";
import { desactivarTrabajador } from "../services/service.js";
export async function registrar(req, res) {
    try {
        const resultado = await registrarTrabajador(req.body.nombre);
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
            message: 'Error al registrar trabajador',
        });
    }
}

export async function consultar(req, res) {
try {
    const resultado = await consultarTrabajador();
    if(resultado.success){
      res.status(200).json({
         trabajadores: resultado.trabajadores
      })
    }
    else{
        res.status(500).json({
            success: false,
            message: "Error al realizar la consulta"
        })
    }
} catch (error) {
    console.error(error)
    res.status(500).json({
        statusCode : 500,
        success: false,
        message: 'Error al consultar trabajadores',
    })
}
    
}
export async function desactivar(req, res) {
    try {
        const resultado = await desactivarTrabajador(req.params.id)
        if(resultado.success){
            res.status(200).json({
                message: "Estado del trabajador actualizado correctamente"
            })
        }
        else{
            res.status(404).json({
                message: "No encontrado"
            })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({
            statusCode : 500,
        success: false,
        message: 'Error al actulizar estado del trabajador',
        })
    }
    
}