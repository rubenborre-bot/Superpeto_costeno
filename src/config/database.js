import { MongoClient } from "mongodb"
import uri from "../../atlas_uri.js"
const dbname = "superpeto_costeno"
const client = new MongoClient(uri) 
export const connectToDatabase = async ()=>{
    try{
        await client.connect();
        console.log(`Conectado a la base de datos ${dbname}`)
    }catch(error){
       throw error
    }
};
export default client