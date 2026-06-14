import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { duenoService } from '../../services/duenoService';

export default function PanelDueno() {
    const [loading, setLoading] = useState(true);
    const [tieneCanchas, setTieneCanchas] = useState(false);
    const [errorPerfil, setErrorPerfil] = useState(false);
    const [vistaActiva, setVistaActiva] = useState('agenda'); // 'agenda' o 'canchas'
    
    // Filtros y datos de operación
    const [fechaFiltro, setFechaFiltro] = useState(new Date().toISOString().split('T')[0]);
    const [slots, setSlots] = useState([]);
    const [canchasUnicas, setCanchasUnicas] = useState([]);
    
    // Estados para modales rápidos de ofertas y edición
    const [slotSeleccionado, setSlotSeleccionado] = useState(null);
    const [descuento, setDescuento] = useState(20);
    const [precioBaseSlot, setPrecioBaseSlot] = useState(0);
    
    // Estado para el formulario de edición rápida (D-05)
    const [canchaEditando, setCanchaEditando] = useState(null);

    const [resumen, setResumen] = useState({ reservasHoy: 0, ingresosHoy: 0, ocupacion: 0 });

    const cargarDatosPanel = async () => {
        setLoading(true);
        try {
            const res = await duenoService.obtenerAgendaDiaria(fechaFiltro);

            if (res.status === 'success') {
                if (res.data && res.data.length > 0) {
                    setTieneCanchas(true);
                    setSlots(res.data);
                    
                    // Extraer una lista de canchas únicas para la sección "Mis Canchas"
                    const mapeoEspejo = {};
                    res.data.forEach(s => {
                        if (!mapeoEspejo[s.ID_Cancha]) {
                            mapeoEspejo[s.ID_Cancha] = {
                                ID_Cancha: s.ID_Cancha,
                                Nombre: s.CanchaNombre,
                                Tipo: s.CanchaTipo,
                                Estado: s.EstadoSlot === 'BLOQUEADO' ? 'SUSPENDIDO' : 'DISPONIBLE', // Estado base
                                Precio_Base: s.Tipo_Precio === 'BASE' ? s.Monto_Total : 90 // fallback referencial
                            };
                        }
                    });
                    setCanchasUnicas(Object.values(mapeoEspejo));
                    
                    const reservados = res.data.filter(s => s.ID_Reserva);
                    const ingresos = reservados.reduce((acc, cur) => acc + (cur.Monto_Total || 0), 0);
                    const porc = Math.round((reservados.length / res.data.length) * 100) || 0;

                    setResumen({ reservasHoy: reservados.length, ingresosHoy: ingresos, ocupacion: porc });
                } else {
                    setTieneCanchas(false);
                }
            } else if (res.error && res.error.includes('inicializado')) {
                setErrorPerfil(true);
            }
        } catch (error) {
            console.error("🚨 Error al conectar con el panel:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDatosPanel();
    }, [fechaFiltro]);

    // D-10 y D-11: Alternar estados del slot
    const handleCambiarEstado = async (idSlot, nuevoEstado) => {
        const res = await duenoService.actualizarEstadoSlot(idSlot, nuevoEstado);
        if (res.status === 'success') {
            cargarDatosPanel();
        } else {
            alert(`❌ Error: ${res.error}`);
        }
    };

    // D-06: Borrado Lógico / Suspender Cancha Completa
    const handleSuspenderCancha = async (idCancha, estadoActual) => {
        const nuevoEstado = estadoActual === 'DISPONIBLE' ? 'SUSPENDIDO' : 'DISPONIBLE';
        const confirmar = window.confirm(`¿Seguro que deseas cambiar el estado de la cancha a ${nuevoEstado}?`);
        if (!confirmar) return;

        const res = await duenoService.cambiarEstadoCancha(idCancha, nuevoEstado);
        if (res.status === 'success') {
            alert(`✅ Cancha configurada como ${nuevoEstado}`);
            cargarDatosPanel();
        } else {
            alert(`❌ Error: ${res.error}`);
        }
    };

    const handlePublicarOferta = async (e) => {
        e.preventDefault();
        const precioConDescuento = precioBaseSlot - (precioBaseSlot * (descuento / 100));
        const res = await duenoService.crearOfertaSlot(slotSeleccionado, {
            porcentajeDescuento: descuento,
            precioOfertado: precioConDescuento,
            fechaExpira: fechaFiltro
        });
        if (res.status === 'success') {
            setSlotSeleccionado(null);
            cargarDatosPanel();
        }
    };

    const obtenerEstiloEstado = (estado) => {
        switch (estado.toUpperCase()) {
            case 'RESERVADO': return { borderLeft: '8px solid #0056b3', background: '#e6f0fa' };
            case 'BLOQUEADO': return { borderLeft: '8px solid #6c757d', background: '#f1f3f5' };
            case 'OFERTA': return { borderLeft: '8px solid #ffc107', background: '#fff9e6' };
            default: return { borderLeft: '8px solid #28a745', background: '#eafaf1' };
        }
    };

    if (errorPerfil) return <div style={{ padding: '100px', textAlign: 'center' }}><h2>⚠️ Error de Perfil Inicial</h2></div>;
    if (!tieneCanchas && !loading) {
        return (
            <div style={{ padding: '100px', textAlign: 'center' }}>
                <h2>🏟️ No tienes canchas creadas</h2>
                <Link to="/panel-dueno/onboarding" style={{ background: '#00b48a', color: 'white', padding: '12px 24px', borderRadius: '6px', textDecoration: 'none' }}>Crear Cancha</Link>
            </div>
        );
    }

    return (
        <div style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
            
            {/* Menú de pestañas superior */}
            <div style={{ display: 'flex', borderBottom: '2px solid #eee', marginBottom: '20px', gap: '20px' }}>
                <button onClick={() => setVistaActiva('agenda')} style={{ background: 'none', border: 'none', padding: '10px 20px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', borderBottom: vistaActiva === 'agenda' ? '3px solid #00b48a' : 'none', color: vistaActiva === 'agenda' ? '#00b48a' : '#666' }}>
                    📅 Agenda Operativa
                </button>
                <button onClick={() => setVistaActiva('canchas')} style={{ background: 'none', border: 'none', padding: '10px 20px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', borderBottom: vistaActiva === 'canchas' ? '3px solid #00b48a' : 'none', color: vistaActiva === 'canchas' ? '#00b48a' : '#666' }}>
                    🏟️ Mis Canchas (CRUD)
                </button>
            </div>

            {/* VISTA 1: AGENDA DIARIA */}
            {vistaActiva === 'agenda' && (
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <h3>🎛️ Monitor de Horarios del Complejo</h3>
                        <input type="date" value={fechaFiltro} onChange={(e) => setFechaFiltro(e.target.value)} style={{ padding: '6px' }} />
                    </div>

                    <div style={{ display: 'grid', gap: '15px' }}>
                        {slots.map((slot) => (
                            <div key={slot.ID_Slots} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderRadius: '6px', border: '1px solid #eee', ...obtenerEstiloEstado(slot.EstadoSlot) }}>
                                <div>
                                    <span style={{ fontWeight: 'bold', display: 'block' }}>⏰ {slot.Fecha_Inicio.split('T')[1].substring(0, 5)} - {slot.Fecha_Fin.split('T')[1].substring(0, 5)}</span>
                                    <span style={{ fontSize: '14px', color: '#666' }}>🏟️ {slot.CanchaNombre} | Tarifa: <strong>{slot.Tipo_Precio}</strong></span>
                                </div>
                                <div style={{ flex: 1, marginLeft: '40px' }}>
                                    {slot.EstadoSlot.toUpperCase() === 'RESERVADO' ? (
                                        <span style={{ fontSize: '14px' }}>👤 <strong>{slot.JugadorNombre}</strong> ({slot.JugadorTelefono})</span>
                                    ) : <span style={{ color: '#999' }}>Disponible</span>}
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    {slot.EstadoSlot === 'DISPONIBLE' && (
                                        <>
                                            <button onClick={() => handleCambiarEstado(slot.ID_Slots, 'BLOQUEADO')} style={{ background: '#6c757d', color: 'white', border: 'none', padding: '6px', borderRadius: '4px', cursor: 'pointer' }}>🔒 Bloquear</button>
                                            <button onClick={() => { setSlotSeleccionado(slot.ID_Slots); setPrecioBaseSlot(90); }} style={{ background: '#ff9800', color: 'white', border: 'none', padding: '6px', borderRadius: '4px', cursor: 'pointer' }}>🔥 Oferta</button>
                                        </>
                                    )}
                                    {slot.EstadoSlot === 'BLOQUEADO' && <button onClick={() => handleCambiarEstado(slot.ID_Slots, 'DISPONIBLE')} style={{ background: '#28a745', color: 'white', border: 'none', padding: '6px', borderRadius: '4px' }}>释放 Liberar</button>}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* VISTA 2: CRUD DE MIS CANCHAS */}
            {vistaActiva === 'canchas' && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3>🛠️ Catálogo de Infraestructura</h3>
                        <Link to="/panel-dueno/onboarding" style={{ background: '#00b48a', color: 'white', padding: '10px 20px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold' }}>➕ Registrar Otra Cancha</Link>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden', border: '1px solid #eee' }}>
                        <thead>
                            <tr style={{ background: '#1e2530', color: 'white', textAlign: 'left' }}>
                                <th style={{ padding: '12px' }}>ID Cancha</th>
                                <th style={{ padding: '12px' }}>Nombre</th>
                                <th style={{ padding: '12px' }}>Configuración</th>
                                <th style={{ padding: '12px' }}>Estado Operativo</th>
                                <th style={{ padding: '12px' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {canchasUnicas.map(cancha => (
                                <tr key={cancha.ID_Cancha} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{cancha.ID_Cancha}</td>
                                    <td style={{ padding: '12px' }}>{cancha.Nombre}</td>
                                    <td style={{ padding: '12px', color: '#666' }}>{cancha.Tipo}</td>
                                    <td style={{ padding: '12px' }}>
                                        <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', background: cancha.Estado === 'DISPONIBLE' ? '#eafaf1' : '#fce8e6', color: cancha.Estado === 'DISPONIBLE' ? '#28a745' : '#dc3545' }}>
                                            {cancha.Estado}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px', display: 'flex', gap: '10px' }}>
                                        <button onClick={() => setCanchaEditando(cancha)} style={{ background: '#0056b3', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>✏️ Editar</button>
                                        <button onClick={() => handleSuspenderCancha(cancha.ID_Cancha, cancha.Estado)} style={{ background: cancha.Estado === 'DISPONIBLE' ? '#dc3545' : '#28a745', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>
                                            {cancha.Estado === 'DISPONIBLE' ? '❌ Suspender' : '✅ Reactivar'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal de edición rápida si se requiere (D-05) */}
            {canchaEditando && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ background: 'white', padding: '24px', borderRadius: '8px', maxWidth: '400px', width: '100%' }}>
                        <h3>✏️ Editar Cancha {canchaEditando.ID_Cancha}</h3>
                        <p style={{ fontSize: '13px', color: '#666' }}>Modifica la información estructural del complejo.</p>
                        <button onClick={() => setCanchaEditando(null)} style={{ background: '#6c757d', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', width: '100%', marginTop: '15px' }}>Cerrar y Volver</button>
                    </div>
                </div>
            )}
        </div>
    );
}