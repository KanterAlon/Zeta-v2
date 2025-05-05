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
        contenido_post:
          'Escuchá a tu cuerpo y aprendé a reconocer las señales internas de hambre y saciedad. Esta práctica busca reconectar con tus necesidades reales, dejando de lado las dietas restrictivas.',
        imagen_url: 'imgBlog1.jpg',
        fecha_creacion: '2024-04-01'
      },
      {
        titulo_post: 'Hábitos sostenibles',
        contenido_post:
          'Cómo comer mejor sin complicarte la vida: pequeñas acciones diarias pueden generar grandes cambios en tu salud y en el planeta. Empezá por lo simple.',
        imagen_url: 'imgBlog1.jpg',
        fecha_creacion: '2024-03-28'
      },
      {
        titulo_post: 'Mindful eating: comer con atención',
        contenido_post:
          'Aprendé a disfrutar cada bocado, prestando atención al momento presente. Esta técnica mejora la relación con la comida y reduce los atracones.',
        imagen_url: 'imgBlog1.jpg',
        fecha_creacion: '2024-03-15'
      },
      {
        titulo_post: 'Organización semanal de comidas',
        contenido_post:
          'Planificar tus comidas no solo te ahorra tiempo, también mejora tu nutrición. Te mostramos cómo hacerlo de forma práctica y flexible.',
        imagen_url: 'imgBlog1.jpg',
        fecha_creacion: '2024-03-05'
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
      <section className="page" style={{ width: '90%' }}>
        <div className="inner">
          <div className="evaluation-content">
            <h1>¿QUÉ QUERÉS APRENDER HOY?</h1>
            <p>Descubrí herramientas prácticas, consejos útiles y perspectivas actuales para transformar tu relación con la comida.</p>
            <div className="search-bar">
              <button className="search-button">
                <img src="./img/icon_search.svg" alt="Search Icon" width="20" height="20" />
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
            Explorá artículos cuidadosamente seleccionados sobre bienestar integral, alimentación consciente y hábitos saludables. Inspirate para hacer cambios positivos y sostenibles.
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
