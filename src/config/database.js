import { MongoClient } from "mongodb"
import uri from "../../atlas_uri.js"
const dbname = "superpeto_costeno"
const client = new MongoClient(uri) 
const collection_name = "configuracion"
const configuracionColeccion = client.db(dbname).collection(collection_name)
const equivalenciaNapaColeccion = client.db(dbname).collection("equivalencias_napa")
export const connectToDatabase = async ()=>{
    try{
        await client.connect();
        console.log(`Conectado a la base de datos ${dbname}`)
        await configuracionColeccion.createIndex({ tipo: 1 },
    { unique: true })
        await equivalenciaNapaColeccion.createIndex({tipo: 1},
          {unique: true}  
        )
    }catch(error){
       throw error
    }
};
export default client