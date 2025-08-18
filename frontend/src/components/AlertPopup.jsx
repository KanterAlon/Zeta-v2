import React from 'react';
import ReactDOM from 'react-dom';

const AlertPopup = ({ message, onClose }) => {
  const popup = (
    <div className="alert-popup-container" onClick={onClose}>
      <div className="alert-popup-content" onClick={e => e.stopPropagation()}>
        <p>{message}</p>
        <button className="alert-popup-close" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
  return ReactDOM.createPortal(popup, document.body);
};

export default AlertPopup;
