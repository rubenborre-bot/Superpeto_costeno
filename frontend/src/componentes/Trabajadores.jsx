import { useState } from "react"
import { Fragment } from "react"
import "./Modulos.css"
export function Trabajadores(props){
    const [nombres, setNombres] = useState("")
    const [apellidos, setApellidos] = useState("")
    const [telefono, setTelefono] = useState("")
    const [trabajadorEditando, setTrabajadorEditando] = useState(null)

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
            props.listarTrabajadores()
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
            props.listarTrabajadores()
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
            props.listarTrabajadores()
        }
    })
    }
 
    return(
        <>
        <div className="modulo">
        <h1 className="titulo-modulo" >Trabajadores</h1>
        <section className="tarjeta formulario">
        <label>Registrar o actualizar trabajador</label>
        <input value={nombres} onChange={(e)=>{setNombres(e.target.value)}} placeholder="nombres"></input>
        <input value={apellidos} onChange={(e)=>{setApellidos(e.target.value)}} placeholder="apellidos" ></input>
        <input value={telefono} onChange={(e)=>{setTelefono(e.target.value)}} placeholder="telefono"></input>
        <button onClick={registrarTrabajador} disabled={trabajadorEditando} className="boton boton-principal">Registrar trabajador</button>
        <button onClick={actualizarTrabajador}disabled={!trabajadorEditando} className="boton boton-principal">Actualizar trabajador</button>
        </section>
        <section className="tarjeta buscador">
        <label>Consultar trabajador por nombre</label>
        <input value={props.trabajadorNombres} onChange={(e)=>{props.setTrabajadorNombres(e.target.value)}} placeholder="nombres"></input>
        <input value={props.trabajadorApellidos} onChange={(e)=>{props.setTrabajadorApellidos(e.target.value)}} placeholder="apellidos" ></input>
        <button onClick={props.consultarTrabajadorPorNombre} className="boton boton-principal">Consultar trabajador</button>
        {props.trabajador._id && <div className="resultado"><p>{`${props.trabajador.nombres} ${props.trabajador.apellidos}`}</p>
        <p>{props.trabajador.telefono}</p>
        {props.trabajador.activo?<p>Activo</p>: <p>Inactivo</p>}</div>}
        </section>
        <section className="lista">
        <ul>
            {
            props.trabajadores.map((trabajador)=>{
             return <Fragment key={trabajador._id}>
            <li><article className="tarjeta-elemento"><h3 className="titulo-elemento">{`${trabajador.nombres} ${trabajador.apellidos}`}</h3>
             <p>{`Telefono: ${trabajador.telefono}`}</p> {trabajador.activo?<p>Activo</p>: <p>Inactivo</p>}
              <div className="acciones">
             <button onClick={() => desactivarTrabajador(trabajador._id)} disabled={!trabajador.activo} className="boton boton-peligro">
             Desactivar
             </button>
             <button onClick={()=>{editarTrabajador(trabajador.nombres, trabajador.apellidos, trabajador.telefono)
             setTrabajadorEditando(trabajador)
             }}className="boton boton-secundario" >Editar</button>
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