import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function PanelDueno() {
    const [loading, setLoading] = useState(true);
    const [tieneCanchas, setTieneCanchas] = useState(false);
    const [resumen, setResumen] = useState({ reservasHoy: 0, ingresosMes: 0, ocupacion: 0 });

    useEffect(() => {
        // Simulación de llamada a la API de métricas/slots que creamos en el Back
        // Aquí consumirás tu endpoint: GET /api/dueno/agenda/hoy o tus KPIs
        const verificarEstadoNegocio = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:5000/api/dueno/agenda/hoy', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const res = await response.json();

                if (res.status === 'success') {
                    // Si el backend responde con un array, evaluamos si tiene registros
                    if (res.data && res.data.length > 0) {
                        setTieneCanchas(true);
                        // Filtros o acumuladores rápidos para tus KPIs
                        setResumen({
                            reservasHoy: res.data.filter(s => s.ID_Reserva).length,
                            ingresosMes: res.data.reduce((acc, cur) => acc + (cur.Monto_Total || 0), 0),
                            ocupacion: Math.round((res.data.filter(s => s.EstadoSlot === 'RESERVADO').length / res.data.length) * 100) || 0
                        });
                    } else {
                        setTieneCanchas(false);
                    }
                }

                if (response.status === 404) {
                    setTieneCanchas(false);
                    setErrorPerfil(true);
                    return;
                }

            } catch (error) {
                console.error("Error al conectar con el panel de dueño:", error);
            } finally {
                setLoading(false);
            }
        };

        verificarEstadoNegocio();
    }, []);

    if (loading) {
        return <div style={{ padding: '100px', textAlign: 'center' }}>Cargando panel de control... ⚽</div>;
    }

    // FLUJO A: Si el dueño es nuevo y no tiene infraestructura parametrizada
    if (!tieneCanchas) {
        return (
            <div style={{ padding: '80px 24px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
                <h2 style={{ fontSize: '28px', marginBottom: '16px' }}>¡Bienvenido a PichangaGO! 🏟️</h2>
                <p style={{ color: 'gray', fontSize: '16px', marginBottom: '24px' }}>
                    Para empezar a recibir reservas de los peloteros de Lima y aparecer en nuestro mapa de búsqueda, necesitas configurar tu complejo deportivo por única vez.
                </p>
                <Link to="/panel-dueno/onboarding" style={{ background: '#00b48a', color: 'white', padding: '14px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', display: 'inline-block' }}>
                    🚀 Configurar mis Canchas y Horarios
                </Link>
            </div>
        );
    }

    // FLUJO B: Panel Operacional y Dashboard Diario (Momento 2 y 3)
    return (
        <div style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '26px', marginBottom: '4px' }}>Panel de Control — PichangaGO</h2>
            <p style={{ color: 'gray', marginBottom: '24px' }}>Monitorea el rendimiento de tus canchas en tiempo real.</p>

            {/* Fichas de KPIs / Métricas */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '4px' }}>
                <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '12px', background: '#fff', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ fontSize: '14px', color: '#666', margin: 0 }}>Reservas para Hoy</h3>
                    <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0 0 0', color: '#1e2530' }}>{resumen.reservasHoy}</p>
                </div>
                <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '12px', background: '#fff', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ fontSize: '14px', color: '#666', margin: 0 }}>Ingresos Estimados (Hoy)</h3>
                    <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0 0 0', color: '#00b48a' }}>S/ {resumen.ingresosMes.toFixed(2)}</p>
                </div>
                <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '12px', background: '#fff', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ fontSize: '14px', color: '#666', margin: 0 }}>% Ocupación Diario</h3>
                    <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0 0 0', color: '#ff9800' }}>{resumen.ocupacion}%</p>
                </div>
            </div>

            {/* Espacio reservado para la Agenda del Momento 2 */}
            <div style={{ marginTop: '40px', padding: '20px', border: '1px dashed #ccc', borderRadius: '12px', textAlign: 'center', color: '#666' }}>
                <h3>📅 Próxima parada: Agenda de Slots Diarios</h3>
                <p>Aquí listaremos la grilla interactiva de partidos para controlar asistencias y bloquear horas.</p>
            </div>
        </div>
    );
}