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
  const cachedAuth = typeof window !== 'undefined' ? sessionStorage.getItem('auth') : null;
  const [auth, setAuth] = useState(
    cachedAuth ? JSON.parse(cachedAuth) : { authenticated: false, user: null }
  );
  const [loading, setLoading] = useState(!cachedAuth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoaded) return;
    const syncSession = async () => {
      try {
        let token;
        if (isSignedIn) {
          token = await getToken({ template: 'integration_fallback' });
          if (token) {
            await axios.post(
              `${import.meta.env.VITE_API_URL}/api/clerk/sync`,
              {},
              { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
            );
          }
        }
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            withCredentials: true,
          }
        );
        setAuth(res.data);
        sessionStorage.setItem('auth', JSON.stringify(res.data));
      } catch {
        setAuth({ authenticated: false });
        sessionStorage.removeItem('auth');
      } finally {
        setLoading(false);
      }
    };

    syncSession();
  }, [isLoaded, isSignedIn, getToken]);

  useEffect(() => {
    const handleOutside = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    const handleResize = () => {
      if (window.innerWidth > 940) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    window.addEventListener('resize', handleResize);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if ((!isLoaded && !cachedAuth) || loading) return <Loader />;

  const handleLogout = async () => {
    await signOut();
    axios.post(`${import.meta.env.VITE_API_URL}/api/logout`, {}, { withCredentials: true })
      .then(() => {
        sessionStorage.removeItem('auth');
        setAuth({ authenticated: false, user: null });
        navigate('/');
      });
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleMenu = () => setMenuOpen(prev => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header>
      <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <img src="/img/Logo_Zeta_Header.svg" alt="Nut Logo" />
      </div>

      <button
        className={`hamburger-btn ${menuOpen ? 'active' : ''}`}
        aria-label="Menú"
        onClick={toggleMenu}
      >
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>

      <nav className={`nav-links ${menuOpen ? 'active' : ''}`}>
        <Link to="/" onClick={closeMenu}>
          <FaHome size={30} />
          <span>Inicio</span>
        </Link>
        <Link to="/community" onClick={closeMenu}>
          <FaUsers size={30} />
          <span>Comunidad</span>
        </Link>
        <Link to="/blog" onClick={closeMenu}>
          <FaRegNewspaper size={30} />
          <span>Blog</span>
        </Link>
        <Link to="/contact" onClick={closeMenu}>
          <FaEnvelopeOpenText size={30} />
          <span>Contacto</span>
        </Link>

        {!auth.authenticated ? (
          <Link to="/login" className="login-button" onClick={closeMenu}><span className="button-text">Login</span></Link>
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
                    closeMenu();
                  }}
                >
                  Mi perfil
                </button>
                <button type="button" className="dropdown-item" onClick={() => { handleLogout(); closeMenu(); }}>Cerrar sesión</button>
              </div>
            )}
          </div>
        )}
      </nav>
      <div className={`overlay ${menuOpen ? 'active' : ''}`} onClick={closeMenu}></div>
    </header>
  );
};

export default Header;
