import { useState } from 'react'; // Paso 1: Importar el estado
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // Estado para el menú móvil
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo" style={{textDecoration:'none', color:'inherit', display:'flex', alignItems:'center', gap:'8px', fontWeight:800}}>
        <div style={{background:'var(--green)', width:'30px', height:'30px', borderRadius:'50%', display:'flex', justifyContent:'center', alignItems:'center'}}>⚽</div>
        PichangaGo
      </Link>

      {/* BOTÓN HAMBURGUESA: Solo se verá en móviles */}
      <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕' : '☰'}
      </button>
      
      {/* Agregamos la clase 'open' si el estado es true */}
      <div className={`nav-links ${isOpen ? 'open' : ''}`}>
        <Link to="/" className={`nav-link ${isActive('/')}`} onClick={() => setIsOpen(false)}>Inicio</Link>
        <Link to="/buscar" className={`nav-link ${isActive('/buscar')}`} onClick={() => setIsOpen(false)}>Buscar canchas</Link>
        <button className="nav-link login-btn">Iniciar Sesión</button>
      </div>
    </nav>
  );
};

export default Navbar;