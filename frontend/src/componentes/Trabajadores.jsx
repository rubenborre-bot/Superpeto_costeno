import { useState, useEffect } from "react"
import { Fragment } from "react"
export function Trabajadores(){
    const [trabajadores, setTrabajadores] = useState([])
    const [nombres, setNombres] = useState("")
    const [apellidos, setApellidos] = useState("")
    const [telefono, setTelefono] = useState("")
    function listarTrabajadores(){
        fetch("http://localhost:3000/trabajadores")
        .then((response)=>{
            return response.json()
        })
        .then((response)=>{
            setTrabajadores(response.trabajadores)
        })
    }
    useEffect(listarTrabajadores, [])
    function registrarTrabajador(){
     let trabajadorObj = {
        nombres: nombres,
        apellidos: apellidos,
        telefono: telefono,
     }
    fetch("http://localhost:3000/trabajadores", {method:"POST",  headers:{ "Content-Type": "application/json"}, body: JSON.stringify(trabajadorObj)})
    .then((response)=>{
        return response.json()
    })
    .then((response)=>{
        if(response.success){
            setNombres("")
            setApellidos("")
            setTelefono("")
            listarTrabajadores()
        }
    })
    }
    function desactivarTrabajador(id){
 fetch(`http://localhost:3000/trabajadores/${id}`, {method:"PATCH",  headers:{ "Content-Type": "application/json"}})
    .then((response)=>{
        return response.json()
    })
    .then((response)=>{
        if(response.success){
            listarTrabajadores()
        }
    })
    }
    return(
        <>
        <h1>Trabajadores</h1>
        <ul>
            {
            trabajadores.map((trabajador)=>{
             return <Fragment key={trabajador._id}><li><h3>{`${trabajador.nombres} ${trabajador.apellidos}`}</h3>
             <p>{`Telefono: ${trabajador.telefono}`}</p> {trabajador.activo?<p>Activo</p>: <p>Inactivo</p>}
             </li> 
             <button onClick={() => desactivarTrabajador(trabajador._id)} disabled={!trabajador.activo}>
             Desactivar
             </button>
             </Fragment>
            })
        }
        </ul>
        <label>Registrar trabajador</label>
        <input value={nombres} onChange={(e)=>{setNombres(e.target.value)}} placeholder="nombres"></input>
        <input value={apellidos} onChange={(e)=>{setApellidos(e.target.value)}} placeholder="apellidos" ></input>
        <input value={telefono} onChange={(e)=>{setTelefono(e.target.value)}} placeholder="telefono"></input>
        <button onClick={registrarTrabajador}>Registrar trabajador</button>
        </>
    )
}