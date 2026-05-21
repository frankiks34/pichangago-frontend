import React, { useState } from 'react';
import { authService } from '../services/authService'; // Conexión a tu API real

const AuthModal = ({ isOpen, onClose, onLogin }) => {
  const [isIngresar, setIsIngresar] = useState(true); 
  const [role, setRole] = useState('JUGADOR'); 
  
  // Estados reales
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    const rolFormateado = role.toUpperCase(); // 'JUGADOR' o 'DUENO'

    try {
      if (isIngresar) {
        // 🔑 LOGIN REAL M1
        const response = await authService.login(email, password);
        onLogin({
          name: response.usuario.nombre,
          role: response.usuario.rol,
          avatar: response.usuario.nombre.substring(0, 2).toUpperCase()
        });
        onClose(); // Cerramos el modal si hay éxito
      } else {
        // 📝 REGISTRO REAL M1
        await authService.register(nombre, apellido, email, password, rolFormateado);
        
        // Auto-login tras registro
        const responseLogin = await authService.login(email, password);
        onLogin({
          name: responseLogin.usuario.nombre,
          role: responseLogin.usuario.rol,
          avatar: responseLogin.usuario.nombre.substring(0, 2).toUpperCase()
        });
        onClose();
      }
    } catch (error) {
      setErrorMessage(error.message || 'Ocurrió un problema de autenticación.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000, display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        background: 'white', borderRadius: '20px', padding: '32px',
        width: '100%', maxWidth: '420px', position: 'relative',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
      }}>
        
        <button onClick={onClose} style={{
          position: 'absolute', top: '20px', right: '20px', background: 'none',
          border: 'none', fontSize: '18px', cursor: 'pointer', color: '#9ca3af'
        }}>✕</button>

        <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px', color: '#0f172a' }}>
          Acceder a PichangaGo
        </h3>

        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', marginBottom: '24px' }}>
          <button 
            onClick={() => { setIsIngresar(true); setErrorMessage(''); }}
            style={{
              flex: 1, paddingBottom: '12px', background: 'none', border: 'none',
              fontWeight: 600, cursor: 'pointer',
              color: isIngresar ? '#00b48a' : '#64748b',
              borderBottom: isIngresar ? '2px solid #00b48a' : 'none'
            }}
          >
            Ingresar
          </button>
          <button 
            onClick={() => { setIsIngresar(false); setErrorMessage(''); }}
            style={{
              flex: 1, paddingBottom: '12px', background: 'none', border: 'none',
              fontWeight: 600, cursor: 'pointer',
              color: !isIngresar ? '#00b48a' : '#64748b',
              borderBottom: !isIngresar ? '2px solid #00b48a' : 'none'
            }}
          >
            Registrarse
          </button>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          <button 
            type="button"
            onClick={() => setRole('JUGADOR')}
            style={{
              flex: 1, padding: '10px', borderRadius: '10px', cursor: 'pointer',
              border: role === 'JUGADOR' ? '2px solid #00b48a' : '1px solid #e2e8f0',
              backgroundColor: role === 'JUGADOR' ? '#e6f8f4' : 'white',
              fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px'
            }}
          >
            ⚽ Soy Jugador
          </button>
          <button 
            type="button"
            onClick={() => setRole('DUENO')}
            style={{
              flex: 1, padding: '10px', borderRadius: '10px', cursor: 'pointer',
              border: role === 'DUENO' ? '2px solid #00b48a' : '1px solid #e2e8f0',
              backgroundColor: role === 'DUENO' ? '#e6f8f4' : 'white',
              fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px'
            }}
          >
            🏟️ Soy Dueño
          </button>
        </div>

        {errorMessage && (
          <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '0.9em', textAlign: 'center', fontWeight: '500', border: '1px solid #fca5a5' }}>
            ❌ {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {!isIngresar && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px', color: '#475569' }}>Nombre</label>
                <input 
                  type="text" placeholder="Tu nombre" required value={nombre} onChange={(e) => setNombre(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px', color: '#475569' }}>Apellido</label>
                <input 
                  type="text" placeholder="Tu apellido" required value={apellido} onChange={(e) => setApellido(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }}
                />
              </div>
            </>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px', color: '#475569' }}>Correo electrónico</label>
            <input 
              type="email" placeholder="ejemplo@correo.com" required value={email} onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px', color: '#475569' }}>Contraseña</label>
            <input 
              type="password" placeholder="••••••••" required value={password} onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }}
            />
          </div>

          <button type="submit" disabled={isLoading} style={{
            width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
            backgroundColor: '#1e2530', color: 'white', fontWeight: 600,
            cursor: 'pointer', marginTop: '10px', fontSize: '16px', display: 'flex', justifyContent: 'center'
          }}>
            {isLoading ? 'Conectando a Azure...' : (isIngresar ? 'Iniciar Sesión' : 'Registrarse')}
          </button>
        </form>

      </div>
    </div>
  );
};

export default AuthModal;