import { consultarBalanceDiario } from "../services/balance_diario.service.js";
export async function consultarElBalanceDiario(req, res) {
    try{
    const resultado = await consultarBalanceDiario(req.query.fecha)
    if(resultado.success){
        res.status(200).json(resultado)
    }
    else{
        res.status(400).json({
            success: false,
            message: resultado.message
        })
    }
}catch(error){
    console.error(error)
    res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error al consultar balance diario"
    })
}
}