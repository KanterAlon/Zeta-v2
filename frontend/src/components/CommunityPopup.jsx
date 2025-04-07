import React from 'react';

const CommunityPopup = ({ isOpen, onClose, onPost, content, setContent }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-container">
      <div className="popup-content">
        <img src="./assets/img/icon_close.svg" className="close-btn" onClick={onClose} />
        <div className="top-pop-up-add-post">
          <textarea
            id="postInput"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="¿Qué quieres decir?"
            required
          />
          <button className="button-select-img">
            <img src="./assets/img/icon_img.svg" alt="Seleccionar imagen" />
          </button>
        </div>
        <button className="publish-btn" onClick={onPost}>Publicar</button>
      </div>
    </div>
  );
};

export default CommunityPopup;
