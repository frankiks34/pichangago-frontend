const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const authService = {

  getCurrentUser: () => {
    const userStr = localStorage.getItem('usuario');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  },

  register: async (nombre, apellido, email, password, rol) => {
    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, apellido, email, password, rol }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error en el registro');
      return data;
    } catch (error) {
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
      if (!response.ok) throw new Error(data.error || 'Error en el login');

      if (data.token) {
        localStorage.setItem('token', data.token); 
        localStorage.setItem('refreshToken', data.refreshToken); 
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
      }
      return data;
    } catch (error) {
      throw error; 
    }
  },

 
logout: async (esManual = true) => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (esManual && refreshToken) {
      await fetch(`${API_URL}/api/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
    }
  } catch (error) {
    console.error('Error al notificar el logout:', error);
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('usuario');

    document.cookie = "pichangago_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict";
    window.location.href = '/';
  }
},

  refreshAccessToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('No hay refresh token guardado');

      const response = await fetch(`${API_URL}/api/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      // 🛡️ SI AZURE SE COLAPSA (500), lanzamos el error especial
      if (response.status >= 500) {
        throw new Error('SATURACION_BD');
      }

      const data = await response.json();
      if (!response.ok) throw new Error('Token inválido o caducado');

      localStorage.setItem('token', data.accessToken);
      return data.accessToken;
    } catch (error) {
  
      if (error.message !== 'SATURACION_BD') {
        authService.logout(false); 
      }
      throw error;
    }
  },

  fetchProtected: async (endpoint, options = {}) => {
    let token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, ...options.headers };
    let response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });

    if (response.status === 401) {
      const newToken = await authService.refreshAccessToken();
      headers['Authorization'] = `Bearer ${newToken}`;
      response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
    }
    return response;
  }
};