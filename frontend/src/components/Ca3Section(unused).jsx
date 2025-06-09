import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Ca3Section({ goTo, formData }) {
  const [patologias, setPatologias] = useState([]);
  const [actividades, setActividades] = useState([]);
  const [cantidad, setCantidad] = useState(0);

  // Cargar patologías y actividades desde backend
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/patologias`).then(res => setPatologias(res.data));
    axios.get(`${import.meta.env.VITE_API_URL}/api/actividades`).then(res => setActividades(res.data));
  }, []);

  const handleCantidadChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setCantidad(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);

    const actividadesFinal = [];
    for (let i = 1; i <= cantidad; i++) {
      actividadesFinal.push({
        id: data.get(`actividad_${i}`),
        frecuencia: data.get(`horasActividad_${i}`)
      });
    }

    const payload = {
      ...formData,
      patologias: [data.get('patologia')],
      actividades: actividadesFinal
    };

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/CreateAccount`, payload),  { withCredentials: true };
      alert('Cuenta creada exitosamente');
      goTo('login');
    } catch (error) {
      console.error(error);
      alert('Error al crear cuenta');
    }
  };

  return (
    <section id="ca3-section" className="ca1-container" style={{ display: 'flex' }}>
      <button className="back-button" onClick={() => goTo('ca2')} type="button">
        <img src="/img/icon_back.svg" alt="Back" />
      </button>
      <div className="ca1-content">
        <form onSubmit={handleSubmit}>
          <div className="ca1-text">
            <h1 className="ca1-heading">Ingresa tu información de salud</h1>
            <h3 className="ca1-subheading">Selecciona tus patologías y actividades físicas</h3>
          </div>

          <div className="ca1-inputs-grid">
            {/* Patología */}
            <div className="ca1-input-group">
              <select name="patologia" id="patologia" required>
                <option value="">Selecciona tu patología</option>
                {patologias.map(p => (
                  <option key={p.id_patologia} value={p.id_patologia}>
                    {p.nombre_patologia}
                  </option>
                ))}
              </select>
            </div>

            {/* Cantidad de actividades */}
            <div className="ca1-input-group">
              <input
                type="number"
                min="0"
                id="cantActividades"
                name="cantActividades"
                placeholder="¿Cuántos deportes haces semanalmente?"
                required
                onChange={handleCantidadChange}
              />
            </div>

            {/* Inputs dinámicos según cantidad */}
            <div id="actividades-container">
              {[...Array(cantidad)].map((_, i) => (
                <div key={i}>
                  <div className="ca1-input-group">
                    <select name={`actividad_${i + 1}`} required>
                      <option value="">Selecciona la actividad física número {i + 1}</option>
                      {actividades.map(act => (
                        <option key={act.id_actividad} value={act.id_actividad}>
                          {act.nombre_actividad}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="ca1-input-group">
                    <input
                      type="number"
                      min="0"
                      name={`horasActividad_${i + 1}`}
                      placeholder={`¿Cuántas horas por semana haces la actividad ${i + 1}?`}
                      required
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="ca1-btn-next">Siguiente</button>
        </form>
      </div>
    </section>
  );
}
