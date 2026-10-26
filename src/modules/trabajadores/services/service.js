import client from "../../../config/database.js";
import { ObjectId } from "mongodb";
const collection_name = "trabajadores"
const dbname = "superpeto_costeno"
const trabajadoresColeccion = client.db(dbname).collection(collection_name)
export async function registrarTrabajador(nombre) {
    if( nombre != undefined && nombre!= null && typeof nombre === "string"){
    if(nombre.trim() != ""){
let trabajador = {
    "nombre": nombre.trim(),
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
                message: "Debe ingresar un nombre"
            }
        
    } }
     else{
        return {
                success: false,
                message: "Debe ingresar un nombre valido y no debe ingresar numeros"
            }
        
    }  
 }
 export async function consultarTrabajador() {
 let result = await trabajadoresColeccion.find({})
      .project({ nombre: 1, activo: 1 })          
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