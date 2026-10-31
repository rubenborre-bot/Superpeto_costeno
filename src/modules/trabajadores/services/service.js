import client from "../../../config/database.js";
import { ObjectId } from "mongodb";
const collection_name = "trabajadores"
const dbname = "superpeto_costeno"
const trabajadoresColeccion = client.db(dbname).collection(collection_name)
export async function registrarTrabajador(nombres, apellidos) {
    if( nombres != undefined && nombres!= null && typeof nombres === "string"
        && apellidos != undefined && apellidos != null && typeof apellidos === "string"
    ){
        if(nombres.trim() != "" && apellidos.trim() != ""){
let nombreCompleto = nombres.trim().split(/\s+/).join(" ");
let apellidoCompleto = apellidos.trim().split(/\s+/).join(" ");
let trabajador = {
    "nombres": nombreCompleto.toLowerCase(),
    "apellidos": apellidoCompleto.toLowerCase(),
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