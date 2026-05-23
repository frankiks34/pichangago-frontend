import { lazy, Suspense, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal'; 
import './index.css';
import { authService } from './services/authService';


import { getSessionCookie, setSessionCookie, eraseSessionCookie } from './utils/cookies';


const Home = lazy(() => import('./pages/Home'));
const Buscar = lazy(() => import('./pages/Buscar'));
const CanchaDetail = lazy(() => import('./pages/CanchaDetail'));
const MisReservas = lazy(() => import('./pages/MisReservas'));
const SystemStatus = lazy(() => import('./pages/SystemStatus'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));


const PanelDuenoPlaceholder = () => (
  <div className="view active page-wrap" style={{ padding: '80px 24px', textAlign: 'center' }}>
    <h2 className="section-title" style={{ fontSize: '24px', marginBottom: '8px' }}>Panel Dueño — Épica 5 🏟️</h2>
    <p style={{ color: 'var(--textMid)', fontSize: '14px' }}>Métricas de ingresos, cobro de comisiones del 5% y gestión de ofertas.</p>
  </div>
);


const ProtectedRoute = ({ allowedRoles, user }) => {

  if (!user) return <Navigate to="/" replace />; 
  

  if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  

  return <Outlet />;
};

function App() {
 
  const [user, setUser] = useState(() => getSessionCookie());
  const [isModalOpen, setIsModalOpen] = useState(false); 


  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setSessionCookie(userData); 
    setIsModalOpen(false);
  };

const logout = () => {
    setUser(null);
    eraseSessionCookie(); 
    authService.logout(); 
  };

  return (
    <BrowserRouter>
      {/* NAVBAR */}
      <Navbar user={user} onLogout={logout} onOpenLogin={() => setIsModalOpen(true)} />
      
    
      <AuthModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onLogin={handleLoginSuccess} 
      />
      
     
      <Suspense fallback={<div style={{ padding: '100px', textAlign: 'center' }}><h2>Cargando... ⚽</h2></div>}>
        <Routes>
        
          <Route path="/" element={<Home />} />
          <Route path="/buscar" element={<Buscar />} /> 
          <Route path="/reset-password" element={<ResetPassword />} /> 

        
          <Route path="/cancha/:id" element={<CanchaDetail onOpenLogin={() => setIsModalOpen(true)} />} />
          
          <Route path="/status" element={<SystemStatus />} />

         
          <Route element={<ProtectedRoute user={user} allowedRoles={['JUGADOR']} />}>
            <Route path="/mis-reservas" element={<MisReservas />} />
          </Route>

         
          <Route element={<ProtectedRoute user={user} allowedRoles={['DUENO']} />}>
            <Route path="/panel-dueno" element={<PanelDuenoPlaceholder />} />
          </Route>

          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;