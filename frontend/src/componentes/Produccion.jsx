import { useState, useEffect } from "react";
export function Produccion(){
    const [produccion, setProduccion] = useState({
    planificacionInicial: {
        cucharones: 0,
        kilogramosMaiz: 0
    },
    planificacionActual: {
        cucharones: 0,
        kilogramosMaiz: 0
    }})
    function listarProduccion(){
        fetch("http://localhost:3000/produccion/planificacion-produccion")
        .then((response)=>{
            return response.json()
        })
        .then((response)=>{
            setProduccion(response)
        })
    }
    useEffect(listarProduccion, [])
    return(
        <>
       <div className="modulo">
        <section className="lista">
        <ul>
            <li><h3 className="titulo-elemento">planificacion inicial</h3></li>
            <li>{produccion.planificacionInicial.cucharones}</li>
            <li>{`Kilogramos de maiz:  ${produccion.planificacionInicial.kilogramosMaiz}`}</li>
            <li><h3 className="titulo-elemento">planificacion Actual</h3></li>
            <li>{produccion.planificacionActual.cucharones}</li>
            <li>{`Kilogramos de maiz:  ${produccion.planificacionActual.kilogramosMaiz}`}</li>
        </ul>
        </section>
       </div>
        </>
    )
}