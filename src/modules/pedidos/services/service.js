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
      { projection: { nombre: 1, activo: 1, createdAt: 1 } })
    if(trabajador !== null && trabajador.activo  && typeof num == "number" && num > 0){
let pedido = {
    "trabajadorId": trabajador._id,
    "fecha": fecha,
    "cantidadSolicitada": num,
    "createdAt": new Date(),
    "updatedAt": new Date()
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