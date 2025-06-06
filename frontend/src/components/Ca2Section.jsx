import axios from 'axios';

export default function Ca2Section({ goTo, updateForm, formData}) {
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(e.target);
    const form = {
      ...formData, // <- esto incluye email y password
      nombre: data.get('nombre'),
      apellido: data.get('apellido'),
      fecha_nacimiento: data.get('fecha_nacimiento')
      // Puedes descomentar y agregar más campos aquí si los necesitas
      // genero: data.get('genero'),
      // altura: data.get('altura'),
      // peso: data.get('peso')
    };

    updateForm(form);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/CreateAccount`,
        form,
        { withCredentials: true }
      );
      alert('Cuenta creada exitosamente');
      goTo('login');
    } catch (error) {
      console.error('Error al crear la cuenta:', error);
      alert('Ocurrió un error al crear la cuenta. Intenta nuevamente.');
    }
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
            {/* <div className="ca1-input-group">
              <select name="genero" id="genero" required>
                <option value="">Selecciona tu género</option>
                <option value="1">Masculino</option>
                <option value="2">Femenino</option>
              </select>
            </div>
            <div className="ca1-input-group">
              <input type="text" id="altura" name="altura" placeholder="Altura en cm" required pattern="\d+" />
            </div>
            <div className="ca1-input-group">
              <input type="text" id="peso" name="peso" placeholder="Peso en kg" required pattern="\d+" />
            </div> */}
          </div>
          <button type="submit" className="ca1-btn-next">Siguiente</button>
        </form>
      </div>
    </section>
  );
}
