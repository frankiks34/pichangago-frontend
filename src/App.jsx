import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      {/* Aquí irá el Navbar más adelante para que se vea en todas las páginas */}
      
      <Routes>
        {/* Ruta principal */}
        <Route path="/" element={<div style={{ padding: '20px' }}><h1>Inicio: PichangaGo ⚽</h1></div>} />
        
        {/* Futuras rutas de jugador */}
        <Route path="/buscar" element={<div style={{ padding: '20px' }}>Página de Buscar Canchas</div>} />
        <Route path="/perfil-jugador" element={<div style={{ padding: '20px' }}>Perfil del Jugador</div>} />
        
        {/* Futuras rutas de dueño */}
        <Route path="/dashboard" element={<div style={{ padding: '20px' }}>Dashboard del Dueño</div>} />
        
        {/* Ruta para cuando el usuario pone un link que no existe */}
        <Route path="*" element={<h2 style={{ padding: '20px' }}>404: Página no encontrada</h2>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App