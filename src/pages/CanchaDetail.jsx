import { useParams, Link } from 'react-router-dom';
import { canchasMock } from '../data/mockData';

const CanchaDetail = () => {
  const { id } = useParams();
  const cancha = canchasMock.find(c => c.id === id);

  if (!cancha) return <div style={{padding: '50px', textAlign: 'center'}}>Cancha no encontrada</div>;

  return (
    <div style={{ animation: 'fadeIn .25s ease' }}>
      
      {/* HEADER DEL DETALLE */}
      <div className="detail-header">
        <Link to="/" className="back-btn" style={{ textDecoration: 'none', color: 'inherit' }}>←</Link>
        <div>
          <div style={{fontSize: '12px', color: 'var(--textMid)'}}>Inicio / {cancha.nombre}</div>
          <div style={{fontWeight: '700', fontSize: '16px'}}>{cancha.nombre}</div>
        </div>
      </div>

      <div className="detail-body">
        {/* LADO IZQUIERDO: GALERÍA Y DATOS */}
        <div>
          {/* GALERÍA BENTO GRID (IP-106) */}
          <div className="bento-gallery">
            <img src={cancha.foto} alt={cancha.nombre} className="bento-main-img" />
            <div className="bento-side">
              {/* Usamos la misma foto como relleno si no hay galería completa, o puedes añadir array de fotos a tu mockData */}
              <img src={cancha.foto} alt="Vista 2" className="bento-side-img" style={{ filter: 'brightness(0.8)' }} />
              <img src={cancha.foto} alt="Vista 3" className="bento-side-img" style={{ filter: 'brightness(1.1)' }} />
            </div>
          </div>

          {/* INFORMACIÓN BASADA EN TU MOCKUP */}
          <div className="detail-info">
            <div className="detail-distrito">{cancha.distrito}</div>
            <div className="detail-nombre">{cancha.nombre}</div>
            
            <div className="detail-meta">
              <span className="badge badge-gray">{cancha.tipo}</span>
              <span className="badge badge-green">⭐ {cancha.rating} ({cancha.totalReservas})</span>
              <span className="badge badge-gray">📍 {cancha.direccion}</span>
            </div>

            <div className="detail-amenidades">
              {cancha.amenidades ? cancha.amenidades.map((amenidad, idx) => (
                <span key={idx} className="amenidad">{amenidad}</span>
              )) : (
                <>
                  <span className="amenidad">Vestuarios</span>
                  <span className="amenidad">Estacionamiento</span>
                  <span className="amenidad">Iluminación LED</span>
                </>
              )}
            </div>

            <div className="precios-tabla">
              <div style={{fontSize: '13px', fontWeight: '700', marginBottom: '10px', color: 'var(--textMid)'}}>TARIFAS POR FRANJA</div>
              <div className="precio-row">
                <span className="precio-label">🌅 Valle (antes de 12:00)</span>
                <span className="precio-val">S/ {cancha.precioBase - 15}.00 /hr</span>
              </div>
              <div className="precio-row">
                <span className="precio-label">☀️ Normal (12:00 – 17:00)</span>
                <span className="precio-val">S/ {cancha.precioBase}.00 /hr</span>
              </div>
              <div className="precio-row">
                <span className="precio-label">⭐ Prime (18:00 – 22:00)</span>
                <span className="precio-val">S/ {cancha.precioBase + 20}.00 /hr</span>
              </div>
            </div>
          </div>
        </div>

        {/* LADO DERECHO: PANEL GLASSMORPHISM (IP-106) */}
        <div>
          <div className="glass-panel">
            <div className="glass-panel-title">📅 Reservar ahora</div>
            
            {/* Simulando UI de tu mockup */}
            <div style={{ padding: '16px', background: 'var(--white)', borderRadius: '12px', border: '1px solid var(--gray2)', marginBottom: '16px' }}>
              <div style={{ fontSize: '13px', color: 'var(--textMid)' }}>Precio Normal</div>
              <div style={{ fontFamily: 'var(--font-head)', fontSize: '28px', fontWeight: '800', color: 'var(--green)' }}>
                S/ {cancha.precioBase}.00
              </div>
              <div style={{ fontSize: '12px', color: 'var(--gray4)', marginTop: '4px' }}>Pago de adelanto: S/ 15.00</div>
            </div>

            <button className="btn btn-green" style={{ width: '100%', padding: '14px', fontSize: '15px', justifyContent: 'center' }}>
              Seleccionar Horario →
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default CanchaDetail;