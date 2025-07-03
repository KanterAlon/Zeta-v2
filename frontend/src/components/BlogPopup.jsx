import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { FaTimes } from 'react-icons/fa';

const BlogPopup = ({ post, onClose }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!post) return null;

  const handleContainerClick = (e) => {
    if (e.target.classList.contains('blog-popup-container')) onClose();
  };

  const popup = (
    <div
      className="blog-popup-container"
      role="dialog"
      aria-modal="true"
      onClick={handleContainerClick}
    >
      <div className="blog-popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn-popup" onClick={onClose} aria-label="Cerrar">
          <FaTimes />
        </button>
        <img
          src={`./img/${post.imagen_url}`}
          alt=""
          className="blog-popup-image"
        />
        <h1 id="blog-popup-title">{post.titulo_post}</h1>
        <h3>Escrito por todo el equipo de Nut</h3>
        <hr />
        <span>{post.fecha_creacion}</span>
        <p>{post.contenido_post}</p>
      </div>
    </div>
  );

  return ReactDOM.createPortal(popup, document.body);
};

export default BlogPopup;
