import React, { useState, useEffect } from 'react';
import Loader from '../components/Loader';
import axios from 'axios';
import BlogCard from '../components/BlogCard';
import BlogPopup from '../components/BlogPopup';
import { FiSearch } from 'react-icons/fi';

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [popupPost, setPopupPost] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/blog`);
        setPosts(data);
      } catch (err) {
        console.error('Error al obtener posts del blog:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      const match = posts.find(post =>
        post.titulo_post.toLowerCase().includes(search.toLowerCase())
      );
      if (!match) alert('No se encontró ninguna tarjeta con ese nombre.');
    }
  };

  const handleCardClick = (post) => {
    setPopupPost(post);
  };

  const handleClosePopup = () => {
    setPopupPost(null);
  };

  return (
    <>
      {/* HERO CON BUSCADOR */}
      <section className="page" style={{ width: '90%' }}>
        <div className="inner">
          <div className="evaluation-content">
            <h1>¿QUÉ QUERÉS APRENDER HOY?</h1>
            <p>Descubrí herramientas prácticas, consejos útiles y perspectivas actuales para transformar tu relación con la comida.</p>
            <div className="search-bar">
              <button className="search-button search-icon-button" onClick={() => handleSearch({ key: 'Enter' })}>
                <FiSearch size={20} />
              </button>
              <input
                type="text"
                placeholder="Ej: Alimentación intuitiva"
                className="search-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearch}
              />
            </div>
            <div className="search-hint">Presioná Enter o la lupa para buscar</div>
          </div>
        </div>
      </section>

      {/* LISTADO DE ARTÍCULOS */}
      <section className="sec-nutrition-lifestyle" style={{ display: popupPost ? 'none' : 'block' }}>
        {loading ? (
          <div className="loader">
            <Loader />
          </div>
        ) : (
          <div className="nutrition-lifestyle-inner">
            <h3>Nutrición y Estilo de Vida</h3>
            <p>
              Explorá artículos cuidadosamente seleccionados sobre bienestar integral, alimentación consciente y hábitos saludables. Inspirate para hacer cambios positivos y sostenibles.
            </p>
            <div className="cards-row" id="cardsContainer">
              {posts.map((post, idx) => (
                <BlogCard key={idx} post={post} onClick={handleCardClick} />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* POPUP DE ARTÍCULO */}
      {popupPost && <BlogPopup post={popupPost} onClose={handleClosePopup} />}
    </>
  );
};

export default BlogPage;
