import client from "../../../config/database.js";
import { ObjectId } from "mongodb";
const collection_name = "trabajadores"
const dbname = "superpeto_costeno"
const trabajadoresColeccion = client.db(dbname).collection(collection_name)
export async function registrarTrabajador(nombres, apellidos, telefono) {
    if( nombres != undefined && nombres!= null && typeof nombres === "string"
        && apellidos != undefined && apellidos != null && typeof apellidos === "string" &&
    telefono != undefined && telefono != null && typeof telefono == "string" && telefono.trim() != ""){
        if(nombres.trim() != "" && apellidos.trim() != ""){
let nombreCompleto = nombres.trim().split(/\s+/).join(" ");
let apellidoCompleto = apellidos.trim().split(/\s+/).join(" ");
let trabajador = {
    "nombres": nombreCompleto.toLowerCase(),
    "apellidos": apellidoCompleto.toLowerCase(),
    "telefono": telefono.trim(),
    "activo": true,
    "createdAt": new Date(),
    "updatedAt": new Date()
}
 let result = await trabajadoresColeccion.insertOne(trabajador)
      return {
                success: true,
                message: `Documento insertado: ${result.insertedId}`
            }
    }else{
        return {
                success: false,
                message: "Debe ingresar un nombre y un apellido"
            }
        
    } }
     else{
        return {
                success: false,
                message: "Debe ingresar un nombre y apellido valido"
            }
        
    }  
 }
 export async function consultarTrabajador() {
 let result = await trabajadoresColeccion.find({})
      .project({_id: 1, nombres: 1, apellidos: 1, activo: 1 })          
      .sort({ createdAt: -1 })                  
      .limit(20)  
    
 return {
            success: true,
            trabajadores: await result.toArray()
            }
    }  
export async function consultarTrabajadorPorNombre(nombres, apellidos) {
    if(nombres != undefined && nombres!= null && typeof nombres == "string" && nombres.trim() != "" && apellidos != undefined && apellidos != null && typeof apellidos == "string" && apellidos.trim() != ""){
        let nombreCompleto = nombres.trim().split(/\s+/).join(" ");
        let apellidoCompleto = apellidos.trim().split(/\s+/).join(" ");
 let result = await trabajadoresColeccion.findOne({
            nombres: nombreCompleto.trim().toLowerCase(),
            apellidos: apellidoCompleto.trim().toLowerCase()
        });
        if(result !== null){
            return{
                success: true,
                trabajador: result
            }
        }
        else{
            return{
                success: false,
                message: "Trabajador no encontrado"
            }
        }
    }else{
        return {
                success: false,
                message: "Debe ingresar un nombre y apellido valido"
            }
        
    }   
} 
export async function desactivarTrabajador(id) {
    const resultado = await trabajadoresColeccion.findOneAndUpdate({ _id: new ObjectId(id) },
      { $set: { activo: false, updatedAt: new Date() } },
      { returnDocument: "after" })
      if(resultado != null){
       return {
            success: true,
            message: "Trabajador desactivado exitosamente"
            } 
      }else{
     return {
            success: false,
            message: "Trabajador no encontrado"
            }
        }
}
export async function actualizarTrabajador(nombres, apellidos, nuevosNombres, nuevosApellidos, nuevoTelefono) {
 let result = await consultarTrabajadorPorNombre(nombres, apellidos)
        if(result.success){
            if(nuevosNombres != undefined && nuevosNombres!= null && typeof nuevosNombres == "string" && nuevosNombres.trim() != "" 
            && nuevosApellidos != undefined && nuevosApellidos != null && typeof nuevosApellidos == "string" && nuevosApellidos.trim() != "" && nuevoTelefono != undefined && nuevoTelefono != null && typeof nuevoTelefono == "string" && nuevoTelefono.trim() != ""){
        let nombreCompleto = nuevosNombres.trim().split(/\s+/).join(" ");
        let apellidoCompleto = nuevosApellidos.trim().split(/\s+/).join(" ");
            let resultado = await trabajadoresColeccion.updateOne(
            {_id: result.trabajador._id},
        {
            $set: {
                nombres: nombreCompleto.toLowerCase(),
                apellidos: apellidoCompleto.toLowerCase(),
                telefono: nuevoTelefono.trim(),
                updatedAt: new Date()
            }
        })
        if(resultado.matchedCount>0){
            if(resultado.modifiedCount>0){
           return{
                success: true,
                message: `Trabajador actualizado de ${result.trabajador.nombres}-${result.trabajador.apellidos} a: ${nombreCompleto}-${apellidoCompleto}`
            }
        }else{
            return{
                success: false,
                message: "El trabajador ya tiene esos datos registrados. No se realizaron cambios"
            } 
        }
        }else{
           return{
                success: false,
                message: "Trabajador no encontrado"
            } 
        }
            
        }else{
        return {
                success: false,
                message: "Debe ingresar un nombre, apellido y numero de telefono valido"
            }
        
    }         
    }else{
            return{
                success: false,
                message: result.message
            }
        }
}