import { lazy, Suspense, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import './index.css';

// 1. IMPORTACIONES PEREZOSAS (Lo que ya tenías + las nuevas)
const Home = lazy(() => import('./pages/Home'));
const CanchaDetail = lazy(() => import('./pages/CanchaDetail'));
const Login = lazy(() => import('./pages/Login'));

// 2. COMPONENTE DE PROTECCIÓN DE RUTAS (Matriz de Roles)
const ProtectedRoute = ({ allowedRoles, userRole }) => {
  if (!userRole) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(userRole)) return <Navigate to="/403" replace />;
  return <Outlet />;
};

function App() {
  // Simulamos un usuario logueado para que puedas hacer pruebas en el Frontend.
  // Cuando Carlos (Backend) tenga el JWT, esto lo leeremos de las cookies.
  const [userRole, setUserRole] = useState(null); // Pon 'JUGADOR' o 'DUENO' para probar

  return (
    <BrowserRouter>
      <Navbar />
      
      {/* 3. TU SUSPENSE OPTIMIZADO (WPO intacto) */}
      <Suspense fallback={
        <div style={{ padding: '100px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-head)' }}>Cargando pichanga... ⚽</h2>
        </div>
      }>
        <Routes>
          {/* MÓDULO 1: RUTAS PÚBLICAS (Visitantes) */}
          <Route path="/" element={<Home />} />
          <Route path="/cancha/:id" element={<CanchaDetail />} />
          <Route path="/login" element={<Login />} />

          {/* MÓDULO 2 Y 4: RUTAS DE JUGADOR */}
          <Route element={<ProtectedRoute allowedRoles={['JUGADOR']} userRole={userRole} />}>
            <Route path="/mis-reservas" element={<h2>Aquí irán mis reservas</h2>} />
          </Route>

          {/* MÓDULO 3: RUTAS DE DUEÑO */}
          <Route element={<ProtectedRoute allowedRoles={['DUENO']} userRole={userRole} />}>
            <Route path="/panel-dueno" element={<h2>Aquí irá el dashboard</h2>} />
          </Route>

          {/* ERRORES HTTP (Requerimiento del profesor) */}
          <Route path="/403" element={<div style={{padding:'50px', textAlign:'center'}}><h2>403 - No tienes permiso para ver esto 🚫</h2></div>} />
          <Route path="*" element={<div style={{padding:'50px', textAlign:'center'}}><h2>404 - Página no encontrada 🕵️‍♂️</h2></div>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;