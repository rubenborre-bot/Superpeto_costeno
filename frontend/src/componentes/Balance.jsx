import { useState, useEffect, Fragment } from "react";
export function Balance(){
    const [fecha, setFecha] = useState("")
    const [balance, setBalance] = useState(null)
    function listarBalance(){
        fetch(`http://localhost:3000/balance/balance-diario?fecha=${fecha}`)
        .then((response)=>{
            return response.json()
        })
        .then((response)=>{
            setBalance(response)
        })
    }
    return(
        <>
       <div className="modulo">
        <section className="tarjeta buscador">
            <label>Buscar balance por fecha</label>
            <input value={fecha} onChange={(e)=>{setFecha(e.target.value)}} placeholder="fecha"></input>
            <button onClick={()=>{listarBalance()}} className="boton boton-principal">Consultar balance</button>
         </section>   
            
            {balance && 
            <div className="resultado">
            <Fragment>
            <p><h3 className="titulo-elemento">Balance</h3></p>
            <p>{`Fecha de consulta: ${balance.fecha}`}</p>
            <p>{`Total dinero esperado:  ${balance.balanceDiario.totalDineroEsperado}`}</p>
            <p>{`Total dinero recibido:  ${balance.balanceDiario.totalDineroRecibido}`}</p>
            <p>{`Total diferencia:  ${balance.balanceDiario.totalDiferencia}`}</p> 
            </Fragment>
            </div>
             }
       </div>
        </>
    )
}