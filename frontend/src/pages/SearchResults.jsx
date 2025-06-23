// src/pages/SearchResults.jsx
import React, { useEffect, useState } from 'react';
import LazyImage from '../components/LazyImage';
import { useSearchParams, useNavigate } from 'react-router-dom';

const SearchResults = () => {
  const [params] = useSearchParams();
  const query = params.get('query') || '';
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
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
    navigate(`/producto?query=${encodeURIComponent(name)}`);
  };

  const skeletons = Array.from({ length: 6 });

  return (
    <div className="search-results-page">
      <header className="results-header">
        <h2>Resultados para &quot;{query}&quot;</h2>
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
          {products.map((p, i) => (
            <div
              key={i}
              className="product-card"
              onClick={() => handleClick(p.name)}
            >
              <LazyImage src={p.image} alt={p.name} className="card-image" />
              <h3 className="card-title">{p.name}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default SearchResults;

