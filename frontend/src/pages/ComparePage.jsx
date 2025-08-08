import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FiZap,
  FiDroplet,
  FiSlash,
  FiGrid,
  FiPieChart,
  FiFeather,
  FiShield,
  FiTarget,
  FiLayers
} from 'react-icons/fi';

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
  const namesQuery = params.get('names') || '';

  const names = React.useMemo(
    () =>
      namesQuery
        .split(',')
        .map(n => decodeURIComponent(n))
        .filter(Boolean)
        .slice(0, 3),
    [namesQuery]
  );
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
      setProducts(data.filter(Boolean).slice(0, 3));
      setLoading(false);
    });
  }, [names]);

  if (loading) return <p className="compare-loading">Cargando...</p>;

  const FIELDS = [
    { key: 'energy-kcal_100g', label: 'Energía (kcal)', icon: FiZap, path: ['nutriments', 'energy-kcal_100g'] },
    { key: 'fat_100g', label: 'Grasas (g)', icon: FiDroplet, path: ['nutriments', 'fat_100g'] },
    { key: 'saturated-fat_100g', label: 'Grasas Saturadas (g)', icon: FiSlash, path: ['nutriments', 'saturated-fat_100g'] },
    { key: 'carbohydrates_100g', label: 'Carbohidratos (g)', icon: FiGrid, path: ['nutriments', 'carbohydrates_100g'] },
    { key: 'sugars_100g', label: 'Azúcares (g)', icon: FiPieChart, path: ['nutriments', 'sugars_100g'] },
    { key: 'fiber_100g', label: 'Fibra (g)', icon: FiFeather, path: ['nutriments', 'fiber_100g'] },
    { key: 'proteins_100g', label: 'Proteínas (g)', icon: FiShield, path: ['nutriments', 'proteins_100g'] },
    { key: 'salt_100g', label: 'Sal (g)', icon: FiTarget, path: ['nutriments', 'salt_100g'] },
    { key: 'nova_group', label: 'Grupo NOVA', icon: FiLayers, path: ['nova_group'] }
  ];

  const getValue = (obj, path) =>
    path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);

  return (
    <div className="compare-page">
      <h1>Comparar Productos</h1>
      {products.length < 2 ? (
        <p>No se encontraron suficientes productos.</p>
      ) : (
        <div className="compare-grid">
          {products.map((p, i) => {
            const rating = mapScoreToRating(p.nutriscore_score);
            const color = rating ? getRatingColorClass(rating) : null;
            return (
              <div key={i} className="compare-column">
                <div className="product-header">
                  <div className="quality-wrapper">
                    <div
                      className={`quality-circle ${rating ? `filled rating-${color}` : 'empty'}`}
                      title={rating ? `Calidad: ${rating}/10` : 'Calidad: Sin datos'}
                    />
                    <span className="quality-text">
                      {rating ? `Calidad: ${rating}/10` : 'Calidad: Sin datos'}
                    </span>
                  </div>
                  <img
                    src={p.image_url || '/img/lays-classic.svg'}
                    alt={p.product_name}
                  />
                  <h3>{p.product_name}</h3>
                  <p className="product-price">{p.price ? `$${p.price}` : 'Sin precio'}</p>
                </div>
                <ul className="feature-list">
                  {FIELDS.map(field => {
                    let val = getValue(p, field.path);
                    if (field.transform && val != null) val = field.transform(val);
                    const Icon = field.icon;
                    const hasData = val != null;
                    return (
                      <li key={field.key} className="feature-item">
                        <Icon className="feature-icon" />
                        <div className="feature-text">
                          <span className="feature-label">{field.label}</span>
                          <span className={`feature-value${hasData ? '' : ' no-data'}`}>
                            {hasData ? val : 'Sin datos'}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ComparePage;
