import { lazy, Suspense, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal'; 
import './index.css';

// 🔌 Importamos las utilidades de cookies para persistencia OWASP
import { getSessionCookie, setSessionCookie, eraseSessionCookie } from './utils/cookies';

// 📦 CARGA PEREZOSA DE PÁGINAS (Lazy Loading)
const Home = lazy(() => import('./pages/Home'));
const Buscar = lazy(() => import('./pages/Buscar'));
const CanchaDetail = lazy(() => import('./pages/CanchaDetail'));
const MisReservas = lazy(() => import('./pages/MisReservas'));
const SystemStatus = lazy(() => import('./pages/SystemStatus'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));

// PÁGINAS DEL DUEÑO
const PanelDueno = lazy(() => import('./pages/dueno/PanelDueno'));
const DuenoOnboarding = lazy(() => import('./pages/dueno/DuenoOnboarding'));
const RegistroCanchaForm = lazy(() => import('./pages/dueno/RegistroCanchaForm'));
const PerfilFinanciero = lazy(() => import('./pages/dueno/PerfilFinanciero'));


// 🛡️ COMPONENTE DE PROTECCIÓN DE RUTAS (MIDDLEWARE INTERCEPTOR)
const ProtectedRoute = ({ allowedRoles, user }) => {
  // Caso 1: Si no hay usuario en sesión, intercepta y redirige al Home (HTTP 401)
  if (!user) return <Navigate to="/" replace />; 
  
  // Caso 2: Si el rol del usuario no está autorizado para este módulo (HTTP 403)
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  
  // Caso 3: Luz verde, renderiza el componente interno
  return <Outlet />;
};

function App() {
  // 🔄 Estado Inicial: Recupera al usuario directamente de la cookie para aguantar los F5
  const [user, setUser] = useState(() => getSessionCookie());
  const [isModalOpen, setIsModalOpen] = useState(false); 

  // Interceptor de login exitoso desde el Modal
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setSessionCookie(userData); // 💾 Inyecta la cookie SameSite segura en el navegador
    setIsModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    eraseSessionCookie(); // 🗑️ Destruye la cookie inmediatamente del navegador
  };

  return (
    <BrowserRouter>
      {/* NAVBAR */}
      <Navbar user={user} onLogout={logout} onOpenLogin={() => setIsModalOpen(true)} />
      
      {/* MODAL GLOBAL DE AUTENTICACIÓN */}
      <AuthModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onLogin={handleLoginSuccess} 
      />
      
      {/* CONTENEDOR ASÍNCRONO PARA LA COMPILACIÓN DE RUTAS */}
      <Suspense fallback={<div style={{ padding: '100px', textAlign: 'center' }}><h2>Cargando... ⚽</h2></div>}>
        <Routes>
          {/* 🔓 RUTAS PÚBLICAS */}
          <Route path="/" element={<Home />} />
          <Route path="/buscar" element={<Buscar />} /> 
          <Route path="/reset-password" element={<ResetPassword />} /> {/* 👈 NUEVA RUTA AQUÍ */}

          {/* 🎯 CONEXIÓN ESTRELLA: Pasamos la función para abrir el Modal desde la ruta del detalle */}
          <Route path="/cancha/:id" element={<CanchaDetail onOpenLogin={() => setIsModalOpen(true)} />} />
          
          <Route path="/status" element={<SystemStatus />} />

          {/* 🔐 MIDDLEWARE: SÓLO JUGADORES (Épica 4) */}
          <Route element={<ProtectedRoute user={user} allowedRoles={['JUGADOR']} />}>
            <Route path="/mis-reservas" element={<MisReservas />} />
          </Route>

          {/* 🔐 MIDDLEWARE: SÓLO DUEÑOS (Épica 5) */}
          <Route element={<ProtectedRoute user={user} allowedRoles={['DUEÑO', 'DUENO']} />}>
            {/* 📈 Conectamos la ruta base a tu componente oficial inteligente */}
            <Route path="/panel-dueno" element={<PanelDueno />} />
            
            {/* 🏁 Rutas del Momento 1: Onboarding y Configuraciones */}
            <Route path="/panel-dueno/onboarding" element={<DuenoOnboarding />} />
            <Route path="/panel-dueno/registrar-cancha" element={<RegistroCanchaForm />} />
            <Route path="/panel-dueno/perfil-financiero" element={<PerfilFinanciero />} />
          </Route>

          {/* Redirección por defecto si meten una URL errónea */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;