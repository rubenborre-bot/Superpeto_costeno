import { useState, useEffect } from "react";
import { Fragment } from "react";
export function EntregaDinero(){
const [entregasDinero, setEntregasDinero] = useState([])    
const [entregaDineroEditando, setEntregaDineroEditando] = useState(null)
const [dineroRecibido, setDineroRecibido] = useState("")
const [nombres, setNombres] = useState("")
const [apellidos, setApellidos] = useState("")
const [fecha, setFecha] = useState("")
const [nuevoDineroRecibido, setNuevoDineroRecibido] = useState("")
const [trabajadorNombres, setTrabajadorNombres] = useState("")
const [trabajadorApellidos, setTrabajadorApellidos] = useState("")
const [buscarFecha, setBuscarFecha] = useState("")
const [entregaDinero, setEntregaDinero] = useState({})
 function listarEntregasDinero(){
        fetch("http://localhost:3000/entregas-dinero")
        .then((response)=>{
            return response.json()
        })
        .then((response)=>{
            setEntregasDinero(response.entregas)
        })
    }
      useEffect(listarEntregasDinero, [])    

     function registrarEntregaDinero(){
        let entregaObj = {
        nombres: nombres,
        apellidos: apellidos,
        dineroRecibido: Number(dineroRecibido),
     }
    fetch("http://localhost:3000/entregas-dinero", {method:"POST",  headers:{ "Content-Type": "application/json"}, body: JSON.stringify(entregaObj)})
    .then((response)=>{
        return response.json()
    })
    .then((response)=>{
        if(response.success){
            listarEntregasDinero()
        }
    })
    }
     function actualizarEntregaDinero(){
        let entregaObj = {
        nombres: nombres,
        apellidos: apellidos,
        fecha: fecha,
        nuevoDineroRecibido: Number(nuevoDineroRecibido),
     }
     fetch("http://localhost:3000/entregas-dinero", {method:"PATCH",  headers:{ "Content-Type": "application/json"}, body: JSON.stringify(entregaObj)})
     .then((response)=>{
        return response.json()
    })
    .then((response)=>{
        if(response.success){
           listarEntregasDinero()
           cancelarEdicion()
        }
    })
    }      
function cancelarEdicion(){
      setEntregaDineroEditando(null)
      setNombres("")
      setApellidos("")
      setFecha("")
      setDineroRecibido("")
      setNuevoDineroRecibido("")
      
    }
     function editarEntregaDinero(fecha, nuevoDineroRecibido){
       setFecha(fecha)
       setNuevoDineroRecibido(nuevoDineroRecibido)
    }
    function consultarEntregaDineroPorFecha(){
        fetch(`http://localhost:3000/entregas-dinero?nombres=${trabajadorNombres}&apellidos=${trabajadorApellidos}&fecha=${buscarFecha}`)
        .then((response)=>{
            return response.json()
        })
        .then((response)=>{
            if(response.success){
            setEntregaDinero(response.entrega)
            }
            else{
                setEntregaDinero({})
            }
        })
    }
    return(
        <>
     <div className="modulo">
                <h1 className="titulo-modulo">Entregas de dinero</h1>
                <section className="tarjeta formulario">
                <label>Registrar o actualizar entrega</label>
                <input value={nombres} onChange={(e)=>{setNombres(e.target.value)}} placeholder="nombres"></input>
                <input value={apellidos} onChange={(e)=>{setApellidos(e.target.value)}} placeholder="apellidos"></input>
                {entregaDineroEditando?<input value={nuevoDineroRecibido} onChange={(e)=>{setNuevoDineroRecibido(e.target.value)}} placeholder="nuevo dinero recibido"></input>:<input value={dineroRecibido} onChange={(e)=>{setDineroRecibido(e.target.value)}} placeholder="dinero recibido"></input>}
                {entregaDineroEditando && <input value={fecha} onChange={(e)=>{setFecha(e.target.value)}} placeholder="fecha" disabled={true}></input>}
                <button onClick={registrarEntregaDinero} disabled={entregaDineroEditando} className="boton boton-principal">Registrar entrega dinero</button>
                <button onClick={actualizarEntregaDinero} disabled={!entregaDineroEditando} className="boton boton-principal">Actualizar entrega dinero</button>
                </section>
                <section className="tarjeta buscador">
                <label>Consultar entrega de dinero por nombres y fecha</label>
                <input value={trabajadorNombres} onChange={(e)=>{setTrabajadorNombres(e.target.value)}} placeholder="nombres"></input>
                <input value={trabajadorApellidos} onChange={(e)=>{setTrabajadorApellidos(e.target.value)}} placeholder="apellidos" ></input>
                <input value={buscarFecha} onChange={(e)=>{setBuscarFecha(e.target.value)}} placeholder="fecha" ></input>
                <button onClick={consultarEntregaDineroPorFecha} className="boton boton-principal">Consultar entrega dinero</button>
                {entregaDinero._id && <div className="resultado"><p>{entregaDinero.fecha}</p>
                <p>{`Cantidad cucharones: ${entregaDinero.cantidadCucharones}`}</p>
                <p>{`Petos adicionales: ${entregaDinero.petosAdicionales}`}</p>
                <p>{`Dinero esperado: ${entregaDinero.dineroEsperado}`}</p>
                <p>{`Dinero recibido: ${entregaDinero.dineroRecibido}`}</p>
                <p>{`Diferencia: ${entregaDinero.diferencia}`}</p>
                <p>{`Ultima actualizacion: ${entregaDinero.updatedAt}`}</p>
                </div>} 
       
                </section>
                
                <section className="lista">
                <ul>
                    {
                    entregasDinero.map((entrega)=>{
                     return <Fragment key={entrega._id}>
                    <li><article className="tarjeta-elemento"><h3 className="titulo-elemento">{entrega.fecha}</h3>
                     <p>{`Cantidad cucharones: ${entrega.cantidadCucharones}`}</p><p>{`Petos adicionales: ${entrega.petosAdicionales}`}</p>
                     <p>{`Dinero esperado: ${entrega.dineroEsperado}`}</p>
                     <p>{`Dinero recibido: ${entrega.dineroRecibido}`}</p>
                     <p>{`Diferencia: ${entrega.diferencia}`}</p>
                      <div className="acciones">
                     <button onClick={()=>{editarEntregaDinero(entrega.fecha, entrega.dineroRecibido)
                     setEntregaDineroEditando(entrega);
                     }} className="boton boton-secundario">Editar</button>
                     <button onClick={()=>{cancelarEdicion()}} className="boton boton-secundario">Cancelar edicion</button>
                     </div>
                    </article></li> 
                     </Fragment>
                    })
                }
                </ul>
                </section>  
                </div>   
        </>
    )
}