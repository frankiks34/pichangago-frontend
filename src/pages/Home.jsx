import { canchasMock } from '../data/mockData';

const Home = () => {
  return (
    <div className="home-container">
      {/* SECCIÓN HERO */}
      <div className="hero">
        <h1>Reserva tu cancha<br /><span style={{ color: 'var(--green)' }}>en 30 segundos</span></h1>
        <p>Disponibilidad en tiempo real · Paga con Yape · Comprobante PDF automático</p>
        
        <div className="search-bar">
          <input type="text" placeholder="Buscar por nombre o dirección…" />
          <select>
            <option value="">Todos los distritos</option>
            <option value="Miraflores">Miraflores</option>
            <option value="San Borja">San Borja</option>
            <option value="La Molina">La Molina</option>
          </select>
          <button className="btn-search">🔍 Buscar</button>
        </div>
      </div>

      {/* SECCIÓN DE CANCHAS */}
      <div className="page-wrap">
        <div className="section-header">
          <div>
            <h2 className="section-title">Canchas disponibles</h2>
            <p className="section-sub">Mostrando {canchasMock.length} canchas en Lima</p>
          </div>
        </div>

        <div className="cards-grid">
          {canchasMock.map((cancha) => (
            <div className="cancha-card" key={cancha.id}>
              <img className="cancha-card-img" src={cancha.foto} alt={cancha.nombre} />
              <div className="cancha-card-body">
                <div className="cancha-card-distrito">{cancha.distrito}</div>
                <div className="cancha-card-nombre">{cancha.nombre}</div>
                <div className="cancha-card-tipo">{cancha.tipo}</div>
              </div>
              <div className="cancha-card-footer">
                <div className="cancha-price">
                  S/ {cancha.precioBase.toFixed(2)} <small>/ hora</small>
                </div>
                <div className="cancha-rating">
                  ⭐ {cancha.rating} <span>({cancha.totalReservas})</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;