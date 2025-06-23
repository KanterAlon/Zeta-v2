import React from 'react';
import { FaTimes, FaImage } from 'react-icons/fa';

const CommunityPopup = ({ isOpen, onClose, onPost, content, setContent }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-container">
      <div className="popup-content">
        <button className="close-btn" onClick={onClose} aria-label="Cerrar">
          <FaTimes />
        </button>
        <div className="top-pop-up-add-post">
          <textarea
            id="postInput"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="¿Qué quieres decir?"
            required
          />
        <button className="button-select-img" aria-label="Seleccionar imagen">
          <FaImage />
        </button>
        </div>
        <button className="publish-btn" onClick={onPost}>Publicar</button>
      </div>
    </div>
  );
};

export default CommunityPopup;
