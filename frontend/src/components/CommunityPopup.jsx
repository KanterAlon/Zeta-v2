import React, { useRef } from 'react';
import { FaTimes, FaImage } from 'react-icons/fa';
const CommunityPopup = ({
  isOpen,
  onClose,
  onPost,
  content,
  setContent,
  previewUrl,
  setPreviewUrl,
  setSelectedImage
}) => {
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const triggerFile = () => {
    fileInputRef.current?.click();
  };

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
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <button
            className="button-select-img"
            aria-label="Seleccionar imagen"
            onClick={triggerFile}
          >
            <FaImage />
          </button>
        </div>
        {previewUrl && (
          <img src={previewUrl} className="post-image-preview" alt="previsualización" />
        )}
        <button className="publish-btn" onClick={onPost}>Publicar</button>
      </div>
    </div>
  );
};

export default CommunityPopup;
