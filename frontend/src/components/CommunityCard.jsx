import React from 'react';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

const CommunityCard = ({ post, onLike, onDislike }) => {
  // Determinar si está likeado o dislikeado en base al valor 1
  const isLiked = parseInt(post.likes) === 1;
  const isDisliked = parseInt(post.dislikes) === 1;

  return (
    <div className="community-card">
      {post.imagen_url && (
        <img src={post.imagen_url} alt="Imagen del post" className="community-card-image" />
      )}
      <div className="bottom-community-card">
        <p className="community-card-text">{post.contenido}</p>
        <span className="community-time-posted">{post.fecha}</span>
        <div className="community-card-footer">
          <button className={`like-button ${isLiked ? 'active' : ''}`} onClick={() => onLike(post.id)}>
            <FaThumbsUp className="img-like" />
            <span className="like-count">{post.likes}</span>
          </button>
          <button className={`dislike-button ${isDisliked ? 'active' : ''}`} onClick={() => onDislike(post.id)}>
            <FaThumbsDown className="img-dislike" />
            <span className="dislike-count">{post.dislikes}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunityCard;