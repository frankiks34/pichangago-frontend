// src/services/authService.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const authService = {
  register: async (nombre, apellido, email, password, rol) => {
    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, apellido, email, password, rol }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Error en el registro');
      }
      return data;
    } catch (error) {
      console.error('Error en authService.register:', error);
      throw error;
    }
  },

  login: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      // 🚨 AQUÍ VIAJAN TUS MENSAJES DE ERROR ("Te quedan X intentos", "Cuenta bloqueada")
      if (!response.ok) {
        throw new Error(data.error || 'Error en el login');
      }

      if (data.token) {
        localStorage.setItem('token', data.token); // Llave de 15 min
        localStorage.setItem('refreshToken', data.refreshToken); // NUEVO: Llave maestra de 7 días
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
      }

      return data;
    } catch (error) {
      console.error('Error en authService.login:', error);
      throw error; // Lanzamos el error para que tu Login.jsx lo atrape
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken'); // NUEVO: Limpiamos la llave maestra
    localStorage.removeItem('usuario');
    window.location.href = '/login';
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('usuario');
    return userStr ? JSON.parse(userStr) : null;
  },

  // =========================================================
  // 🛡️ HU-06: LÓGICA DE REFRESCO SILENCIOSO (NUEVO)
  // =========================================================
  
  // Método auxiliar que pide la nueva llave corta al backend
  refreshAccessToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('No hay refresh token guardado');

      const response = await fetch(`${API_URL}/api/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error('Refresh token inválido o caducado');

      // Guardamos la nueva llave corta en el navegador
      localStorage.setItem('token', data.accessToken);
      return data.accessToken;
    } catch (error) {
      // Si el hacker manipuló la llave maestra o caducó a los 7 días, lo botamos
      authService.logout();
      throw error;
    }
  },

  // Tu "Interceptor" nativo: Usa este método en vez de fetch() normal para rutas protegidas
  fetchProtected: async (endpoint, options = {}) => {
    let token = localStorage.getItem('token');

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    };

    // 1. Intentamos la petición normal
    let response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });

    // 2. Si el servidor dice que la llave corta expiró (401)
    if (response.status === 401) {
      // Pedimos una nueva llave silenciosamente
      const newToken = await authService.refreshAccessToken();

      // 3. Reintentamos la jugada original con la llave nueva
      headers['Authorization'] = `Bearer ${newToken}`;
      response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
    }

    return response;
  }
};