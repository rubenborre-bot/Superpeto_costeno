import { Link, useNavigate } from "react-router"

export function Sidebar(){
    return(
        <>
        <aside>
           <nav>
            <ul>
               <li><Link to="/trabajadores">Trabajadores</Link></li>
            </ul>
            </nav> 
        </aside>
        </>
    )
}