const API_URL = 'http://localhost:5000/api/dueno';

// Función auxiliar para extraer el token JWT guardado en el Login del grupo
const getAuthHeaders = () => {
    const token = localStorage.getItem('token'); 
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const duenoService = {
    // D-01: Registrar Cancha
    registrarCancha: async (datosCancha) => {
        const response = await fetch(`${API_URL}/canchas`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(datosCancha)
        });
        return response.json();
    },

    // D-02: Configurar cuenta de cobro
    actualizarPerfilFinanciero: async (datosFinancieros) => {
        const response = await fetch(`${API_URL}/perfil-financiero`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(datosFinancieros)
        });
        return response.json();
    },

    // D-03 y D-04: Registrar el lote de horarios de apertura y sus tarifas
    configurarHorariosTarifas: async (idCancha, listaHorarios) => {
        const response = await fetch(`${API_URL}/canchas/${idCancha}/horarios`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ horarios: listaHorarios })
        });
        return response.json();
    },

    // D-07 y D-08: Obtener la agenda de partidos de un día específico
    obtenerAgendaDiaria: async (fecha) => {
        const response = await fetch(`${API_URL}/agenda/diaria?fecha=${fecha}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        return response.json();
    },

    // D-10 y D-11: Bloquear slot manualmente o reportar No-Show
    actualizarEstadoSlot: async (idSlot, nuevoEstado) => {
        const response = await fetch(`${API_URL}/slots/${idSlot}/estado`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ nuevoEstado })
        });
        return response.json();
    },

    // D-12: Publicar una oferta relámpago para un slot vacío
    crearOfertaSlot: async (idSlot, datosOferta) => {
        const response = await fetch(`${API_URL}/slots/${idSlot}/oferta`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(datosOferta) // { porcentajeDescuento, precioOfertado, fechaExpira }
        });
        return response.json();
    }
};