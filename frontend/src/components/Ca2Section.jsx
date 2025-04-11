export default function Ca2Section({ goTo, updateForm }) {
  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData(e.target);
    const form = {
      nombre: data.get('nombre'),
      apellido: data.get('apellido'),
      fecha_nacimiento: data.get('fecha_nacimiento'),
      genero: data.get('genero'),
      altura: data.get('altura'),
      peso: data.get('peso')
    };

    updateForm(form);
    goTo('ca3');
  };
  
    return (
      <section id="ca2-section" className="ca1-container" style={{ display: 'flex' }}>
        <button className="back-button" onClick={() => goTo('ca1')} type="button">
          <img src="/img/icon_back.svg" alt="Back" />
        </button>
        <div className="ca1-content">
          <form onSubmit={handleSubmit}>
            <div className="ca1-text">
              <h1 className="ca1-heading">Creá tu cuenta</h1>
              <h3 className="ca1-subheading">Ingresa tus datos</h3>
            </div>
            <div className="ca1-inputs-grid">
              <div className="ca1-input-group">
                <input type="text" id="nombre" name="nombre" placeholder="Nombre" required />
              </div>
              <div className="ca1-input-group">
                <input type="text" id="apellido" name="apellido" placeholder="Apellido" required />
              </div>
              <div className="ca1-input-group">
                <input type="date" id="fecha_nacimiento" name="fecha_nacimiento" required />
              </div>
              <div className="ca1-input-group">
                <select name="genero" id="genero" required>
                  <option value="">Selecciona tu género</option>
                  <option value="1">Masculino</option>
                  <option value="2">Femenino</option>
                  <option value="3">Otro</option>
                </select>
              </div>
              <div className="ca1-input-group">
                <input type="text" id="altura" name="altura" placeholder="Altura en cm" required pattern="\d+" />
              </div>
              <div className="ca1-input-group">
                <input type="text" id="peso" name="peso" placeholder="Peso en kg" required pattern="\d+" />
              </div>
            </div>
            <button type="submit" className="ca1-btn-next">Siguiente</button>
          </form>
        </div>
      </section>
    );
  }
  