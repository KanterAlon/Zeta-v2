import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { FaTimes } from 'react-icons/fa';
import Loader from './Loader';

const CameraModal = ({ isOpen, onClose, onCapture }) => {
  const webcamRef = useRef(null);
  const [capturing, setCapturing] = useState(false);

  if (!isOpen) return null;

  const capture = async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturing(true);
        const res = await fetch(imageSrc);
        const blob = await res.blob();
        await onCapture(blob);
        setCapturing(false);
      }
    }
  };

  const handleContainerClick = (e) => {
    if (e.target.classList.contains('popup-container')) onClose();
  };

  return (
    <div className="popup-container" onClick={handleContainerClick}>
      <div className="popup-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label="Cerrar">
          <FaTimes />
        </button>
        <div className="camera-wrapper">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: 'environment' }}
          />
        </div>
        <button className="capture-btn" onClick={capture}>Tomar foto</button>
        {capturing && (
          <div className="capture-loader">
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraModal;
