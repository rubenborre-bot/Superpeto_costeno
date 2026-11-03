import client from "../../../config/database.js";
import { DateTime } from "luxon";
const collection_name = "configuracion"
const dbname = "superpeto_costeno"
const configuracionColeccion = client.db(dbname).collection(collection_name)

export async function registrarPrecios(precioCucharon, precioPetoAdicional) {
    if(typeof precioCucharon == "number" && Number.isFinite(precioCucharon) && precioCucharon > 0 && typeof precioPetoAdicional == "number" && Number.isFinite(precioPetoAdicional) && precioPetoAdicional >0){
    const configuracion = await configuracionColeccion.findOne({})
    if(configuracion == null){
         let fecha = new Date()
        let configuracionObj = {
           "precioCucharon": precioCucharon,
           "precioPetoAdicional": precioPetoAdicional,
           "tipo": "general",
           "createdAt": fecha,
           "updatedAt": fecha,
        }
        const insertar = await configuracionColeccion.insertOne(configuracionObj)
        return{
            success: true,
            message: `Configuracion insertada correctamente ${insertar.insertedId}`
        }
    }
    else{
        return{
            success: false,
            message: "Ya hay una configuracion insertada, solo la puede actualizar"
        }
    }
    }else{
        return{
            success: false,
            message: "El precio para el cucharon y para las unidades de peto adicional deben ser numeros mayores que 0"
        }
    }
}

export async function actualizarPrecios(precioCucharon, precioPetoAdicional) {
    if(typeof precioCucharon == "number" && Number.isFinite(precioCucharon)  && typeof precioPetoAdicional == "number" && Number.isFinite(precioPetoAdicional)){
        if(precioCucharon > 0 && precioPetoAdicional > 0 ){
        const configuracion = await configuracionColeccion.findOne({tipo: "general"})
        if(configuracion != null){
            const actualizarPrecio = await configuracionColeccion.updateOne( {tipo: "general"},
            {
                $set: {
                    precioCucharon: precioCucharon,
                    precioPetoAdicional: precioPetoAdicional,
                    updatedAt: new Date()
                }
            })
            if(actualizarPrecio.matchedCount != 0){
                const preciosActualizados = await configuracionColeccion.findOne({tipo: "general"})
                if(actualizarPrecio.modifiedCount != 0){
                    
            return{
                success: true,
                message: "Precios actualizados correctamente",
                precios: preciosActualizados
            }
        }else{
            return{
            success: true,
            message: "Precios no modificados",
            precios: preciosActualizados,
        }
        }
    }else{
        return{
            success: false,
            message: "Registro no encontrado"
        }
    }
        }else{
            return{
            success: false,
            message: "Registro no encontrado" 
            }
        }
    }else{
        return{
            success: false,
            message: "Los precios deben ser mayores que 0" 
            }
    }
}else{
    return{
            success: false,
            message: "Debe ingresar numeros en los campos" 
            }
}
}

export async function consultarPrecios() {
    const precios = await configuracionColeccion.findOne({tipo: "general"})
    if(precios != null){
        return{
            success: true,
            message: "Precios consultados correctamente",
            precios: precios
        }
    }else{
        return{
            success: false,
            message: "No existe una configuración de precios registrada",
            precios: precios
        }
    }
}