import React from 'react';

const BlogPopup = ({ post, onClose }) => {
  if (!post) return null;

  const handleContainerClick = (e) => {
    if (e.target.classList.contains('pop-up-info-articulo')) onClose();
  };

  return (
    <div className="pop-up-info-articulo" onClick={handleContainerClick}>
      <div className="pop-up-info-articulo-inner" onClick={(e) => e.stopPropagation()}>
        <img src="./img/icon_close.svg" className="close-btn" onClick={onClose} alt="Cerrar" />
        <img src={`./img/${post.imagen_url}`} alt="Imagen del post" />
        <h1>{post.titulo_post}</h1>
        <h3>Escrito por todo el equipo de Zeta</h3>
        <hr />
        <span>{post.fecha_creacion}</span>
        <p>{post.contenido_post}</p>
      </div>
    </div>
  );
};

export default BlogPopup;
