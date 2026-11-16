import {Routes, Route } from 'react-router'
import './App.css'
import { Header } from './componentes/Header'
import { Sidebar } from './componentes/Sidebar'
import { Trabajadores } from './componentes/Trabajadores'
function App() {

  return (
    <>
   <Header />
   <Sidebar/>
   <Routes>
    <Route path='/trabajadores' element={<Trabajadores/>}/>
   </Routes>
    </>
  )
}

export default App
