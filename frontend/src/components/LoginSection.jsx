import axios from 'axios';

export default function LoginSection({ goTo }) {
  const handleLogin = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const email = form.get('email');
    const password = form.get('password');
  
    try {
      const res = await axios.post(
        'http://localhost:3000/api/login',
        { email, password },
        { withCredentials: true }
      );
  
      // ✅ Opcional: mostrar notificación si querés
      // alert(`Bienvenido, ${res.data.usuario.nombre}`);
  
      // ✅ Redireccionar al home
      window.location.href = '/';
    } catch (err) {
      console.error('Error de login', err);
      alert('Credenciales inválidas');
    }
  };

  return (
    <section id="login-section" className="login-container">
      <div className="login-content">
        <button className="back-button" onClick={() => window.location.href = '/'}>
          <img src="/img/icon_back.svg" alt="Back" />
        </button>
        <div className="illustration">
          <img src="/img/img_login.svg" alt="Ilustración" />
        </div>
        <div className="welcome-message">
          <h1 className="welcome-heading">Te damos la bienvenida a la comunidad Zeta</h1>
          <form className="login-form" onSubmit={handleLogin}>
            <div className="inputs-group">
              <div className="input-group">
                {/* En desarrollo, usamos type="text" para evitar validación del formato de email */}
                {/* <input type="email" name="email" placeholder="Correo electrónico" required autoComplete="off" /> */}
                <input type="text" name="email" placeholder="Correo electrónico" required autoComplete="off" />
              </div>
              <div className="input-group">
                <input type="password" name="password" placeholder="Contraseña" required />
              </div>
              <div className="forgot-password">
                <a href="#"><span className="small-text">¿Has olvidado tu contraseña?</span></a>
              </div>
            </div>
            <div className="button-group">
              <button type="submit" className="btn-login">Iniciar sesión</button>
              <button type="button" className="btn-create-account" onClick={() => goTo('ca1')}>
                Crear cuenta
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
