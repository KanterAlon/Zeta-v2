import React, { useState, useEffect } from 'react';
import BlogCard from '../components/BlogCard';
import BlogPopup from '../components/BlogPopup';

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [popupPost, setPopupPost] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // fetch('/api/blogposts') // <-- acá conectás con el backend
    //   .then(res => res.json())
    //   .then(data => setPosts(data));

    // TEMP: Posts simulados
    setPosts([
      {
        titulo_post: 'Alimentación intuitiva',
        contenido_post: 'Escuchá a tu cuerpo...',
        imagen_url: 'imgBlog1.jpg',
        fecha_creacion: '2024-04-01'
      },
      {
        titulo_post: 'Hábitos sostenibles',
        contenido_post: 'Cómo comer mejor...',
        imagen_url: 'imgBlog2.jpg',
        fecha_creacion: '2024-03-28'
      }
    ]);
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
      <section className="page">
        <div className="inner">
          <div className="evaluation-content">
            <h1>¿QUÉ QUERÉS APRENDER?</h1>
            <div className="search-bar">
              <button className="search-button">
                <img src="./assets/img/icon_search.svg" alt="Search Icon" width="20" height="20" />
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
          </div>
        </div>
      </section>

      {/* LISTADO DE ARTÍCULOS */}
      <section className="sec-nutrition-lifestyle" style={{ display: popupPost ? 'none' : 'block' }}>
        <div className="nutrition-lifestyle-inner">
          <h3>Nutrición y Estilo de Vida</h3>
          <p>
            Explorá temas clave relacionados con una alimentación equilibrada y las últimas tendencias en salud...
          </p>
          <div className="cards-row" id="cardsContainer">
            {posts.map((post, idx) => (
              <BlogCard key={idx} post={post} onClick={handleCardClick} />
            ))}
          </div>
        </div>
      </section>

      {/* POPUP DE ARTÍCULO */}
      {popupPost && <BlogPopup post={popupPost} onClose={handleClosePopup} />}
    </>
  );
};

export default BlogPage;
