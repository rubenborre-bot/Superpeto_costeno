import client from "../../../config/database.js";
import { ObjectId } from "mongodb";
const collection_name = "pedidos"
const dbname = "superpeto_costeno"
const pedidosColeccion = client.db(dbname).collection(collection_name)
const trabajadoresColeccion = client.db(dbname).collection("trabajadores")
export async function registrarPedido(id, num, fecha) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return {
        success: false,
        message: "La fecha debe tener el formato YYYY-MM-DD"
    };
}
 let fechaArr = fecha.split("-")
  fechaArr = fechaArr.map((valor)=>{
    return parseInt(valor); 
 })
  if(fechaArr.some(Number.isNaN)){
         return {
        success: false,
        message: "Para la fecha debe ingresar numeros"
    }
}
 

 let fechaCorregida = new Date(fechaArr[0], fechaArr[1]-1, fechaArr[2]);
 if(fechaArr[0]!= fechaCorregida.getFullYear() || fechaArr[1]-1 != fechaCorregida.getMonth() || fechaArr[2] != fechaCorregida.getDate()){
    return {
        success: false,
        message: "La fecha ingresada no es valida"
    }
 }
    const trabajador = await trabajadoresColeccion.findOne({ _id: new ObjectId(id) },
      { projection: { nombres: 1, activo: 1, createdAt: 1 } })
    if(trabajador !== null && trabajador.activo  && typeof num == "number" && num > 0){
let pedido = {
    "trabajadorId": trabajador._id,
    "fecha": fecha,
    "cantidadSolicitada": num,
    "cantidadAcordada": num,
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "historialModificaciones" : []
}
const duplicado = await pedidosColeccion.findOne({ trabajadorId: new ObjectId(id), fecha })
   if(duplicado == null){
 let result = await pedidosColeccion.insertOne(pedido)
 return {
                success: true,
                message: `Pedido insertado: ${result.insertedId}`
            }
    }else{
        return {
                success: false,
                message: "Ya hay un pedido creado con esos campos "
            }
        
    }
}else{
        return {
                success: false,
                message: "El trabajador no esta registrado, esta inactivo o la cantidad de cucharones ingresada es incorrecta"
            }
        
    }  
}

export async function consultarPedidos() {
    const result = await pedidosColeccion.find({});
      let pedidos = await result.toArray();
    if(pedidos.length > 0){
        return {
            success: true,
            pedidos: pedidos,
            message: `Pedidos encontrados` 
        }
    }
    else{
        return{
         success: true,
         pedidos: pedidos,
         message: `Pedidos no encontrados`
        }
    }
}
export async function modificarPedido(id, nuevaCantidad) {
    const result = await pedidosColeccion.findOne({ _id: new ObjectId(id) })
    if(result != null && typeof nuevaCantidad == "number" && !Number.isNaN(nuevaCantidad)){
       if(result.cantidadAcordada != nuevaCantidad && nuevaCantidad>1 ){
        const actualizar = await pedidosColeccion.updateOne({ _id: new ObjectId(id) },
                {
                    $set: { cantidadAcordada: nuevaCantidad },
                    $push: {
                        historialModificaciones: {
                            cantidadAnterior: result.cantidadAcordada,
                            nuevaCantidad: nuevaCantidad,
                            fechaModificacion: new Date()
                        }
                    }
                })
    if(actualizar.modifiedCount != 0){
return{
            success: true,
            message: "Pedido actualizado correctamente",
        }
    }
    else{
       return{
            success: false,
            message: "Pedido no actualizado correctamente",
        } 
    }
        
       }
       else{
        return {
            success: false,
            message: "Debe colocar una cantidad diferente a la actual o la nueva cantidad debe ser mayor que 1"
        }
       }
    }
    else{
        return {
            success: false,
            message: "Pedido no encontrado o ingreso un valor que no es un numero"
        }
    }
}