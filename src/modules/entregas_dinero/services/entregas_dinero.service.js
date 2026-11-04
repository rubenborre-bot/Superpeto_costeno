import client from "../../../config/database.js";
import { DateTime } from "luxon";
import { calcularNapa } from "../../equivalencia_napa/services/napa.service.js";
import { consultarEntregas } from "../../entregas/services/entrega.service.js";
import { consultarPrecios } from "../../configuracion/services/configuracion.service.js";
const collection_name = "entregas_dinero"
const dbname = "superpeto_costeno"
const entregasDineroColeccion = client.db(dbname).collection(collection_name)



export async function registrarEntregaDinero(nombres, apellidos, dineroRecibido) {
    if(Number.isFinite(dineroRecibido) && dineroRecibido>=0){
    let fecha = DateTime.now().setZone("America/Bogota")
    fecha = fecha.toFormat("yyyy-LL-dd");
    const resultadoEntregas = await consultarEntregas(nombres, apellidos, fecha)
    
     if(resultadoEntregas.success){
    let cantidadActual = resultadoEntregas.entrega.cantidadActual;
    let petosAdicionales = resultadoEntregas.entrega.petosAdicionalesActuales
    const resultadoPrecios = await consultarPrecios();
    if(resultadoPrecios.success){
    let calculoDineroEsperado = (cantidadActual*resultadoPrecios.precios.precioCucharon)+(petosAdicionales*resultadoPrecios.precios.precioPetoAdicional)
    let diferencia = calculoDineroEsperado-dineroRecibido;
    const entregasDineroObj = {
"entregaId": resultadoEntregas.entrega._id,
"trabajadorId":	resultadoEntregas.entrega.trabajadorId,
"fecha": resultadoEntregas.entrega.fecha,
"cantidadCucharones": resultadoEntregas.entrega.cantidadActual,
"petosAdicionales":	resultadoEntregas.entrega.petosAdicionalesActuales,
"precioCucharon":	resultadoPrecios.precios.precioCucharon,
"precioPetoAdicional":	resultadoPrecios.precios.precioPetoAdicional,
"dineroEsperado": calculoDineroEsperado,
"dineroRecibido": dineroRecibido,
"diferencia": diferencia,
"createdAt": new Date(),
"updatedAt": new Date(),
"historialCorrecciones": []
    }
    const duplicado = await entregasDineroColeccion.findOne({entregaId: resultadoEntregas.entrega._id, fecha: resultadoEntregas.entrega.fecha})
    if(duplicado == null){
    const registrar = await entregasDineroColeccion.insertOne(entregasDineroObj)
    return{
        success: true,
        message: `Entrega de dinero registrada correctamenete ${registrar.insertedId}`,
        dineroEsperado: calculoDineroEsperado,
        diferencia: diferencia
    }
}else{
    return{
        success: false,
        message: "Ya hay una entrega de dinero registrada con esos datos",
    }
}
    }
    else{
        return{
            success: false,
            message: resultadoPrecios.message,
        }
    }
     }else{
    return{
        success: false,
        message: resultadoEntregas.message,
    }
}
    }else{
    return{
        success: false,
        message: "El campo dinero recibido debe recibir un numero y ser mayor o igual a 0",
    }
}
}
export async function consultarEntregaDinero(nombres, apellidos, fecha) {
   if(nombres == undefined && apellidos == undefined && fecha == undefined){
    const result = await entregasDineroColeccion.find({});
    let resultArr = await result.toArray();
    if(resultArr.length > 0){
        return{
            success: true,
            message: "Entregas de dinero consultadas correctamente",
            entregas: resultArr
        }
    }
    else{
        return {
            success: true,
            message: "No hay entregas de dinero disponibles",
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
const resultadoEntregas = await consultarEntregas(nombreCompleto, apellidoCompleto, fecha)


        if(resultadoEntregas.success){
        const entrega = await entregasDineroColeccion.findOne({
            entregaId: resultadoEntregas.entrega._id,
            fecha: resultadoEntregas.entrega.fecha})
            if(entrega != null){
            return {
                success: true,
                message: "Entrega de dinero consultada por nombres y fecha exitosa",
                entrega: entrega
            }
        }
        else{
            return{
                success: false,
                message: `No se encontro la entrega  de dinero consultada por nombres: ${nombres} y fecha: ${fecha}`
            }
        }
        }
        else{
            return{
                success: false,
                message: "Entrega no encontrada"
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

export async function corregirEntregaDinero(nombres, apellidos, fecha, nuevoDineroRecibido) {
    if(Number.isFinite(nuevoDineroRecibido) && nuevoDineroRecibido>=0){
    let consultarEntrega = await consultarEntregaDinero(nombres, apellidos, fecha)
    if(consultarEntrega.success){
        if(nuevoDineroRecibido != consultarEntrega.entrega.dineroRecibido){
        const corregirEntrega = await entregasDineroColeccion.updateOne({
                _id: consultarEntrega.entrega._id,
                dineroRecibido: consultarEntrega.entrega.dineroRecibido 
            },
            {
                $set: {
                    dineroRecibido: nuevoDineroRecibido,
                    diferencia: consultarEntrega.entrega.dineroEsperado-nuevoDineroRecibido,
                    updatedAt: new Date()
                },
                $push: {
                    historialCorrecciones: {
                        dineroAnterior: consultarEntrega.entrega.dineroRecibido,
                        dineroNuevo: nuevoDineroRecibido,
                        fechaCorreccion: new Date(),
                    }
                }
            })
            if(corregirEntrega.matchedCount){
                if(corregirEntrega.modifiedCount){
               return{
                success: true,
                message: "Entrega de dinero corregida exitosamente"
                }
                }
                else{
                    return{
                success: true,
                message: "Se encontro el documento, pero la entrega de dinero no fue corregida exitosamente"
                }
                }
            }else{
                    return{
                success: false,
                message: "No se encontro el documento de registro de dinero de esos datos"
                }
                }
            }else{
                    return{
                success: false,
                message: "Debe colocar un en nuevo dinero recibido un valor diferente al actual para poder actualizarlo"
                }
                }
            
    }else{
         return{
                success: false,
                message: "No se encontro una entrega de dinero con esos datos"
            }
    }
}else{
         return{
                success: false,
                message: "El valor del nuevo dinero recibido debe ser un numero mayor o igual a 0"
            }
    }
}