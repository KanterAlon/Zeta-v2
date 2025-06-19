// src/components/HeroSection.jsx
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleCapture = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await fetch('http://localhost:5000/upload', {
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
                className="search-button"
                onClick={handleSearch}
              >
                <img src="/img/icon_search.svg" alt="Buscar" width="20" height="20" />
              </button>
              <button
                type="button"
                className="search-button"
                onClick={handleCameraClick}
              >
                <img src="/img/icon_camera.svg" alt="Cámara" width="20" height="20" />
              </button>
              <input
                type="text"
                className="search-input"
                placeholder="Ej: Fideos Matarazzo"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
              />
              <input
                type="file"
                accept="image/*"
                capture="environment"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleCapture}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;