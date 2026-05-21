import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService'; // Ruta correcta hacia su propio archivo

const Login = ({ onLogin }) => {
  const [authMode, setAuthMode] = useState('login'); 
  const [selectedRole, setSelectedRole] = useState('jugador'); 
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');

  const navigate = useNavigate();

 const handleSubmit = async (e) => {
    if (e) e.preventDefault(); // Evita que se recargue la página si viene del formulario
    console.log("⚽ ¡AHORA SÍ SE DISPARÓ LA FUNCIÓN YAHOO!"); 
    setIsLoading(true);
    setErrorMessage(''); 

    const rolFormateado = selectedRole.toUpperCase(); 

    try {
      if (authMode === 'login') {
        const response = await authService.login(email, password);
        
        const userSession = {
          name: response.usuario.nombre,
          role: response.usuario.rol,
          avatar: response.usuario.nombre.substring(0, 2).toUpperCase()
        };

        onLogin(userSession); 
        navigate('/'); 

      } else {
        await authService.register(nombre, apellido, email, password, rolFormateado);
        
        const responseLogin = await authService.login(email, password);
        
        const userSession = {
          name: responseLogin.usuario.nombre,
          role: responseLogin.usuario.rol,
          avatar: responseLogin.usuario.nombre.substring(0, 2).toUpperCase()
        };

        onLogin(userSession);
        navigate('/');
      }
    } catch (error) {
      setErrorMessage(error.message || 'Ocurrió un problema con la autenticación.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-wrap" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 65px)' }}>
      <div className="modal" style={{ position: 'relative', width: '100%', maxWidth: '400px', animation: 'none' }}>
        
        <div className="modal-head">
          <div className="modal-title">Acceder a PichangaGo</div>
        </div>

        <div className="modal-body">
          <div className="auth-tabs">
            <div 
              className={`auth-tab ${authMode === 'login' ? 'active' : ''}`} 
              onClick={() => { setAuthMode('login'); setErrorMessage(''); }}
            >
              Ingresar
            </div>
            <div 
              className={`auth-tab ${authMode === 'register' ? 'active' : ''}`} 
              onClick={() => { setAuthMode('register'); setErrorMessage(''); }}
            >
              Registrarse
            </div>
          </div>
          
          <div className="role-options">
            <div 
              className={`role-opt ${selectedRole === 'jugador' ? 'active' : ''}`} 
              onClick={() => setSelectedRole('jugador')}
            >
              ⚽ Soy Jugador
            </div>
            <div 
              className={`role-opt ${selectedRole === 'dueno' ? 'active' : ''}`} 
              onClick={() => setSelectedRole('dueno')}
            >
              🏟️ Soy Dueño
            </div>
          </div>

          {errorMessage && (
            <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '0.9em', textAlign: 'center', fontWeight: '500', border: '1px solid #fca5a5' }}>
              ❌ {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {authMode === 'register' && (
              <>
                <div className="form-group">
                  <label className="form-label">Nombre</label>
                  <input 
                    className="form-input" 
                    type="text" 
                    placeholder="Tu nombre" 
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Apellido</label>
                  <input 
                    className="form-input" 
                    type="text" 
                    placeholder="Tu apellido" 
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    required 
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label className="form-label">Correo electrónico</label>
              <input 
                className="form-input" 
                type="email" 
                placeholder="ejemplo@correo.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <input 
                className="form-input" 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>

            {authMode === 'register' && selectedRole === 'dueno' && (
              <div className="form-group" id="ruc-field">
                <label className="form-label">RUC de la Cancha / Empresa</label>
                <input className="form-input" type="text" placeholder="Ej: 20123456789" required />
              </div>
            )}

           <button 
              type="submit" 
              className="btn btn-dark" 
              disabled={isLoading}
              onClick={handleSubmit} // 🎯 ¡ESTO OBLIGA A REACT A DISPARAR LA FUNCIÓN AL HACER CLIC!
              style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: '10px' }}
            >
              {isLoading 
                ? <><span className="loader" style={{marginRight: '8px'}}></span> Conectando a Azure...</> 
                : (authMode === 'login' ? 'Iniciar Sesión' : 'Registrarse')
              }
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Login;