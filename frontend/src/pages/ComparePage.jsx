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
  const namesQuery = params.get('names') || '';

  const names = React.useMemo(
    () =>
      namesQuery
        .split(',')
        .map(n => decodeURIComponent(n))
        .filter(Boolean),
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
      setProducts(data.filter(Boolean));
      setLoading(false);
    });
  }, [names]);

  if (loading) return <p className="compare-loading">Cargando...</p>;

  const FIELDS = [
    { key: 'energy-kcal_100g', label: 'Energía (kcal)', path: ['nutriments', 'energy-kcal_100g'] },
    { key: 'fat_100g', label: 'Grasas (g)', path: ['nutriments', 'fat_100g'] },
    { key: 'saturated-fat_100g', label: 'Grasas Saturadas (g)', path: ['nutriments', 'saturated-fat_100g'] },
    { key: 'carbohydrates_100g', label: 'Carbohidratos (g)', path: ['nutriments', 'carbohydrates_100g'] },
    { key: 'sugars_100g', label: 'Azúcares (g)', path: ['nutriments', 'sugars_100g'] },
    { key: 'fiber_100g', label: 'Fibra (g)', path: ['nutriments', 'fiber_100g'] },
    { key: 'proteins_100g', label: 'Proteínas (g)', path: ['nutriments', 'proteins_100g'] },
    { key: 'salt_100g', label: 'Sal (g)', path: ['nutriments', 'salt_100g'] },
    { key: 'nova_group', label: 'Grupo NOVA', path: ['nova_group'] },
    { key: 'nutriscore_score', label: 'Calidad (1-10)', path: ['nutriscore_score'], transform: mapScoreToRating }
  ];

  const getValue = (obj, path) =>
    path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);

  const availableFields = FIELDS.filter(field =>
    products.some(p => getValue(p, field.path) !== undefined && getValue(p, field.path) !== null)
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
              {availableFields.map(field => (
                <tr key={field.key}>
                  <th>{field.label}</th>
                  {products.map((p, i) => {
                    let val = getValue(p, field.path);
                    if (field.transform && val != null) val = field.transform(val);
                    return <td key={i}>{val != null ? val : 'Sin datos'}</td>;
                  })}
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
