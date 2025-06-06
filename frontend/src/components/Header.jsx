import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Header = () => {
  const [auth, setAuth] = useState({ authenticated: false, user: null });
  const [loading, setLoading] = useState(true); // nuevo estado
  const navigate = useNavigate();
  
  useEffect(() => {
    // Verificar sesión activa en backend
    axios.get(`${import.meta.env.VITE_API_URL}/api/auth`, { withCredentials: true })
    .then(res => {
      setAuth(res.data);
    })
    .catch(() => setAuth({ authenticated: false }))
    .finally(() => setLoading(false)); // marcar como terminado


  
    // Config hamburguesa
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const navLinks = document.querySelector('.nav-links');

    const toggleMenu = () => {
      hamburgerBtn.classList.toggle('active');
      navLinks.classList.toggle('active');
    };

    const closeMenuOnResize = () => {
      if (window.innerWidth > 940) {
        hamburgerBtn.classList.remove('active');
        navLinks.classList.remove('active');
      }
    };

    const closeMenuOnClick = () => {
      if (window.innerWidth <= 940) {
        hamburgerBtn.classList.remove('active');
        navLinks.classList.remove('active');
      }
    };

    hamburgerBtn?.addEventListener('click', toggleMenu);
    window.addEventListener('resize', closeMenuOnResize);
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', closeMenuOnClick);
    });

    return () => {
      hamburgerBtn?.removeEventListener('click', toggleMenu);
      window.removeEventListener('resize', closeMenuOnResize);
    };
  }, []);

  if (loading) return null; 

  const handleLogout = () => {
    axios.post(`${import.meta.env.VITE_API_URL}/api/logout`, {}, { withCredentials: true })
      .then(() => {
        setAuth({ authenticated: false, user: null });
        navigate('/');
      });
  };

  const toggleDropdown = () => {
    const dropdown = document.getElementById('profile-dropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
  };

  return (
    <header>
      <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <img src="/img/Logo_Zeta_Header.svg" alt="ZETA Logo" />
      </div>

      <button className="hamburger-btn" aria-label="Menú">
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>

      <nav className="nav-links">
        <Link to="/"><img src="/img/icon_home.svg" alt="Inicio" width="30" height="30" /><span>Inicio</span></Link>
        <Link to="/community"><img src="/img/icon_community.svg" alt="Comunidad" width="30" height="30" /><span>Comunidad</span></Link>
        <Link to="/blog"><img src="/img/icon_blog.svg" alt="Blog" width="30" height="30" /><span>Blog</span></Link>
        <Link to="/contact"><img src="/img/icon_contact.svg" alt="Contacto" width="30" height="30" /><span>Contacto</span></Link>

        {!auth.authenticated ? (
          <Link to="/login" className="login-button"><span className="button-text">Login</span></Link>
        ) : (
          <div className="icon-group">
            <a href="#"><img src="/img/icon_notif.svg" alt="Notif" className="icon-img" /></a>
            <a href="#"><img src="/img/icon_save.svg" alt="Save" className="icon-img" /></a>
            <a href="#" id="icon_profile" onClick={toggleDropdown}>
              <img src="/img/icon_profile.svg" alt="Profile" className="icon-img" />
            </a>
            <div id="profile-dropdown" className="profile-dropdown">
              <Link to="/profile">Mi perfil</Link>
              <Link to="/settings">Configuración</Link>
              <a href="#" onClick={handleLogout}>Cerrar sesión</a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
