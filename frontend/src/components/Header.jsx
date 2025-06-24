import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import Loader from './Loader';
import {
  FaHome,
  FaUsers,
  FaRegNewspaper,
  FaEnvelopeOpenText,
  FaUserCircle,
  FaChevronDown,
} from 'react-icons/fa';

const Header = () => {
  const { isLoaded, isSignedIn, getToken, signOut } = useAuth();
  const [auth, setAuth] = useState({ authenticated: false, user: null });
  const [loading, setLoading] = useState(true); // nuevo estado
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoaded) return;
    const syncSession = async () => {
      try {
        if (isSignedIn) {
          const token = await getToken();
          await axios.post(
            `${import.meta.env.VITE_API_URL}/api/clerk/sync`,
            {},
            { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
          );
        }
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth`, { withCredentials: true });
        setAuth(res.data);
      } catch {
        setAuth({ authenticated: false });
      } finally {
        setLoading(false);
      }
    };

    syncSession();


  
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

    const handleOutside = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);

    return () => {
      hamburgerBtn?.removeEventListener('click', toggleMenu);
      window.removeEventListener('resize', closeMenuOnResize);
      document.removeEventListener('mousedown', handleOutside);
    };
  }, [isLoaded, isSignedIn, getToken]);

  if (!isLoaded || loading) return <Loader />;

  const handleLogout = async () => {
    await signOut();
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
        <Link to="/">
          <FaHome size={30} />
          <span>Inicio</span>
        </Link>
        <Link to="/community">
          <FaUsers size={30} />
          <span>Comunidad</span>
        </Link>
        <Link to="/blog">
          <FaRegNewspaper size={30} />
          <span>Blog</span>
        </Link>
        <Link to="/contact">
          <FaEnvelopeOpenText size={30} />
          <span>Contacto</span>
        </Link>

        {!auth.authenticated ? (
          <Link to="/login" className="login-button"><span className="button-text">Login</span></Link>
        ) : (
          <div className="user-menu" ref={dropdownRef}>
            <button className="user-button" onClick={toggleDropdown} aria-expanded={dropdownOpen} aria-haspopup="true">
              <FaUserCircle size={24} />
              <span className="user-name">{auth.user?.nombre}</span>
              <FaChevronDown className="arrow" />
            </button>
            {dropdownOpen && (
              <div id="profile-dropdown" className="profile-dropdown">
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate('/profile');
                  }}
                >
                  Mi perfil
                </button>
                <button type="button" className="dropdown-item" onClick={handleLogout}>Cerrar sesión</button>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
