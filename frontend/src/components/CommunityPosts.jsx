import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CommunityPosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/api/obtenerTresPostsRecientes', { withCredentials: true });
        if (response.data.success) {
          const mappedPosts = response.data.posts.map(post => ({
            id: post.id_post,
            contenido: post.contenido_post,
            fecha: new Date(post.fecha_creacion).toLocaleString('es-AR'),
            imagen_url: post.imagen_url,
            autor: post.autor,
            likes: post.likes,
            dislikes: post.dislikes
          }));
          setPosts(mappedPosts);
        }
      } catch (error) {
        console.error('Error al obtener posts:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <section className="sec-advertisements-blog">
      <div className="advertisements-blog-inner">
        <h2>Últimos Posts de nuestra comunidad</h2>
        <div className="cards-container">
          {posts.map((post, i) => (
            <div className="card-advertisement-blog" key={i}>
              <div className="arriba-card-blog">
                <p className="fecha-card-blog">{post.fecha}</p>
                <h3 className="titulo-card-blog">{post.autor}</h3>
                <p className="descripcion-card-blog">{post.contenido}</p>
              </div>
              {post.imagen_url && (
                <div className="contenedor-imagen-card-blog">
                  <img src={`./img/${post.imagen_url}`} alt="Imagen del post" />
                </div>
              )}
              <div className="interacciones-blog">
                <span>👍 {post.likes}</span> <span>👎 {post.dislikes}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommunityPosts;
