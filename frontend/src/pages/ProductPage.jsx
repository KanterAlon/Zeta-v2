import React, { useEffect, useState } from 'react';
import Loader from '../components/Loader';
import { useSearchParams } from 'react-router-dom';
import { FaCheck, FaTimes, FaMinus } from 'react-icons/fa';

// Convert OpenFoodFacts nutriscore (-15 best to 40 worst) to a 1-10 scale
const mapScoreToRating = (score) => {
  if (typeof score !== 'number') return null;
  const min = -15;
  const max = 40;
  const clamped = Math.min(Math.max(score, min), max);
  const scaled = ((max - clamped) / (max - min)) * 9 + 1;
  return Math.round(scaled);
};

// Determine color class based on rating value
const getRatingColorClass = (rating) => {
  if (rating >= 8) return 'green';
  if (rating >= 6) return 'yellow';
  if (rating >= 4) return 'orange';
  return 'red';
};

const ProductPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');

  const [productData, setProductData] = useState(null);
  const [productName, setProductName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!query) return;

    // Determine base URL for API requests.
    // Use the VITE_API_URL environment variable if defined at build time;
    // otherwise fall back to the deployed backend URL. This fallback ensures
    // client-side builds still function when environment variables are not
    // available (e.g., misconfigured builds or previews).
    const apiBase = import.meta.env.VITE_API_URL || 'https://zeta-v2-backend.vercel.app';
    const start = performance.now();
    fetch(`${apiBase}/api/product?query=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setErrorMessage(data.error);
          setProductData(null);
        } else {
          const elapsed = (performance.now() - start).toFixed(2);
          alert(
            `Producto obtenido de ${
              data.source === 'cache' ? 'la cache' : 'OpenFoodFacts'
            } en ${elapsed} ms`
          );
          const { source: _SOURCE, elapsedTime: _ELAPSEDTIME, ...product } = data;
          setProductData(product);
          setProductName(product.product_name || 'Producto sin nombre');
          setErrorMessage('');
        }
      })
      .catch(() => {
        setErrorMessage('Error al cargar el producto');
      });
  }, [query]);

  const getLevel = (key) => productData?.nutrient_levels?.[key];

  const hasPositives = ['fat', 'saturated-fat', 'sugars', 'salt'].some(
    key => getLevel(key) === 'low'
  );
  const hasModerates = ['fat', 'saturated-fat', 'sugars', 'salt'].some(
    key => getLevel(key) === 'moderate'
  );
  const hasNegatives =
    ['sugars', 'saturated-fat', 'salt'].some(key => getLevel(key) === 'high') ||
    productData?.nova_group === '4';

  const ratingValue = mapScoreToRating(productData?.nutriscore_score);
  const ratingColor =
    ratingValue !== null && ratingValue !== undefined
      ? getRatingColorClass(ratingValue)
      : null;

  return (
    <div className="product-page">
      <h1 className="product-title">{productName}</h1>

      {errorMessage ? (
        <div className="error-message">
          <p>{errorMessage}</p>
        </div>
      ) : productData ? (
        <>
          <div className="product-section">
            <div className="product-inner">
              <div className="product-details-container">
                <div className="product-image-rating">
                  <div className="product-image-wrapper">
                    <img
                      src={productData.image_url || '/img/lays-classic.svg'}
                      alt={productName}
                      className="product-image-new"
                    />
                    {ratingValue != null && (
                      <div className="product-rating">
                        <span className={`rating-circle rating-${ratingColor}`} />
                        <h3>Calidad: {`${ratingValue}/10`}</h3>
                      </div>
                    )}
                  </div>
                </div>

                <div className="product-nutrition-info">
                  <div className="nutrition-info-item">
                    <img src="/img/icon_protein.svg" alt="Proteínas" className="nutrition-icon" />
                    <span>Proteínas: {productData.nutriments?.proteins_100g ?? 'No disponible'} g</span>
                  </div>
                  <div className="nutrition-info-item">
                    <img src="/img/icon_scales.svg" alt="Carbohidratos" className="nutrition-icon" />
                    <span>Carbohidratos: {productData.nutriments?.carbohydrates_100g ?? 'No disponible'} g</span>
                  </div>
                  <div className="nutrition-info-item">
                    <img src="/img/icon_fat.svg" alt="Grasas" className="nutrition-icon" />
                    <span>Grasas: {productData.nutriments?.fat_100g ?? 'No disponible'} g</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Evaluación Nutricional */}
          <div className="nutrition-evaluation">
            {hasPositives && (
              <>
                <h2>Positivas</h2>
                {getLevel('fat') === 'low' && (
                  <NutritionItem
                    type="positive"
                    icon="/img/icon_fat.svg"
                    title="Bajo en Grasas"
                    description="Ideal para una dieta equilibrada en grasas."
                    value={productData.nutriments?.fat_100g}
                  />
                )}
                {getLevel('saturated-fat') === 'low' && (
                  <NutritionItem
                    type="positive"
                    icon="/img/icon_fat.svg"
                    title="Bajo en Grasas Saturadas"
                    description="Ayuda a mantener niveles saludables de colesterol."
                    value={productData.nutriments?.["saturated-fat_100g"]}
                  />
                )}
                {getLevel('sugars') === 'low' && (
                  <NutritionItem
                    type="positive"
                    icon="/img/icon_sugar.svg"
                    title="Bajo en Azúcares"
                    description="Bueno para controlar el azúcar diario."
                    value={productData.nutriments?.sugars_100g}
                  />
                )}
                {getLevel('salt') === 'low' && (
                  <NutritionItem
                    type="positive"
                    icon="/img/icon_salt.svg"
                    title="Bajo en Sodio"
                    description="Ayuda a controlar la presión arterial."
                    value={productData.nutriments?.salt_100g}
                  />
                )}
              </>
            )}

            {hasModerates && (
              <>
                <h2>Moderados</h2>
                {getLevel('fat') === 'moderate' && (
                  <NutritionItem
                    type="moderate"
                    icon="/img/icon_fat.svg"
                    title="Grasas Moderadas"
                    description="Consumir con moderación."
                    value={productData.nutriments?.fat_100g}
                  />
                )}
                {/* Repetí saturadas, azúcar, etc si querés */}
              </>
            )}

            {hasNegatives && (
              <>
                <h2>Negativas</h2>
                {getLevel('sugars') === 'high' && (
                  <NutritionItem
                    type="negative"
                    icon="/img/icon_sugar.svg"
                    title="Alto en Azúcares"
                    description="Puede afectar la salud dental y aumentar calorías."
                    value={productData.nutriments?.sugars_100g}
                  />
                )}
                {productData.nova_group === '4' && (
                  <NutritionItem
                    type="negative"
                    icon="/img/icon_nova.svg"
                    title="Ultra Procesado"
                    description="Clasificado NOVA 4, muy procesado."
                  />
                )}
              </>
            )}
          </div>
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
};

const NutritionItem = ({ type, icon, title, description, value }) => (
  <div className={`nutrition-item ${type}`}>
    <img src={icon} className="nutrition-icon" alt={title} />
    <div className="nutrition-description">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
    {value !== undefined && <span>{value} g cada 100 g</span>}
    {type === 'negative' && <FaTimes className="close-icon" />}
    {type === 'moderate' && <FaMinus className="less-icon" />}
    {type === 'positive' && <FaCheck className="tick-icon" />}
  </div>
);

export default ProductPage;
