import React, { useEffect, useState } from 'react';
import Loader from './Loader';

const CommunityPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     setLoading(true);
     fetch("/api/posts/last3")  // ← Ejemplo de conexión
      .then(res => res.json())
       .then(data => setPosts(data))
       .finally(() => setLoading(false));
  }, []);

  return (
    <section className="sec-advertisements-blog">
      <div className="advertisements-blog-inner">
        <h2>Últimos Posts de nuestra comunidad</h2>
        <div className="cards-container">
          {loading ? (
            <Loader />
          ) : (
            posts.map((post, i) => (
              <div className="card-advertisement-blog" key={i}>
                <div className="arriba-card-blog">
                  <p className="fecha-card-blog">{/* post.fecha_creacion */}</p>
                  <h3 className="titulo-card-blog">{post.titulo_post}</h3>
                  <p className="descripcion-card-blog">{post.contenido_post}</p>
                </div>
                <div className="contenedor-imagen-card-blog">
                  <img
                    src={post.imagen_url.startsWith('http') ? post.imagen_url : `/img/${post.imagen_url}`}
                    alt="Imagen del post"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default CommunityPosts;
