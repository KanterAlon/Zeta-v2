import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const timeoutIdRef = useRef(null);
  const navigate = useNavigate();

  // Input con debounce
  const handleInput = (e) => {
    const value = e.target.value;
    setQuery(value);
    setShowResults(!!value);
    clearTimeout(timeoutIdRef.current);

    if (value.trim() === '') {
      setResults([]);
      return;
    }

    setLoading(true);

    timeoutIdRef.current = setTimeout(() => {
      fetch(`/api/home/SearchProducts?query=${encodeURIComponent(value)}`)
        .then((res) => res.json())
        .then((data) => {
          setLoading(false);
          if (data.success && data.products.length > 0) {
            setResults(data.products);
          } else {
            setResults([{ name: 'No se encontraron resultados.', image: null }]);
          }
        })
        .catch(() => {
          setLoading(false);
          setResults([{ name: 'Error al cargar resultados.', image: null }]);
        });
    }, 500);
  };

  const handleSelect = (name) => {
    navigate(`/producto?query=${encodeURIComponent(name)}`);
  };

  return (
    <section className="page">
      <div className="inner">
        <div className="evaluation-content">
          <h1>EVALUÁ TU PRODUCTO</h1>
          <h3>Acá encontrarás toda la información nutricional 100% simplificada</h3>

          <div className="search-bar">
            <div className="search-wrapper">
              <button className="search-button" onClick={() => handleSelect(query)}>
                <img src="/img/icon_search.svg" alt="Buscar" width="20" height="20" />
              </button>
              <input
                type="text"
                className="search-input"
                placeholder="Ej: Fideos Matarazzo"
                value={query}
                onChange={handleInput}
                onFocus={() => query && setShowResults(true)}
              />
            </div>

            {showResults && (
              <div className="autocomplete-results">
                {loading && (
                  <div className="loader">
                    <img src="/img/loader.gif" alt="Cargando..." />
                  </div>
                )}

                {!loading &&
                  results.map((product, index) => (
                    <div
                      key={index}
                      className="autocomplete-item"
                      onClick={() => product.image && handleSelect(product.name)}
                      style={{
                        cursor: product.image ? 'pointer' : 'default',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '6px',
                        borderBottom: '1px solid #eee',
                      }}
                    >
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{ width: 30, height: 30, marginRight: 10 }}
                        />
                      )}
                      <span>{product.name}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
