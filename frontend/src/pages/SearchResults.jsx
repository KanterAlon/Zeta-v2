// src/pages/SearchResults.jsx
import React, { useEffect, useState } from 'react';
import LazyImage from '../components/LazyImage';
import { useSearchParams, useNavigate } from 'react-router-dom';

const SearchResults = () => {
  const [params] = useSearchParams();
  const query = params.get('query') || '';
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    fetch(`/api/SearchProducts?query=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProducts(data.products);
        } else {
          setProducts([]);
        }
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [query]);

  const handleClick = (name) => {
    if (selectionMode) {
      setSelected(prev =>
        prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
      );
    } else {
      navigate(`/producto?query=${encodeURIComponent(name)}`);
    }
  };

  const toggleSelection = () => {
    if (selectionMode) setSelected([]);
    setSelectionMode(!selectionMode);
  };

  const handleCompare = () => {
    if (selected.length < 2) return;
    const names = selected.map(n => encodeURIComponent(n)).join(',');
    navigate(`/compare?names=${names}`);
  };

  const skeletons = Array.from({ length: 6 });

  return (
    <div className="search-results-page">
      <header className="results-header">
        <h2>Resultados para &quot;{query}&quot;</h2>
        <button className="selection-toggle" onClick={toggleSelection}>
          {selectionMode ? 'Cancelar' : 'Seleccionar'}
        </button>
      </header>

      {loading ? (
        <div className="cards-container">
          {skeletons.map((_, i) => (
            <div key={i} className="product-card">
              <div className="lazy-image-wrapper">
                <div className="image-skeleton" />
              </div>
              <h3 className="card-title">Cargando...</h3>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="no-results">No se encontraron productos.</p>
      ) : (
        <div className="cards-container">
          {products.map((p, i) => {
            const isSelected = selected.includes(p.name);
            return (
              <div
                key={i}
                className={`product-card${isSelected ? ' selected' : ''}`}
                onClick={() => handleClick(p.name)}
              >
                <LazyImage src={p.image} alt={p.name} className="card-image" />
                <h3 className="card-title">{p.name}</h3>
              </div>
            );
          })}
        </div>
      )}

      {selectionMode && (
        <div className="compare-bar">
          <button
            className="compare-button"
            disabled={selected.length < 2}
            onClick={handleCompare}
          >
            Comparar ({selected.length})
          </button>
        </div>
      )}
    </div>
  );
};
export default SearchResults;

