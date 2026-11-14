import client from "../../../config/database.js"
import { DateTime } from "luxon"
const collection_name = "pedidos"
const dbname = "superpeto_costeno"
const pedidosColeccion = client.db(dbname).collection(collection_name)
export async function consultarPlanificacionProduccion(){
const fecha = DateTime.now()
    .setZone("America/Bogota");
const fechaActual = fecha.toFormat("yyyy-LL-dd");

const fechaCorte = fecha.set({ hour: 7, minute: 30, second: 0, millisecond: 0 })
    .toJSDate();

    const resultado = pedidosColeccion.aggregate([
        {
            $match:{fechaEntrega: fechaActual}
        },
        {$addFields: {creadoAntesDelCorte: {$lte: ["$createdAt", fechaCorte]}}},
        {$addFields: {modificacionesAntesDelCorte: {$filter: {
        input: "$historialModificaciones",
        as: "modificacion",
        cond: { $lte : ["$$modificacion.fechaModificacion", fechaCorte]}
    }}}},
    {
      $addFields: {
        cantidadInicial:{  
    $cond:{
        if: "$creadoAntesDelCorte",
        then:{

        $let: {
        vars: {
            ultimaModificacion:  {$arrayElemAt: ["$modificacionesAntesDelCorte", -1]}
        },
        in: {$ifNull: ["$$ultimaModificacion.nuevaCantidad", "$cantidadSolicitada"]}}

    },
    else: 0
}}}},
{$group: {_id: null,
    totalInicial: {$sum: "$cantidadInicial"},
    totalActual: {$sum: "$cantidadAcordada"}
}},
{$addFields: {
    maizInicialKg: {$round: [{$multiply: ["$totalInicial", 0.4375]}, 3]},
    maizActualKg: {$round: [{$multiply: ["$totalActual", 0.4375 ]}, 3]}
}}
   
    ])
    let produccion = (await resultado.toArray())[0]
    if(produccion !== undefined){
       return {   
    success: true,
    fecha: fechaActual,
    planificacionInicial: {
        cucharones: produccion.totalInicial,
        kilogramosMaiz: produccion.maizInicialKg
    },
    planificacionActual: {
        cucharones: produccion.totalActual,
        kilogramosMaiz: produccion.maizActualKg
    }
    }
        
    }
    else{
        return {   
    success: true,
    fecha: fechaActual,
    planificacionInicial: {
        cucharones: 0,
        kilogramosMaiz: 0
    },
    planificacionActual: {
        cucharones: 0,
        kilogramosMaiz: 0
    }
    }
    }

}