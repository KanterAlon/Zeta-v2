import React from 'react';

const BlogPopup = ({ post, onClose }) => {
  if (!post) return null;

  return (
    <section className="pop-up-info-articulo" style={{ display: 'flex' }}>
      <div className="pop-up-info-articulo-inner">
        <img src={`./img/${post.imagen_url}`} alt="Post Image" />
        <h1>{post.titulo_post}</h1>
        <h3>Escrito por todo el equipo de Zeta</h3>
        <hr />
        <span>{post.fecha_creacion}</span>
        <p>{post.contenido_post}</p>
        <button className="btn-login" onClick={onClose} style={{ marginTop: '1rem' }}>Cerrar</button>
      </div>
    </section>
  );
};

export default BlogPopup;
