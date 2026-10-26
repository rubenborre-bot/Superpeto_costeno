import {connectToDatabase} from "./config/database.js"
import app from "./app.js"
const PORT = 3000;

const main = async ()=>{
    try{
      await connectToDatabase();
      app.listen(PORT, ()=>{
    console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`)
})
    }
    catch(error){
       console.error(`Error conectandose a la base de datos: ${error}`)
    }
};

main();

