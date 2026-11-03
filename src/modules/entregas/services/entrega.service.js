import client from "../../../config/database.js";
import { DateTime } from "luxon";
const collection_name = "pedidos"
const dbname = "superpeto_costeno"
const pedidosColeccion = client.db(dbname).collection(collection_name)
const entregasColeccion = client.db(dbname).collection("entregas")
const trabajadoresColeccion = client.db(dbname).collection("trabajadores")

export async function registrarEntrega(nombres, apellidos, num, petosAdicionales) {
    if(typeof nombres == "string" && typeof apellidos == "string"){
    if(nombres.trim() != "" && apellidos.trim() != ""){
        let nombreCompleto = nombres.trim().split(/\s+/).join(" ").toLocaleLowerCase();
        let apellidoCompleto = apellidos.trim().split(/\s+/).join(" ").toLocaleLowerCase();
    const trabajador = await trabajadoresColeccion.findOne({ nombres: nombreCompleto, apellidos: apellidoCompleto})
    if(trabajador!= null && trabajador.activo){
      let fechaDeEntrega = DateTime.now().setZone("America/Bogota")  
       fechaDeEntrega = fechaDeEntrega.toFormat("yyyy-LL-dd");
    const pedido = await pedidosColeccion.findOne({ trabajadorId: trabajador._id , fechaEntrega: fechaDeEntrega})
    if(pedido !== null && typeof num == "number" && num > 1 && num < 400 && typeof petosAdicionales == "number" && Number.isInteger(petosAdicionales) && petosAdicionales >= 0){
let entrega = {
   "pedidoId": pedido._id,
   "trabajadorId":	pedido.trabajadorId,
   "fecha": pedido.fechaEntrega,
   "cantidadInicial": num,
   "cantidadActual": num,
   "petosAdicionalesIniciales": petosAdicionales,
   "petosAdicionalesActuales":	petosAdicionales,
   "estado": "Pendiente",
   "createdAt": new Date(),
   "updatedAt": new Date(),
   "historialMovimientos" : []
}
const duplicado = await entregasColeccion.findOne({ pedidoId: pedido._id})
   if(duplicado == null){
 let result = await entregasColeccion.insertOne(entrega)
 return {
                success: true,
                message: `Entrega insertada: ${result.insertedId}`
            }
    }else{
        return {
                success: false,
                message: "Ya hay una entrega creada con esos campos "
            }
        
    }
}else{
        return {
                success: false,
                message: "El pedido no esta registrado, la cantidad de cucharones no tiene un valor valido, la cantidad de peto adicional ingresada es incorrecta o el valor ingresado para los cucharones supera el maximo permitido"
            }
        
    }
}else{
    return{
        success: false,
        message: "Trabajador no encontrado o su estado no es activo"
    }
} 

}else{
    return{
        success: false,
        message: "Los campos nombres y apellidos deben tener valores validos"
    }
}
}else{
return{
        success: false,
        message: "No debe intrucir numeros en estos campos"
    }
}

}



export async function consultarEntregas(nombres, apellidos, fecha) {
 if(nombres == undefined && apellidos == undefined && fecha == undefined){
    const result = await entregasColeccion.find({});
    let resultArr = await result.toArray();
    if(resultArr.length > 0){
        return{
            success: true,
            message: "Entregas consultadas correctamente",
            entregas: resultArr
        }
    }
    else{
        return {
            success: true,
            message: "No hay entregas disponibles",
            entregas: resultArr
        }
    }
 }
else{
if(typeof nombres == "string" && typeof apellidos == "string" && typeof fecha == "string"){
    if(nombres.trim() != "" && apellidos.trim() != "" && fecha.trim() != ""){
        let nombreCompleto = nombres.trim().split(/\s+/).join(" ").toLocaleLowerCase();
        let apellidoCompleto = apellidos.trim().split(/\s+/).join(" ").toLocaleLowerCase();
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
 const trabajador = await trabajadoresColeccion.findOne({
            nombres: nombreCompleto,
            apellidos: apellidoCompleto
        })


        if(trabajador != null){
        const entrega = await entregasColeccion.findOne({
            trabajadorId: trabajador._id,
            fecha: fecha})
            if(entrega != null){
            return {
                success: true,
                message: "Entrega consultada por nombre y fecha exitosa",
                entrega: entrega
            }
        }
        else{
            return{
                success: false,
                message: `No se encontro la entrega consultada por nombres: ${nombres} y fecha: ${fecha}`
            }
        }
        }
        else{
            return{
                success: false,
                message: "Trabajador no encontrado"
            }
        }

    }else{
        return{
            success: false,
            message: "Debe llenar todos los campos"
        }
    }
 }else{
        return{
            success: false,
            message: "Para los nombre y apellidos no debe ingresar numero y deben ser valores validos"
        }
    }
}
}

