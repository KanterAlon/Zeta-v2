import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const mapScoreToRating = (score) => {
  if (typeof score !== 'number') return null;
  const min = -15;
  const max = 40;
  const clamped = Math.min(Math.max(score, min), max);
  const scaled = ((max - clamped) / (max - min)) * 9 + 1;
  return Math.round(scaled);
};

const getRatingColorClass = (rating) => {
  if (rating >= 8) return 'green';
  if (rating >= 6) return 'yellow';
  if (rating >= 4) return 'orange';
  return 'red';
};

const ComparePage = () => {
  const [params] = useSearchParams();
  const names = (params.get('names') || '')
    .split(',')
    .map(n => decodeURIComponent(n))
    .filter(Boolean);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (names.length === 0) return;
    setLoading(true);
    Promise.all(
      names.map(n =>
        fetch(`/api/product?query=${encodeURIComponent(n)}`)
          .then(res => res.json())
          .catch(() => null)
      )
    ).then(data => {
      setProducts(data.filter(Boolean));
      setLoading(false);
    });
  }, [names]);

  if (loading) return <p className="compare-loading">Cargando...</p>;

  const allKeys = Array.from(
    new Set(products.flatMap(p => Object.keys(p)))
  );

  return (
    <div className="compare-page">
      <h1>Comparar Productos</h1>
      {products.length < 2 ? (
        <p>No se encontraron suficientes productos.</p>
      ) : (
        <div className="compare-table">
          <div className="compare-header">
            {products.map((p, i) => {
              const rating = mapScoreToRating(p.nutriscore_score);
              const color = rating ? getRatingColorClass(rating) : null;
              return (
                <div key={i} className="compare-product">
                  <img
                    src={p.image_url || '/img/lays-classic.svg'}
                    alt={p.product_name}
                  />
                  <h3>{p.product_name}</h3>
                  {rating && (
                    <div
                      className={`rating-circle rating-${color}`}
                      title={`Calidad: ${rating}/10`}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <table>
            <tbody>
              {allKeys.map(key => (
                <tr key={key}>
                  <th>{key}</th>
                  {products.map((p, i) => (
                    <td key={i}>{
                      typeof p[key] === 'object'
                        ? JSON.stringify(p[key])
                        : p[key] ?? 'N/A'
                    }</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ComparePage;
