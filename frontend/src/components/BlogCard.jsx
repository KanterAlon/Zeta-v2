import React from 'react';

const BlogCard = ({ post, onClick }) => {
  return (
    <div className="nutrition-card" onClick={() => onClick(post)}>
      <img src={`./img/${post.imagen_url}`} alt="Imagen del post" className="community-card-image" />
      <h3 className="community-card-text">{post.titulo_post}</h3>
    </div>
  );
};

export default BlogCard;
