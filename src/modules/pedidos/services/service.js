import client from "../../../config/database.js";
import { ObjectId } from "mongodb";
import { DateTime } from "luxon"
import { consultarTrabajadorPorNombre } from "../../trabajadores/services/service.js";
const collection_name = "pedidos"
const dbname = "superpeto_costeno"
const pedidosColeccion = client.db(dbname).collection(collection_name)
const trabajadoresColeccion = client.db(dbname).collection("trabajadores")
export async function registrarPedido(id, num) {
    const trabajador = await trabajadoresColeccion.findOne({ _id: new ObjectId(id) },
      { projection: { nombres: 1, activo: 1, createdAt: 1 } })
    if(trabajador !== null && trabajador.activo  && typeof num == "number" && num > 1){
   let fechaEntrega = DateTime.now().setZone("America/Bogota")
   if(fechaEntrega.hour > 13 || (fechaEntrega.hour === 13 && fechaEntrega.minute > 0)){
         fechaEntrega =  fechaEntrega.set({day: fechaEntrega.day+1});
          
    }
    fechaEntrega = fechaEntrega.toFormat("yyyy-LL-dd");

let pedido = {
    "trabajadorId": trabajador._id,
    "fechaEntrega": fechaEntrega,
    "cantidadSolicitada": num,
    "cantidadAcordada": num,
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "historialModificaciones" : []
}
const duplicado = await pedidosColeccion.findOne({ trabajadorId: trabajador._id , fechaEntrega })
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
    if(result != null && typeof nuevaCantidad == "number" && Number.isFinite(nuevaCantidad)){
       if(result.cantidadAcordada != nuevaCantidad && nuevaCantidad>1 ){
        let fechaActual = DateTime.now().setZone("America/Bogota")
        if(fechaActual.hour > 13 || (fechaActual.hour == 13 && fechaActual.minute>0)){
             return{
                success: false,
                message: "El pedido esta fuera del tiempo establecido para modificiacion"
             }
        }
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


export async function consultarPedidoPorFecha(nombres, apellidos, fecha) {

if(typeof fecha == "string"){
    if(fecha.trim() != ""){

         fecha = fecha.trim();
        if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {

    return {
        success: false,
        message: "La fecha debe tener el formato año-mes-dia"
    };

}
 let fechaArr = fecha.split("-")
  fechaArr = fechaArr.map((valor)=>{
    return parseInt(valor); 
 })

 let fechaCorregida = new Date(fechaArr[0], fechaArr[1]-1, fechaArr[2]);
 if(fechaArr[0]!= fechaCorregida.getFullYear() || fechaArr[1]-1 != fechaCorregida.getMonth() || fechaArr[2] != fechaCorregida.getDate()){
    return {
        success: false,
        message: "La fecha ingresada no es valida"
    }
 }

const resultado = await consultarTrabajadorPorNombre(nombres, apellidos)

if(resultado.success){
const resultadoPedido = await pedidosColeccion.findOne({trabajadorId: resultado.trabajador._id,
        fechaEntrega: fecha})


        if(resultadoPedido != null){
        
            return {
                success: true,
                message: "Pedido consultado por nombres y fecha exitosa",
                pedido: resultadoPedido
            }
        }
        else{
            return {
                success: false,
                message: "Pedido no encontrado",
            } 
        }
        
    }else{
    return{
        success: false,
        message: resultado.message
    }
}
    }else{
    return{
        success: false,
        message: "Los campos no pueden estar vacios"
    }
}
}else{
    return{
        success: false,
        message: "Ingrese valores validos para los campos"
    }
}
}
 
