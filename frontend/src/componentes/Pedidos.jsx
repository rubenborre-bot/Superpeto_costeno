import { useState, useEffect } from "react";
import { Fragment } from "react"
import "./Modulos.css"
export function Pedidos(props){
    const [pedidos, setPedidos] = useState([])
    const [cantidadSolicitada, setCantidadSolicitada] = useState("")
    const [fecha, setFecha] = useState("")
    const [pedidoEditando, setPedidoEditando] = useState(null)
    const [pedido, setPedido] = useState({})
    const [cantidadAcordada, setCantidadAcordada] = useState("")
    const [trabajadorId, setTrabajadorId] = useState("")
    const [buscarFecha, setBuscarFecha] = useState("")
    function listarPedidos(){
        fetch("http://localhost:3000/pedidos")
        .then((response)=>{
            return response.json()
        })
        .then((response)=>{
            setPedidos(response.pedidos)
        })
    }
    useEffect(listarPedidos, [])
     
    function registrarPedido(){
        let pedidoObj = {
        id: trabajadorId,
        cantidadSolicitada: Number(cantidadSolicitada),
     }
    fetch("http://localhost:3000/pedidos", {method:"POST",  headers:{ "Content-Type": "application/json"}, body: JSON.stringify(pedidoObj)})
    .then((response)=>{
        return response.json()
    })
    .then((response)=>{
        if(response.success){
            listarPedidos()
        }
    })
    }
   
    function editarPedido(fecha, cantidadAcordada){
       setFecha(fecha)
       setCantidadAcordada(cantidadAcordada)
    }
    function actualizarPedido(){
        let pedidoObj = {
        nuevaCantidad: Number(cantidadAcordada),
     }
     fetch(`http://localhost:3000/pedidos/${pedidoEditando._id}`, {method:"PATCH",  headers:{ "Content-Type": "application/json"}, body: JSON.stringify(pedidoObj)})
     .then((response)=>{
        return response.json()
    })
    .then((response)=>{
        if(response.success){
            setCantidadAcordada(0)
            setPedidoEditando(null)
            listarPedidos()
        }
    })
    }
    function consultarPedidoPorFecha(){
        fetch(`http://localhost:3000/pedidos/pedido-fecha?nombres=${props.trabajadorNombres}&apellidos=${props.trabajadorApellidos}&fecha=${buscarFecha}`)
        .then((response)=>{
            return response.json()
        })
        .then((response)=>{
            if(response.success){
            setPedido(response.pedido)
            }
            else{
                setPedido({})
            }
        })
    }
    function cancelarEdicion(){
      setPedidoEditando(null)
      setFecha("")
      setCantidadAcordada("")
      setCantidadSolicitada("")
      setTrabajadorId("")

    }
    return(
        <>
        <div className="modulo">
        <h1 className="titulo-modulo" >Pedidos</h1>
        <section className="tarjeta formulario">
        <label>Registrar o actualizar pedido</label>
        <select value={trabajadorId} onChange={(e)=>{setTrabajadorId(e.target.value)}}>
              <option value="">Selecciona un trabajador</option>
           { props.trabajadores.map((trabajador)=>{return <option value={trabajador._id} key={trabajador._id}>{`${trabajador.nombres} ${trabajador.apellidos}`}</option> })}
        </select>
        {pedidoEditando? <input value={cantidadAcordada} onChange={(e)=>{setCantidadAcordada(e.target.value)}} placeholder="cantidad acordada"></input>:
        <input value={cantidadSolicitada} onChange={(e)=>{setCantidadSolicitada(e.target.value)}} placeholder="cantidad solicitada"></input>
        }
        <input value={fecha} onChange={(e)=>{setFecha(e.target.value)}} placeholder="fecha" disabled={!pedidoEditando}></input>
        <button onClick={registrarPedido} disabled={pedidoEditando || !trabajadorId} className="boton boton-principal">Registrar pedido</button>
        <button onClick={actualizarPedido}disabled={!pedidoEditando} className="boton boton-principal">Actualizar pedido</button>
        </section>
        <section className="tarjeta buscador">
        <label>Consultar pedido por nombres y fecha</label>
        <input value={props.trabajadorNombres} onChange={(e)=>{props.setTrabajadorNombres(e.target.value)}} placeholder="nombres"></input>
        <input value={props.trabajadorApellidos} onChange={(e)=>{props.setTrabajadorApellidos(e.target.value)}} placeholder="apellidos" ></input>
        <input value={buscarFecha} onChange={(e)=>{setBuscarFecha(e.target.value)}} placeholder="fecha" ></input>
        <button onClick={consultarPedidoPorFecha} className="boton boton-principal">Consultar pedido</button>
        {pedido._id && <div className="resultado"><p>{`Fecha de entrega: ${pedido.fechaEntrega}`}</p>
        <p>{`Cantidad solicitada: ${pedido.cantidadSolicitada}`}</p>
        <p>{`Cantidad acordada: ${pedido.cantidadAcordada}`}</p></div>}
        </section>
        <section className="lista">
        <ul>
            {
            pedidos.map((pedido)=>{
             return <Fragment key={pedido._id}>
            <li><article className="tarjeta-elemento"><h3 className="titulo-elemento">{pedido.fechaEntrega}</h3>
             <p>{`Cantidad solicitada: ${pedido.cantidadSolicitada}`}</p><p>{`Cantidad acordada: ${pedido.cantidadAcordada}`}</p>
              <div className="acciones">
             <button onClick={()=>{editarPedido(pedido.fechaEntrega, pedido.cantidadAcordada)
             setPedidoEditando(pedido); setCantidadSolicitada(""); setTrabajadorId(pedido.trabajadorId)
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
