import { useState, useEffect } from "react";
import { Fragment } from "react";
export function Configuracion(){
    const [precios, setPrecios] = useState("")
    const [precioCucharon, setPrecioCucharon] = useState("")
    const [precioPetoAdicional, setPrecioPetoAdicional] = useState("")
    const [preciosEditando, setPreciosEditando] = useState(null)
    const [napa, setNapa] = useState([])
    const [cucharonesReferencia, setCucharonesReferencia] = useState("")
    const [napaPetos, setNapaPetos] = useState("")
    const [napaEditando, setNapaEditando] = useState(null)
   function listarPrecios(){
        fetch("http://localhost:3000/configuracion")
        .then((response)=>{
            return response.json()
        })
        .then((response)=>{
            setPrecios(response.precios)
        })
    }
      useEffect(listarPrecios, [])    

     function registrarPrecios(){
        let preciosObj = {
        precioCucharon: Number(precioCucharon),
        precioPetoAdicional: Number(precioPetoAdicional),
     }
    fetch("http://localhost:3000/configuracion", {method:"POST",  headers:{ "Content-Type": "application/json"}, body: JSON.stringify(preciosObj)})
    .then((response)=>{
        return response.json()
    })
    .then((response)=>{
        if(response.success){
            listarPrecios()
        }
    })
    }
     function actualizarPrecios(){
        let preciosObj = {
        precioCucharon: Number(precioCucharon),
        precioPetoAdicional: Number(precioPetoAdicional),
     }
     fetch("http://localhost:3000/configuracion", {method:"PATCH",  headers:{ "Content-Type": "application/json"}, body: JSON.stringify(preciosObj)})
     .then((response)=>{
        return response.json()
    })
    .then((response)=>{
        if(response.success){
           listarPrecios()
           cancelarEdicion()
        }
    })
    }      
function cancelarEdicion(){
      setPreciosEditando(null)
      setPrecioCucharon("")
      setPrecioPetoAdicional("")
      
    }
     function editarPrecios(precioCucharon, precioPetoAdicional){
       setPrecioCucharon(precioCucharon)
       setPrecioPetoAdicional(precioPetoAdicional)
    }
    
    function listarNapa(){
        fetch("http://localhost:3000/equivalencias-napa")
        .then((response)=>{
            return response.json()
        })
        .then((response)=>{
            setNapa(response.equivalencias.equivalencias)
        })
    }
      useEffect(listarNapa, [])    

     function registrarNapa(){
         if(napa.length == 0){
      let datosNapaObj = {
        cucharonesReferencia: Number(cucharonesReferencia),
        napaPetos: Number(napaPetos)
     }
        let napaObj = {
            equivalencias: [datosNapaObj]
        }
    fetch("http://localhost:3000/equivalencias-napa", {method:"POST",  headers:{ "Content-Type": "application/json"}, body: JSON.stringify(napaObj)})
    .then((response)=>{
        return response.json()
    })
    .then((response)=>{
        if(response.success){
            listarNapa()
            cancelarEdicionNapa()
        }
    })
    }else{
        let referenciaExiste = napa.some((referencia)=>{return referencia.cucharonesReferencia == Number(cucharonesReferencia)})
        let nuevaEquivalencia = {
            cucharonesReferencia: Number(cucharonesReferencia),
            napaPetos: Number(napaPetos)
        }
        let napaObj = {}
          if(!referenciaExiste){
            napaObj = napa.concat(nuevaEquivalencia)
          }else{
            return 
          }
fetch("http://localhost:3000/equivalencias-napa", {method:"PATCH",  headers:{ "Content-Type": "application/json"}, body: JSON.stringify({equivalencias: napaObj})})
    .then((response)=>{
        return response.json()
    })
    .then((response)=>{
        if(response.success){
            listarNapa()
            cancelarEdicionNapa()
        }
    })
    }
}
     function actualizarNapa(){
     let napaObj = napa.map((equivalencia)=>{
        if(equivalencia.cucharonesReferencia == napaEditando){
         return {
        cucharonesReferencia: Number(cucharonesReferencia),
        napaPetos: Number(napaPetos)
          }
        }else{
        return equivalencia
        }
       })
        
     fetch("http://localhost:3000/equivalencias-napa", {method:"PATCH",  headers:{ "Content-Type": "application/json"}, body: JSON.stringify({equivalencias: napaObj})})
     .then((response)=>{
        return response.json()
    })
    .then((response)=>{
        if(response.success){
           listarNapa()
           cancelarEdicionNapa()
        }
    })
    }      
function cancelarEdicionNapa(){
      setNapaEditando(null)
      setCucharonesReferencia("")
      setNapaPetos("")    
    }
     function editarNapa(cucharonesReferencia, napaPetos){
       setCucharonesReferencia(cucharonesReferencia)
       setNapaPetos(napaPetos)
    } 
    return(
        <>
        <div className="modulo">
                <h1 className="titulo-modulo">Configuracion de precios y ñapa</h1>
                <section className="tarjeta formulario">
                <label>Registrar o actualizar precios</label>
                <input value={precioCucharon} onChange={(e)=>{setPrecioCucharon(e.target.value)}} placeholder="precio cucharon"></input>
                <input value={precioPetoAdicional} onChange={(e)=>{setPrecioPetoAdicional(e.target.value)}} placeholder="precio peto adicional"></input>
                <button onClick={registrarPrecios} disabled={preciosEditando} className="boton boton-principal">Registrar precios</button>
                <button onClick={actualizarPrecios} disabled={!preciosEditando} className="boton boton-principal">Actualizar precios</button>
                </section>

                <section className="tarjeta formulario">
                <label>Registrar o actualizar ñapa</label>
                <input value={cucharonesReferencia} onChange={(e)=>{setCucharonesReferencia(e.target.value)}} placeholder="cucharones" disabled={napaEditando}></input>
                <input value={napaPetos} onChange={(e)=>{setNapaPetos(e.target.value)}} placeholder="ñapa"></input>
                <button onClick={registrarNapa} disabled={napaEditando} className="boton boton-principal">Registrar equivalencia</button>
                <button onClick={actualizarNapa} disabled={!napaEditando} className="boton boton-principal">Actualizar equivalencia</button>
                </section>
                
                <section className="lista">
                <ul>
                    {
                    <Fragment key={precios._id}>
                    <li><article className="tarjeta-elemento"><h3 className="titulo-elemento">Precios</h3>
                     <p>{`Precio cucharon: ${precios.precioCucharon}`}</p>
                     <p>{`Precio de petos adicionales: ${precios.precioPetoAdicional}`}</p>
                     <p>{`Creado: ${precios.createdAt}`}</p>
                     <p>{`Ultima actualizacion: ${precios.updatedAt}`}</p>
                      <div className="acciones">
                     <button onClick={()=>{editarPrecios(precios.precioCucharon, precios.precioPetoAdicional)
                     setPreciosEditando(precios);
                     }} className="boton boton-secundario">Editar</button>
                     <button onClick={()=>{cancelarEdicion()}} className="boton boton-secundario">Cancelar edicion</button>
                     </div>
                    </article></li> 
                     </Fragment>
                }
                </ul>
                </section>  

                <section className="lista">
                <ul>
                    {
                    napa.map((element)=>{return <Fragment key={element.cucharonesReferencia}>
                    <li><article className="tarjeta-elemento"><h3 className="titulo-elemento">Ñapa</h3>
                     <p>{`Cucharon de referencia: ${element.cucharonesReferencia}`}</p>
                     <p>{`Ñapa: ${element.napaPetos}`}</p>
                      <div className="acciones">
                     <button onClick={()=>{editarNapa(element.cucharonesReferencia, element.napaPetos)
                     setNapaEditando(element.cucharonesReferencia);
                     }} className="boton boton-secundario">Editar</button>
                     <button onClick={()=>{cancelarEdicionNapa()}} className="boton boton-secundario">Cancelar edicion</button>
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