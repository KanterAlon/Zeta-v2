import React, { useRef } from 'react';
import Webcam from 'react-webcam';

const CameraModal = ({ isOpen, onClose, onCapture }) => {
  const webcamRef = useRef(null);

  if (!isOpen) return null;

  const capture = async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        const res = await fetch(imageSrc);
        const blob = await res.blob();
        onCapture(blob);
      }
    }
  };

  const handleContainerClick = (e) => {
    if (e.target.classList.contains('popup-container')) onClose();
  };

  return (
    <div className="popup-container" onClick={handleContainerClick}>
      <div className="popup-content" onClick={e => e.stopPropagation()}>
        <img src="./img/icon_close.svg" className="close-btn" onClick={onClose} alt="Cerrar" />
        <div className="camera-wrapper">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: 'environment' }}
          />
        </div>
        <button className="capture-btn" onClick={capture}>Tomar foto</button>
      </div>
    </div>
  );
};

export default CameraModal;
