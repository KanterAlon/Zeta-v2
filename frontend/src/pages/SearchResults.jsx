// src/pages/SearchResults.jsx
import React, { useEffect, useState } from 'react';
import LazyImage from '../components/LazyImage';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AlertPopup from '../components/AlertPopup';
import { useCompare } from '../context/CompareContext';

const SearchResults = () => {
  const [params] = useSearchParams();
  const query = params.get('query') || '';
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [warning, setWarning] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const navigate = useNavigate();
  const { items: compareItems, toggleItem, removeItem, clearItems, maxItems } = useCompare();

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    // Determine base URL for API requests.
    // Use the VITE_API_URL environment variable if defined at build time;
    // otherwise fall back to the deployed backend URL. This fallback ensures
    // client-side builds still function when environment variables are not
    // available (e.g., misconfigured builds or previews).
    const apiBase = import.meta.env.VITE_API_URL || 'https://zeta-v2-backend.vercel.app';
    const start = performance.now();
    const isDev = import.meta.env.DEV || localStorage.getItem('devMode') === 'true';
    fetch(`${apiBase}/api/SearchProducts?query=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProducts(data.products);
          const elapsed = (performance.now() - start).toFixed(2);
          const source = data.source === 'cache' ? 'la cache' : 'OpenFoodFacts';
          if (isDev) {
            setAlertMessage(`Resultados obtenidos de ${source} en ${elapsed} ms`);
          }
        } else {
          setProducts([]);
        }
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [query]);

  const handleClick = (product) => {
    if (!product?.code) return;
    if (selectionMode) {
      const alreadySelected = compareItems.some(item => item.code === product.code);
      if (!alreadySelected && compareItems.length >= maxItems) {
        setWarning(`Solo puedes comparar hasta ${maxItems} productos`);
        setTimeout(() => setWarning(''), 2000);
        return;
      }
      toggleItem({ code: product.code, name: product.name, image: product.image });
    } else {
      navigate(`/producto?code=${encodeURIComponent(product.code)}`);
    }
  };

  const toggleSelection = () => {
    setSelectionMode(!selectionMode);
  };

  const handleCompare = () => {
    if (compareItems.length < 2) return;
    const codes = compareItems.map(item => encodeURIComponent(item.code)).join(',');
    navigate(`/compare?codes=${codes}`);
  };

  const handleRemoveSelected = (code) => {
    removeItem(code);
  };

  const handleClearSelected = () => {
    clearItems();
  };

  const selectedProducts = compareItems;

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
              <div className="text-skeleton" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="no-results">No se encontraron productos.</p>
      ) : (
        <div className="cards-container">
          {products.map((p) => {
            const isSelected = compareItems.some(item => item.code === p.code);
            return (
              <div
                key={p.code}
                className={`product-card${isSelected ? ' selected' : ''}`}
                onClick={() => handleClick(p)}
              >
                <LazyImage src={p.image} alt={p.name} className="card-image" />
                <h3 className="card-title">{p.name}</h3>
              </div>
            );
          })}
        </div>
      )}

      {(selectionMode || compareItems.length > 0) && (
        <>
          {warning && <div className="selection-warning">{warning}</div>}
          <div className="compare-bar">
            <div className="compare-bar__content">
              <div className="compare-bar__list">
                {selectedProducts.length === 0 ? (
                  <span className="compare-bar__empty">No hay productos seleccionados.</span>
                ) : (
                  selectedProducts.map(item => (
                    <div key={item.code} className="compare-bar__item">
                      {item.image ? (
                        <img src={item.image} alt={item.name} />
                      ) : (
                        <span className="compare-bar__placeholder" />
                      )}
                      <span className="compare-bar__name">{item.name}</span>
                      <button
                        type="button"
                        className="compare-bar__remove"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveSelected(item.code);
                        }}
                        aria-label={`Quitar ${item.name}`}
                      >
                        ×
                      </button>
                    </div>
                  ))
                )}
              </div>
              <div className="compare-bar__actions">
                <button
                  type="button"
                  className="compare-bar__clear"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClearSelected();
                  }}
                  disabled={selectedProducts.length === 0}
                >
                  Borrar todos
                </button>
                <button
                  className="compare-button"
                  disabled={selectedProducts.length < 2}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCompare();
                  }}
                >
                  Comparar ({selectedProducts.length})
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      {alertMessage && (
        <AlertPopup message={alertMessage} onClose={() => setAlertMessage('')} />
      )}
    </div>
  );
};
export default SearchResults;

