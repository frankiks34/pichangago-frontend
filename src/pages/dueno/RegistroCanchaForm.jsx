import { useState } from 'react';
import { duenoService } from '../../services/duenoService';

export default function RegistroCanchaForm({ onCanchaCreada }) {
    const [formData, setFormData] = useState({
        nombre: '', 
        descripcion: '', 
        direccion: '', 
        distrito: 'San Juan de Miraflores',
        precioBase: '', 
        precioPrime: '', 
        precioBaja: ''
    });
    const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

    const distritosLima = [
        'San Juan de Miraflores', 'Santiago de Surco', 'Los Olivos', 
        'La Victoria', 'Chorrillos', 'San Borja', 'Magdalena del Mar'
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje({ tipo: '', texto: '' });

        // Ajuste preventivo: si los precios alternativos están vacíos, heredan el base
        const datosParaEnviar = {
            ...formData,
            precioPrime: formData.precioPrime || formData.precioBase,
            precioBaja: formData.precioBaja || formData.precioBase
        };

        const res = await duenoService.registrarCancha(datosParaEnviar);
        
        if (res.status === 'success') {
            setMensaje({ tipo: 'success', texto: `⚽ ¡Cancha registrada! ID: ${res.idCancha}` });
            
            // Limpiamos el formulario para evitar re-envíos involuntarios
            setFormData({
                nombre: '', descripcion: '', direccion: '', distrito: 'San Juan de Miraflores',
                precioBase: '', precioPrime: '', precioBaja: ''
            });

            if (onCanchaCreada) onCanchaCreada(res.idCancha); 
        } else {
            setMensaje({ tipo: 'error', texto: res.error || 'Ocurrió un error inesperado.' });
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>🏗️ Registrar Nueva Cancha</h2>
            
            {mensaje.texto && (
                <div style={{ color: mensaje.tipo === 'success' ? 'green' : 'red', marginBottom: '15px', fontWeight: 'bold' }}>
                    {mensaje.texto}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nombre del Complejo:</label>
                    <input type="text" name="nombre" value={formData.nombre} required onChange={handleChange} style={{ width: '100%', marginBottom: '10px', padding: '6px' }} />
                </div>
                <div>
                    <label>Descripción corta (Breve reseña):</label>
                    <input type="text" name="descripcion" value={formData.descripcion} onChange={handleChange} style={{ width: '100%', marginBottom: '10px', padding: '6px' }} />
                </div>
                <div>
                    <label>Dirección Exacta (Av/Calle/Jr):</label>
                    <input type="text" name="direccion" value={formData.direccion} required onChange={handleChange} style={{ width: '100%', marginBottom: '10px', padding: '6px' }} />
                </div>
                <div>
                    <label>Distrito de Lima:</label>
                    <select name="distrito" value={formData.distrito} onChange={handleChange} style={{ width: '100%', padding: '6px', marginBottom: '10px' }}>
                        {distritosLima.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>
                <div>
                    <label>Precio Base (S/ por Hora):</label>
                    <input type="number" name="precioBase" value={formData.precioBase} required onChange={handleChange} style={{ width: '100%', marginBottom: '10px', padding: '6px' }} />
                </div>
                <div>
                    <label>Precio Prime (Tardes/Noches - S/):</label>
                    <input type="number" name="precioPrime" value={formData.precioPrime} onChange={handleChange} style={{ width: '100%', marginBottom: '10px', padding: '6px' }} />
                </div>
                <div>
                    <label>Precio Baja/Valle (Mañanas - S/):</label>
                    <input type="number" name="precioBaja" value={formData.precioBaja} onChange={handleChange} style={{ width: '100%', marginBottom: '20px', padding: '6px' }} />
                </div>
                <button type="submit" style={{ background: '#00b48a', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '5px', cursor: 'pointer', width: '100%', fontWeight: 'bold' }}>
                    Guardar Cancha y Continuar
                </button>
            </form>
        </div>
    );
}