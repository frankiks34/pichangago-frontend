import { useState } from 'react'; 
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // Estado para el menú móvil
  const location = useLocation();

  // Función para saber si estamos en una página específica y pintar el link de otro color
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      {/* LOGO */}
      <Link to="/" className="nav-logo" style={{textDecoration:'none', color:'inherit', display:'flex', alignItems:'center', gap:'8px', fontWeight:800}}>
        <div style={{background:'var(--green)', width:'30px', height:'30px', borderRadius:'50%', display:'flex', justifyContent:'center', alignItems:'center'}}>⚽</div>
        PichangaGo
      </Link>

      {/* BOTÓN HAMBURGUESA: Solo se verá en móviles */}
      <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕' : '☰'}
      </button>
      
      {/* ENLACES DE NAVEGACIÓN */}
      <div className={`nav-links ${isOpen ? 'open' : ''}`}>
        <Link 
          to="/" 
          className={`nav-link ${isActive('/')}`} 
          onClick={() => setIsOpen(false)}
        >
          Inicio
        </Link>
        
        <Link 
          to="/buscar" 
          className={`nav-link ${isActive('/buscar')}`} 
          onClick={() => setIsOpen(false)}
        >
          Buscar canchas
        </Link>
        
        {/* BOTÓN DE LOGIN: Ahora es un Link real a /login */}
        <Link 
          to="/login" 
          className={`nav-link login-btn ${isActive('/login')}`} 
          onClick={() => setIsOpen(false)}
        >
          Iniciar Sesión
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;