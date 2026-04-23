import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home' // Importamos la nueva página
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      
      <Routes>
        {/* Cambiamos el div temporal por nuestra página Home real */}
        <Route path="/" element={<Home />} />
        
        <Route path="/buscar" element={<div style={{ padding: '40px' }}><h2>Página de Buscar Canchas 🔍</h2></div>} />
        <Route path="/perfil-jugador" element={<div style={{ padding: '40px' }}><h2>Perfil del Jugador 👤</h2></div>} />
        <Route path="*" element={<h2 style={{ padding: '40px' }}>404: Página no encontrada</h2>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App