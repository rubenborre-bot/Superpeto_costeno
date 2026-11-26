import { NavLink } from "react-router"

export function Sidebar(){
    return(
        <>
        <aside>
            <h2>MENÚ PRINCIPAL</h2>
           <nav>
            <ul>
               <li><NavLink to="/">Panel principal</NavLink></li>
               <li><NavLink to="/trabajadores">Trabajadores</NavLink></li>
               <li><NavLink to="/pedidos">Pedidos</NavLink></li>
               <li><NavLink to="/produccion">Producción</NavLink></li>
               <li><NavLink to="/entregas">Entregas</NavLink></li>
               <li><NavLink to="/dinero">Dinero</NavLink></li>
               <li><NavLink to="/balance">Balance</NavLink></li>
               <li><NavLink to="/configuracion">Configuración</NavLink></li>
            </ul>
            </nav> 
        </aside>
        </>
    )
}