import { useState, useEffect } from "react"
import { Fragment } from "react"
import "./Trabajadores.css"
export function Trabajadores(){
    const [trabajadores, setTrabajadores] = useState([])
    const [nombres, setNombres] = useState("")
    const [apellidos, setApellidos] = useState("")
    const [telefono, setTelefono] = useState("")
    const [trabajadorEditando, setTrabajadorEditando] = useState(null)
    const [trabajadorNombres, setTrabajadorNombres] = useState("")
    const [trabajadorApellidos, setTrabajadorApellidos] = useState("")
    const [trabajador, setTrabajador] = useState({})
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
    function editarTrabajador(nombres, apellidos, telefono){
       setNombres(nombres)
       setApellidos(apellidos)
       setTelefono(telefono)
    }
    function actualizarTrabajador(){
        let trabajadorObj = {
        nuevosNombres: nombres,
        nuevosApellidos: apellidos,
        nuevoTelefono: telefono,
     }
     fetch(`http://localhost:3000/trabajadores/actualizar?nombres=${trabajadorEditando.nombres}&apellidos=${trabajadorEditando.apellidos}`, {method:"PATCH",  headers:{ "Content-Type": "application/json"}, body: JSON.stringify(trabajadorObj)})
     .then((response)=>{
        return response.json()
    })
    .then((response)=>{
        if(response.success){
            setNombres("")
            setApellidos("")
            setTelefono("")
            setTrabajadorEditando(null)
            listarTrabajadores()
        }
    })
    }
    function consultarTrabajadorPorNombre(){
        fetch(`http://localhost:3000/trabajadores/buscar?nombres=${trabajadorNombres}&apellidos=${trabajadorApellidos}`)
        .then((response)=>{
            return response.json()
        })
        .then((response)=>{
            if(response.success){
            setTrabajador(response.trabajador)
            }
            else{
                setTrabajador({})
            }
        })
    }
    return(
        <>
        <div className="modulo-trabajadores">
        <h1 className="titulo-modulo" >Trabajadores</h1>
        <section className="tarjeta formulario-trabajador">
        <label>Registrar o actualizar trabajador</label>
        <input value={nombres} onChange={(e)=>{setNombres(e.target.value)}} placeholder="nombres"></input>
        <input value={apellidos} onChange={(e)=>{setApellidos(e.target.value)}} placeholder="apellidos" ></input>
        <input value={telefono} onChange={(e)=>{setTelefono(e.target.value)}} placeholder="telefono"></input>
        <button onClick={registrarTrabajador} disabled={trabajadorEditando}>Registrar trabajador</button>
        <button onClick={actualizarTrabajador}disabled={!trabajadorEditando}>Actualizar trabajador</button>
        </section>
        <section className="tarjeta buscador-trabajador">
        <label>Consultar trabajador por nombre</label>
        <input value={trabajadorNombres} onChange={(e)=>{setTrabajadorNombres(e.target.value)}} placeholder="nombres"></input>
        <input value={trabajadorApellidos} onChange={(e)=>{setTrabajadorApellidos(e.target.value)}} placeholder="apellidos" ></input>
        <button onClick={consultarTrabajadorPorNombre}>Consultar trabajador</button>
        {trabajador._id && <div className="resultado-busqueda"><p>{`${trabajador.nombres} ${trabajador.apellidos}`}</p>
        <p>{trabajador.telefono}</p>
        {trabajador.activo?<p>Activo</p>: <p>Inactivo</p>}</div>}
        </section>
        <section className="lista-trabajadores">
        <ul>
            {
            trabajadores.map((trabajador)=>{
             return <Fragment key={trabajador._id}>
            <li><article className="trabajador-card"><h3 className="trabajador-nombre">{`${trabajador.nombres} ${trabajador.apellidos}`}</h3>
             <p>{`Telefono: ${trabajador.telefono}`}</p> {trabajador.activo?<p>Activo</p>: <p>Inactivo</p>}
              <div className="acciones-trabajador">
             <button onClick={() => desactivarTrabajador(trabajador._id)} disabled={!trabajador.activo}>
             Desactivar
             </button>
             <button onClick={()=>{editarTrabajador(trabajador.nombres, trabajador.apellidos, trabajador.telefono)
             setTrabajadorEditando(trabajador)
             }}>Editar</button>
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