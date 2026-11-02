import client from "../../../config/database.js";
import { ObjectId } from "mongodb";
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
