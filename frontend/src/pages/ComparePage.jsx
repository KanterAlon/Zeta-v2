import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';


const ComparePage = () => {
  const [params] = useSearchParams();
  const namesQuery = params.get('names') || '';

  const names = React.useMemo(
    () =>
      namesQuery
        .split(',')
        .map(n => decodeURIComponent(n))
        .filter(Boolean)
        .slice(0, 10),
    [namesQuery]
  );
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (names.length === 0) return;
    setLoading(true);
    // Determine base URL for API requests.
    // Use the VITE_API_URL environment variable if defined at build time;
    // otherwise fall back to the deployed backend URL. This fallback ensures
    // client-side builds still function when environment variables are not
    // available (e.g., misconfigured builds or previews).
    const apiBase = import.meta.env.VITE_API_URL || 'https://zeta-v2-backend.vercel.app';
    Promise.all(
      names.map(n =>
        fetch(`${apiBase}/api/product?query=${encodeURIComponent(n)}`)
          .then(res => res.json())
          .catch(() => null)
      )
    ).then(data => {
      setProducts(data.filter(Boolean).slice(0, 10));
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
    { key: 'nova_group', label: 'Grupo NOVA', path: ['nova_group'] }
  ];

  const getValue = (obj, path) =>
    path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);

  return (
    <div className="compare-page">
      <h1>Comparar Productos</h1>
      {products.length < 2 ? (
        <p>No se encontraron suficientes productos.</p>
      ) : (
        <div className="compare-table-wrapper">
          <table className="compare-table">
            <thead>
              <tr>
                <th />
                {products.map((p, i) => (
                  <th key={i}>
                    <div className="product-heading">
                      <img
                        src={p.image_url || '/img/lays-classic.svg'}
                        alt={p.product_name}
                      />
                      <span>{p.product_name}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FIELDS.map(field => (
                <tr key={field.key}>
                  <th className="feature-name">{field.label}</th>
                  {products.map((p, i) => {
                    let val = getValue(p, field.path);
                    if (field.transform && val != null) val = field.transform(val);
                    const hasData = val != null;
                    return (
                      <td key={i} className={hasData ? '' : 'no-data'}>
                        {hasData ? val : 'Sin datos'}
                      </td>
                    );
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
