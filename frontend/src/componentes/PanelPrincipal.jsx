import bienvenida from "../assets/Bienvenida Super Peto.jpg";
export function PanelPricipal(){
    return(
        <>
        <img src={bienvenida} alt="Bienvenida a Super Peto" className="imagen-bienvenida"/>
        <h2 className="titulo-bienvenida">¡Bienvenida a tu panel de administración!</h2>
        <p className="bienvenida-texto">
Cada día es una nueva oportunidad para seguir creciendo, alcanzar nuevas metas y ver los frutos de todo tu esfuerzo.
¡Vamos por más!</p>
        </>
    )
}