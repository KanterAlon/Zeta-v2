// src/components/HeroSection.jsx
import React, { useState, useRef } from 'react';
import CameraModal from './CameraModal';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiCamera } from 'react-icons/fi';

const HeroSection = () => {
  const [query, setQuery] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleCameraClick = () => {
    if (isMobile && fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      setShowCamera(true);
    }
  };

  const handleCapture = async (source) => {
    let file = null;
    if (source && source.target) {
      file = source.target.files[0];
    } else if (source instanceof Blob) {
      file = source;
    }
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file, 'capture.jpg');
    try {
      const res = await fetch('http://localhost:3000/api/camera/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      const term = data.ai?.response?.trim();
      if (term) {
        navigate(`/search?query=${encodeURIComponent(term)}`);
      }
    } catch (err) {
      console.error('Camera search error', err);
    } finally {
      setShowCamera(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="page">
      <div className="inner">
        <div className="evaluation-content">
          <h1>EVALUÁ TU PRODUCTO</h1>
          <h3>Acá encontrarás toda la información nutricional 100% simplificada</h3>

          <div className="search-bar">
            <div className="search-wrapper">
              <button
                className="search-button search-icon-button"
                onClick={handleSearch}
              >
                <FiSearch size={20} />
              </button>
              <input
                type="text"
                className="search-input"
                placeholder="Ej: Fideos Matarazzo"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
              />
              <button
                type="button"
                className="search-button camera-icon-button"
                onClick={handleCameraClick}
              >
                <FiCamera size={20} />
              </button>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleCapture}
              />
              <CameraModal
                isOpen={showCamera}
                onClose={() => setShowCamera(false)}
                onCapture={handleCapture}
              />
            </div>
          </div>
          <div className="search-hint">Presioná Enter o la lupa para buscar</div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;