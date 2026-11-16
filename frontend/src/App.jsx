import {Routes, Route } from 'react-router'
import './App.css'
import { Header } from './componentes/Header'
import { Sidebar } from './componentes/Sidebar'
import { Trabajadores } from './componentes/Trabajadores'
function App() {

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
    <Route path='/trabajadores' element={<Trabajadores/>}/>
   </Routes>
  </div>
  </div>
    </>
  )
}

export default App
