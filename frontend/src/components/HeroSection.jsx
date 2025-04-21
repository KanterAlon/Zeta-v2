// src/components/HeroSection.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query.trim())}`);
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
              <input
                type="text"
                className="search-input"
                placeholder="Ej: Fideos Matarazzo"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;