import client from "../../../config/database.js";
import { DateTime } from "luxon";
const collection_name = "entregas_dinero"
const dbname = "superpeto_costeno"
const entregasDineroColeccion = client.db(dbname).collection(collection_name)

export async function consultarBalanceDiario(fecha){
    let fechaConsulta;
    if(fecha == null){
     fechaConsulta = DateTime.now().setZone("America/Bogota").toFormat("yyyy-LL-dd");
    }
    else{
     if(typeof fecha == "string"){
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
     fechaConsulta = fecha
     }
     else{
       return {
        success: false,
        message: "La fecha ingresada no es valida"
    } 
     }
    }
    
    const resultado = entregasDineroColeccion.aggregate([{$match: {fecha: fechaConsulta}},
        {$group: {_id:null,
        totalDineroEsperado: {$sum: "$dineroEsperado" },
        totalDineroRecibido: {$sum: "$dineroRecibido"}
        }}
    ])
    const resultadoArr = await resultado.toArray();
    if(resultadoArr.length > 0){
        return {   
    success: true,
    fecha: fechaConsulta,
    balanceDiario: {
        totalDineroEsperado: resultadoArr[0].totalDineroEsperado,
        totalDineroRecibido: resultadoArr[0].totalDineroRecibido,
        totalDiferencia: resultadoArr[0].totalDineroEsperado-resultadoArr[0].totalDineroRecibido
    }}
}else{
      return {   
    success: true,
    fecha: fechaConsulta,
    balanceDiario: {
        totalDineroEsperado: 0,
        totalDineroRecibido: 0,
        totalDiferencia: 0
    },
    message: "No hay resultados para ese dia"
    }
    }
}