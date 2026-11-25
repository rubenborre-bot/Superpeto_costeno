import {Routes, Route } from 'react-router'
import './App.css'
import { Header } from './componentes/Header'
import { Sidebar } from './componentes/Sidebar'
import { Trabajadores } from './componentes/Trabajadores'
import { useState, useEffect } from 'react'
import { Pedidos } from './componentes/Pedidos'
function App() {
const [trabajadores, setTrabajadores] = useState([])
const [trabajador, setTrabajador] = useState({})  
const [trabajadorNombres, setTrabajadorNombres] = useState("")
const [trabajadorApellidos, setTrabajadorApellidos] = useState("")
 function listarTrabajadores(){
        fetch("http://localhost:3000/trabajadores")
        .then((response)=>{
            return response.json()
        })
        .then((response)=>{
            setTrabajadores(response.trabajadores)
        })
    }
    useEffect(()=>{listarTrabajadores()}, [])
    
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
     
  return (
    <>
  <div className='header'>
   <Header />
  </div>
  <div className='contenedor'>
  <div className='sidebar'>
   <Sidebar/>
  </div>
  <div className='routes'>
   <Routes>
    <Route path='/trabajadores' element={<Trabajadores trabajadores={trabajadores} trabajador={trabajador} trabajadorNombres={trabajadorNombres} trabajadorApellidos={trabajadorApellidos} setTrabajadorNombres={setTrabajadorNombres} setTrabajadorApellidos={setTrabajadorApellidos} listarTrabajadores={listarTrabajadores} consultarTrabajadorPorNombre={consultarTrabajadorPorNombre}/>}/>
    <Route path='/pedidos' element={<Pedidos trabajadores={trabajadores} trabajador={trabajador} trabajadorNombres={trabajadorNombres} trabajadorApellidos={trabajadorApellidos} setTrabajadorNombres={setTrabajadorNombres} setTrabajadorApellidos={setTrabajadorApellidos} listarTrabajadores={listarTrabajadores} consultarTrabajadorPorNombre={consultarTrabajadorPorNombre}/>}/>
   </Routes>
  </div>
  </div>
    </>
  )
}

export default App
