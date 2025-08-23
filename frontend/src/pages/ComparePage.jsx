import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Loader from '../components/Loader';
import {
  FaBolt,
  FaTint,
  FaBreadSlice,
  FaCube,
  FaDrumstickBite,
  FaListOl,
} from 'react-icons/fa';
import { GiButter, GiWheat, GiSaltShaker } from 'react-icons/gi';

const ComparePage = () => {
  const [params] = useSearchParams();
  const codesQuery = params.get('codes') || params.get('names') || '';

  const codes = React.useMemo(
    () =>
      codesQuery
        .split(',')
        .map(c => decodeURIComponent(c))
        .filter(Boolean)
        .slice(0, 10),
    [codesQuery]
  );
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (codes.length === 0) return;
    setLoading(true);
    // Determine base URL for API requests.
    // Use the VITE_API_URL environment variable if defined at build time;
    // otherwise fall back to the deployed backend URL. This fallback ensures
    // client-side builds still function when environment variables are not
    // available (e.g., misconfigured builds or previews).
    const apiBase = import.meta.env.VITE_API_URL || 'https://zeta-v2-backend.vercel.app';
    Promise.all(
      codes.map(c =>
        fetch(`${apiBase}/api/product?query=${encodeURIComponent(c)}`)
          .then(res => res.json())
          .catch(() => null)
      )
    ).then(data => {
      setProducts(data.filter(Boolean).slice(0, 10));
      setLoading(false);
    });
  }, [codes]);

    if (loading) return <Loader />;

  const FIELDS = [
    {
      key: 'energy-kcal_100g',
      label: 'Energía (kcal)',
      path: ['nutriments', 'energy-kcal_100g'],
      icon: FaBolt,
    },
    {
      key: 'fat_100g',
      label: 'Grasas (g)',
      path: ['nutriments', 'fat_100g'],
      icon: FaTint,
    },
    {
      key: 'saturated-fat_100g',
      label: 'Grasas Saturadas (g)',
      path: ['nutriments', 'saturated-fat_100g'],
      icon: GiButter,
    },
    {
      key: 'carbohydrates_100g',
      label: 'Carbohidratos (g)',
      path: ['nutriments', 'carbohydrates_100g'],
      icon: FaBreadSlice,
    },
    {
      key: 'sugars_100g',
      label: 'Azúcares (g)',
      path: ['nutriments', 'sugars_100g'],
      icon: FaCube,
    },
    {
      key: 'fiber_100g',
      label: 'Fibra (g)',
      path: ['nutriments', 'fiber_100g'],
      icon: GiWheat,
    },
    {
      key: 'proteins_100g',
      label: 'Proteínas (g)',
      path: ['nutriments', 'proteins_100g'],
      icon: FaDrumstickBite,
    },
    {
      key: 'salt_100g',
      label: 'Sal (g)',
      path: ['nutriments', 'salt_100g'],
      icon: GiSaltShaker,
    },
    { key: 'nova_group', label: 'Grupo NOVA', path: ['nova_group'], icon: FaListOl },
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
                  <th className="feature-name">
                    {field.icon && <field.icon className="feature-icon" />}
                    {field.label}
                  </th>
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
