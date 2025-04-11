import axios from 'axios';


export default function Ca1Section({ goTo, updateForm }) {
  const handleNext = async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) return alert('Campos vacíos');

    try {
      const res = await axios.get('http://localhost:3000/api/ExisteMail', { withCredentials: true }, {
        params: { email }
      });

      if (res.data.existe) {
        document.getElementById('emailModal').style.display = 'block';
      } else {
        updateForm({ email, password });
        goTo('ca2');
      }
    } catch {
      alert('Error al verificar el correo');
    }
  };

  const closeModal = () => {
    document.getElementById('emailModal').style.display = 'none';
    document.getElementById('email').value = '';
  };


  return (
    <section id="ca1-section" className="ca1-container" style={{ display: 'flex' }}>
      <button className="back-button" onClick={() => goTo('login')} type="button">
        <img src="/img/icon_back.svg" alt="Back" />
      </button>
      <div className="ca1-content">
        <div className="ca1-text">
          <h1 className="ca1-heading">Creá tu cuenta</h1>
          <h3 className="ca1-subheading">Ingresá tu email y contraseña</h3>
        </div>
        <div className="ca1-inputs-grid">
          <div className="ca1-input-group">
            <input type="email" id="email" name="email" placeholder="Correo Electrónico" required />
          </div>
          <div className="ca1-input-group">
            <input type="password" id="password" name="password" placeholder="Contraseña" required minLength="6" />
          </div>
        </div>
        <button type="button" className="ca1-btn-next" onClick={handleNext}>Siguiente</button>
      </div>

      <div id="emailModal" className="modal" style={{ display: 'none' }}>
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title">¡Correo electrónico ya registrado!</h4>
          </div>
          <div className="modal-body">
            <p>Este correo ya está registrado en nuestra base de datos.</p>
          </div>
          <div className="modal-footer">
            <button onClick={() => goTo('login')} className="btn-modal cancel-btn">Volver al Login</button>
            <button onClick={closeModal} className="btn-modal continue-btn">Continuar con otro correo</button>
          </div>
        </div>
      </div>
    </section>
  );
}
