// src/services/authService.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const authService = {
  register: async (nombre, apellido, email, password, rol) => {
    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Error en el login');
      }

      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
      }

      return data;
    } catch (error) {
      console.error('Error en authService.login:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = '/login';
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('usuario');
    return userStr ? JSON.parse(userStr) : null;
  }
};