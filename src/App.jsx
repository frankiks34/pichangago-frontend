import { lazy, Suspense } from 'react'; // 1. Importar lazy y Suspense
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'

import './index.css'

const Home = lazy(() => import('./pages/Home'));
function App() {
  return (
   <BrowserRouter>
      <Navbar />
      
      {  }
      <Suspense fallback={
        <div style={{ padding: '100px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-head)' }}>Cargando pichanga... ⚽</h2>
        </div>
      }>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Aquí irán tus otras rutas lazy */}
          <Route path="*" element={<h2>404 - Página no encontrada</h2>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App