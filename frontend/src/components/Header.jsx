import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Header = () => {
  const [auth, setAuth] = useState({ authenticated: false, user: null });
  const [loading, setLoading] = useState(true); // nuevo estado
  const [dropdownOpen, setDropdownOpen] = useState(false);
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

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

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
          <div className="user-menu">
            <button className="user-button" onClick={toggleDropdown}>
              <img src="/img/icon_profile.svg" alt="Cuenta" />
              <span className="user-name">{auth.user?.nombre}</span>
              <img src="/img/icon_arrow-down.svg" alt="Abrir" className="arrow" />
            </button>
            {dropdownOpen && (
              <div id="profile-dropdown" className="profile-dropdown">
                <a href="#" onClick={handleLogout}>Cerrar sesión</a>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
