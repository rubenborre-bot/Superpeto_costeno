import { useState, useEffect } from "react"
import { Fragment } from "react"
import "./Modulos.css"
export function Entregas(){
    const [nombres, setNombres] = useState("")
    const [apellidos, setApellidos] = useState("")
    const [num, setNum] = useState("")
    const [petosAdicionales, setPetosAdicionales] = useState("")
    const [fecha, setFecha] = useState("")
    const [nuevaCantidad, setNuevaCantidad] = useState("")
    const [nuevosPetosAdicionales, setNuevosPetosAdicionales] = useState("")
    const [entregas, setEntregas] = useState([])
    const [entregaEditando, setEntregaEditando] = useState(null)
    const [buscarFecha, setBuscarFecha] = useState("")
    const [trabajadorNombres, setTrabajadorNombres] = useState("")
    const [trabajadorApellidos, setTrabajadorApellidos] = useState("")
    const [entrega, setEntrega] = useState({})
   function listarEntregas(){
        fetch("http://localhost:3000/entregas")
        .then((response)=>{
            return response.json()
        })
        .then((response)=>{
            setEntregas(response.entregas)
        })
    }
    useEffect(listarEntregas, [])
   function registrarEntrega(){
        let entregaObj = {
        nombres: nombres,
        apellidos: apellidos,
        num: Number(num),
        petosAdicionales: Number(petosAdicionales)
     }
    fetch("http://localhost:3000/entregas", {method:"POST",  headers:{ "Content-Type": "application/json"}, body: JSON.stringify(entregaObj)})
    .then((response)=>{
        return response.json()
    })
    .then((response)=>{
        if(response.success){
            listarEntregas()
        }
    })
    }
     
function cancelarEdicion(){
      setEntregaEditando(null)
      setFecha("")
      setNombres("")
      setApellidos("")
      setNuevaCantidad("")
      setNuevosPetosAdicionales("")
    }
function actualizarEntrega(){
        let entregaObj = {
        nombres: nombres,
        apellidos: apellidos,
        fecha: fecha,
        nuevaCantidad: Number(nuevaCantidad),
        nuevosPetosAdicionales: Number(nuevosPetosAdicionales),
     }
     fetch("http://localhost:3000/entregas", {method:"PATCH",  headers:{ "Content-Type": "application/json"}, body: JSON.stringify(entregaObj)})
     .then((response)=>{
        return response.json()
    })
    .then((response)=>{
        if(response.success){
           listarEntregas()
           cancelarEdicion()
        }
    })
    }
    function consultarEntregaPorFecha(){
        fetch(`http://localhost:3000/entregas?nombres=${trabajadorNombres}&apellidos=${trabajadorApellidos}&fecha=${buscarFecha}`)
        .then((response)=>{
            return response.json()
        })
        .then((response)=>{
            if(response.success){
            setEntrega(response.entregas)
            }
            else{
                setEntrega({})
            }
        })
    }
    function editarEntrega(fecha, cantidadActual, petosAdicionalesActuales){
       setFecha(fecha)
       setNuevaCantidad(cantidadActual)
       setNuevosPetosAdicionales(petosAdicionalesActuales)
    }
    return(
        <>
        <div className="modulo">
                <h1 className="titulo-modulo">Entregas</h1>
                <section className="tarjeta formulario">
                <label>Registrar o actualizar entrega</label>
                <input value={nombres} onChange={(e)=>{setNombres(e.target.value)}} placeholder="nombres"></input>
                <input value={apellidos} onChange={(e)=>{setApellidos(e.target.value)}} placeholder="apellidos"></input>
                {entregaEditando?<input value={nuevaCantidad} onChange={(e)=>{setNuevaCantidad(e.target.value)}} placeholder="nueva cantidad"></input>:<input value={num} onChange={(e)=>{setNum(e.target.value)}} placeholder="cucharones"></input>}
                {entregaEditando?<input value={nuevosPetosAdicionales} onChange={(e)=>{setNuevosPetosAdicionales(e.target.value)}} placeholder="nuevos petos adicionales"></input>:<input value={petosAdicionales} onChange={(e)=>{setPetosAdicionales(e.target.value)}} placeholder="petos adicionales"></input>}
                {entregaEditando && <input value={fecha} onChange={(e)=>{setFecha(e.target.value)}} placeholder="fecha" disabled={entregaEditando}></input>}
                <button onClick={registrarEntrega} disabled={entregaEditando} className="boton boton-principal">Registrar entrega</button>
                <button onClick={actualizarEntrega} disabled={!entregaEditando} className="boton boton-principal">Actualizar entrega</button>
                </section>
                <section className="tarjeta buscador">
                <label>Consultar entrega por nombres y fecha</label>
                <input value={trabajadorNombres} onChange={(e)=>{setTrabajadorNombres(e.target.value)}} placeholder="nombres"></input>
                <input value={trabajadorApellidos} onChange={(e)=>{setTrabajadorApellidos(e.target.value)}} placeholder="apellidos" ></input>
                <input value={buscarFecha} onChange={(e)=>{setBuscarFecha(e.target.value)}} placeholder="fecha" ></input>
                <button onClick={consultarEntregaPorFecha} className="boton boton-principal">Consultar entrega</button>
                {entrega._id && <div className="resultado"><p>{entrega.fecha}</p>
                <p>{`Cantidad inicial: ${entrega.cantidadInicial}`}</p>
                <p>{`Cantidad actual: ${entrega.cantidadActual}`}</p>
                <p>{`Petos adicionales iniciales: ${entrega.petosAdicionalesIniciales}`}</p>
                <p>{`Petos adicionales actuales: ${entrega.petosAdicionalesActuales}`}</p>
                <p>{`Estado: ${entrega.estado}`}</p>
                <p>{`Creado: ${entrega.createdAt}`}</p>
                <p>{`Ultima actualizacion: ${entrega.updatedAt}`}</p>
                </div>} 
       
                </section>
                
                <section className="lista">
                <ul>
                    {
                    entregas.map((entrega)=>{
                     return <Fragment key={entrega._id}>
                    <li><article className="tarjeta-elemento"><h3 className="titulo-elemento">{entrega.fecha}</h3>
                     <p>{`Cantidad inicial: ${entrega.cantidadInicial}`}</p><p>{`Cantidad actual: ${entrega.cantidadActual}`}</p>
                     <p>{`Petos adicionales inciales: ${entrega.petosAdicionalesIniciales}`}</p>
                     <p>{`Petos adicionales actuales: ${entrega.petosAdicionalesActuales}`}</p>
                     <p>{`Estado: ${entrega.estado}`}</p>
                      <div className="acciones">
                     <button onClick={()=>{editarEntrega(entrega.fecha, entrega.cantidadActual, entrega.petosAdicionalesActuales)
                     setEntregaEditando(entrega);
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