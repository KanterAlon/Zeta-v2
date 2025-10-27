import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Loader from '../components/Loader';
import {
  FaBolt,
  FaTint,
  FaBreadSlice,
  FaCube,
  FaDrumstickBite,
  FaListOl,
  FaTrashAlt,
  FaTimes,
} from 'react-icons/fa';
import { GiButter, GiWheat, GiSaltShaker } from 'react-icons/gi';
import { useCompare } from '../context/CompareContext';

const ComparePage = () => {
  const [params, setParams] = useSearchParams();
  const codesQuery = params.get('codes') || params.get('names') || '';

  const initialCodes = useMemo(
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
  const [selectedCodes, setSelectedCodes] = useState(initialCodes);
  const { removeItem, clearItems } = useCompare();

  useEffect(() => {
    setSelectedCodes(initialCodes);
  }, [initialCodes]);

  useEffect(() => {
    if (selectedCodes.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const apiBase = import.meta.env.VITE_API_URL || 'https://zeta-v2-backend.vercel.app';
    Promise.all(
      selectedCodes.map(code =>
        fetch(`${apiBase}/api/product?query=${encodeURIComponent(code)}`)
          .then(res => res.json())
          .then(data => (data ? { ...data, code } : null))
          .catch(() => null)
      )
    ).then(data => {
      setProducts(data.filter(Boolean).slice(0, 10));
      setLoading(false);
    });
  }, [selectedCodes]);

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

  const paramKey = params.get('codes') ? 'codes' : params.get('names') ? 'names' : 'codes';

  const updateQuery = (codesList) => {
    const newParams = new URLSearchParams(params);
    newParams.delete('codes');
    newParams.delete('names');
    if (codesList.length) {
      newParams.set(paramKey, codesList.join(','));
    }
    setParams(newParams);
  };

  const handleRemoveProduct = (code) => {
    setSelectedCodes(prev => {
      const updated = prev.filter(c => c !== code);
      updateQuery(updated);
      return updated;
    });
    removeItem(code);
  };

  const handleClearAll = () => {
    setSelectedCodes([]);
    setProducts([]);
    const clearedParams = new URLSearchParams(params);
    clearedParams.delete('codes');
    clearedParams.delete('names');
    setParams(clearedParams);
    clearItems();
  };

  return (
    <div className="compare-page">
      <div className="compare-page__header">
        <h1>Comparar Productos</h1>
        <button
          type="button"
          className="compare-page__clear"
          onClick={handleClearAll}
          disabled={!products.length}
        >
          <FaTrashAlt /> Limpiar comparación
        </button>
      </div>
      {products.length < 2 ? (
        <p>No se encontraron suficientes productos.</p>
      ) : (
        <div className="compare-table-wrapper">
          <table className="compare-table">
            <thead>
              <tr>
                <th />
                {products.map((p, i) => {
                  const productCode = p.code || selectedCodes[i];
                  return (
                    <th key={productCode || i}>
                      <div className="product-heading">
                        <img
                          src={p.image_url || '/img/lays-classic.svg'}
                          alt={p.product_name}
                        />
                        <span>{p.product_name}</span>
                        {productCode && (
                          <button
                            type="button"
                            className="product-heading__remove"
                            onClick={() => handleRemoveProduct(productCode)}
                            aria-label={`Quitar ${p.product_name}`}
                          >
                            <FaTimes />
                          </button>
                        )}
                      </div>
                    </th>
                  );
                })}
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
