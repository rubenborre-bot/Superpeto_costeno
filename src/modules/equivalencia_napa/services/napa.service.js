import client from "../../../config/database.js";
const collection_name = "equivalencias_napa"
const dbname = "superpeto_costeno"
const equivalenciaNapaColeccion = client.db(dbname).collection(collection_name)

export async function registrarEquivalencias(equivalencias) {
    if(Array.isArray(equivalencias) && equivalencias.length != 0){
         const comprobacion = equivalencias.every(element=>{
            return typeof element == "object" && element != null && !Array.isArray(element) && Number.isInteger(element.cucharonesReferencia) && element.cucharonesReferencia >= 1 && Number.isFinite(element.napaPetos) && element.napaPetos>0
        })
        if(comprobacion){
        let cucharonesRefUnicos = new Set();
        const compararCucharonesRef = equivalencias.map(element=>{
            cucharonesRefUnicos.add(element.cucharonesReferencia)
            return element.cucharonesReferencia 
        })

        if(cucharonesRefUnicos.size == compararCucharonesRef.length){
           const resultado = await equivalenciaNapaColeccion.findOne({tipo: "general"})
           if(resultado == null){
            let equivalenciasObj = {
                "tipo": "general",
                "equivalencias": equivalencias,
                    "createdAt": new Date(),
                    "updatedAt": new Date()
                }
             const insertEquivalencias = await equivalenciaNapaColeccion.insertOne(equivalenciasObj)
             return{
                statusCode: 200,
                success: true,
                message: `Equivalencias insertadas correctamente ${insertEquivalencias.insertedId}`
             }
           }else{
             return{
                statusCode: 409,
               success: false,
               message: "Ya hay unas equivalencias registradas" 
            }
           }

    }else{
    return{
       statusCode: 400,
       success: false,
       message: "Ya hay equivalencias para esos cucharones" 
    }
}
        }else{
    return{
       statusCode: 400, 
       success: false,
       message: "Las cantidades de cucharones deben ser números enteros mayores o iguales a 1, y la ñapa debe ser un número mayor que cero" 
    }
}
}else{
    return{
       statusCode: 400,
       success: false,
       message: "Debe ingresar por lo menos un dato" 
    }
}
}
export async function consultarEquivalencias() {
    const consultar = await equivalenciaNapaColeccion.findOne({tipo: "general"})
    if(consultar != null){
        return{
            success: true,
            message: "Equivalencias consultadas correctamenete",
            equivalencias: consultar
        }
    }
    else{
       return{
            success: false,
            message: "Equivalencias no encontradas"
        } 
    }
}
export async function modificarEquivalencias(equivalencias) {
    if(Array.isArray(equivalencias) && equivalencias.length != 0){
         const comprobacion = equivalencias.every(element=>{
            return typeof element == "object" && element != null && !Array.isArray(element) && Number.isInteger(element.cucharonesReferencia) && element.cucharonesReferencia >= 1 && Number.isFinite(element.napaPetos) && element.napaPetos>0
        })
        if(comprobacion){
        let cucharonesRefUnicos = new Set();
        const compararCucharonesRef = equivalencias.map(element=>{
            cucharonesRefUnicos.add(element.cucharonesReferencia)
            return element.cucharonesReferencia
        })

        if(cucharonesRefUnicos.size == compararCucharonesRef.length){
           const resultado = await equivalenciaNapaColeccion.findOne({tipo: "general"})
           if(resultado != null){
             const modificarEquivalencias = await equivalenciaNapaColeccion.updateOne({ tipo: "general" },
            {
                $set: {
                    equivalencias: equivalencias,
                    updatedAt: new Date()
                }
            })
             return{
                statusCode: 200,
                success: true,
                message: `Equivalencias actualizadas correctamente`
             }
           }else{
             return{
                statusCode: 404,
               success: false,
               message: "No hay equivalencias registradas" 
            }
           }

    }else{
    return{
       statusCode: 400,
       success: false,
       message: "Ya hay equivalencias para esos cucharones" 
    }
}
        }else{
    return{
       statusCode: 400, 
       success: false,
       message: "Las cantidades de cucharones deben ser números enteros mayores o iguales a 1, y la ñapa debe ser un número mayor que cero" 
    }
}
}else{
    return{
       statusCode: 400,
       success: false,
       message: "Debe ingresar por lo menos un dato" 
    }
}
}

export async function calcularNapa(cantidadCucharones) {
    const resultado = await equivalenciaNapaColeccion.findOne({tipo: "general"}) 
    if(resultado != null){
        if(Number.isFinite(cantidadCucharones) && cantidadCucharones>=1){
        const equivalencias = resultado.equivalencias.find(element=>{
            return element.cucharonesReferencia == Math.floor(cantidadCucharones)
        })
        if(equivalencias != undefined){
           const napaBase = equivalencias.napaPetos
           const fraccionSobrante = cantidadCucharones - Math.floor(cantidadCucharones)
           const operacion = ((fraccionSobrante*30)/(equivalencias.cucharonesReferencia*30))
           const napaAdicional = napaBase*operacion
           const napaTotal = napaAdicional+napaBase
           return{
            success: true,
            message: "La ñapa fue calculada correctamente",
            napa: napaTotal,
            equivalenciasNapa: equivalencias
           }
        }
        else{
            return{
                success: false,
                message: "No hay registro de equivalencias de ñapa para esa cantidad de cucharones"
            }
        }
    }else{
            return{
                success: false,
                message: "La cantidad de cucharones debe ser mayor o igual a 1"
            }
        }
}else{
            return{
                success: false,
                message: "No se encontro el registro"
            }
        }
}