export async function corregirEntrega(nombres, apellidos, fecha, nuevaCantidad, nuevosPetosAdicionales) {
    if(typeof nombres == "string" && typeof apellidos == "string" && typeof fecha == "string" && typeof nuevaCantidad == "number" && Number.isFinite(nuevaCantidad) && typeof nuevosPetosAdicionales == "number" &&  Number.isInteger(nuevosPetosAdicionales)){
        if(nombres.trim()!= "" && apellidos.trim()!= "" && fecha.trim() != "" && nuevaCantidad > 1 && nuevaCantidad < 400 && nuevosPetosAdicionales >= 0){
            let nombreCompleto = nombres.trim().split(/\s+/).join(" ").toLocaleLowerCase();
            let apellidoCompleto = apellidos.trim().split(/\s+/).join(" ").toLocaleLowerCase();
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

 const trabajador = await trabajadoresColeccion.findOne({ nombres: nombreCompleto, apellidos: apellidoCompleto})
 if(trabajador != null){
 const entrega = await entregasColeccion.findOne({trabajadorId: trabajador._id, fecha: fecha})
 if(entrega != null){
if(entrega.cantidadActual != nuevaCantidad || entrega.petosAdicionalesActuales != nuevosPetosAdicionales){
let historialMovimientos = {
    "cantidadAnterior":entrega.cantidadActual,
    "nuevaCantidad": nuevaCantidad,
    "petosAdicionalesAnteriores": entrega.petosAdicionalesActuales,
    "nuevosPetosAdicionales": nuevosPetosAdicionales,
    "fechaModificacion": new Date(),
}
const actualizar = await entregasColeccion.updateOne({
                _id: entrega._id,
                cantidadActual: entrega.cantidadActual,
                petosAdicionalesActuales: entrega.petosAdicionalesActuales
            },
            {
                $set: {
                    cantidadActual: nuevaCantidad,
                    petosAdicionalesActuales: nuevosPetosAdicionales,
                    updatedAt: new Date()
                },
                $push: { historialMovimientos: historialMovimientos }
            })
            if(actualizar.matchedCount != 0){
            if(actualizar.modifiedCount != 0){
                return{
                    success: true,
                    message: "Entrega modificada correctamente"
                }
            }else{
                return{
                    success: false,
                    message: "Error al modificar la entrega"
                }
            }
        }else{
            return{
                success: false,
                message: "No se encontro un documento con esos campos"
            }
        }

 }else{
    return{
        success: false,
        message: "Para actualizar la entrega debe colocar una cantidad de cucharones o de peto adicional diferente a la actual"
    }
 }
 }else{
    return{
        success: false,
        message: "No se ha encontrado la entrega"
    }
 }
 }else{
    return{
        success: false,
        message: "El trabajador no se ha encontrado"
    }
 }
        }else{
            return{
                success: false,
                message: "Los campos nombres, apellidos y fecha no pueden estar vacios, la nueva cantidad de cucharones debe ser mayor que 1 y no superar el limite maximo, la nueva cantidad de petos adicionales debe ser de 0 en adelante"
            }
        }
    }else{
        return{
            success: false,
            message: "Los campos nombre, fechas y apellidos deben ser valores que corresponden a cada campo y la nueva cantidad de cucharones y de peto adicional deben ser numeros"
        }
    }
}