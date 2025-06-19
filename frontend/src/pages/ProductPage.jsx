import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const ProductPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');

  const [productData, setProductData] = useState(null);
  const [productName, setProductName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!query) return;

    fetch(`/api/product?query=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setErrorMessage(data.error);
          setProductData(null);
        } else {
          setProductData(data);
          setProductName(data.product_name || 'Producto sin nombre');
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
                    <div className="product-rating">
                      <span className="rating-circle rating-red" />
                      <h3>
                        Calidad:{' '}
                        {productData.nutrition_grades_tags?.[0]?.toUpperCase() || 'Sin calificación'}
                      </h3>
                    </div>
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
                    tick="/img/icon_tick.svg"
                  />
                )}
                {getLevel('saturated-fat') === 'low' && (
                  <NutritionItem
                    type="positive"
                    icon="/img/icon_fat.svg"
                    title="Bajo en Grasas Saturadas"
                    description="Ayuda a mantener niveles saludables de colesterol."
                    value={productData.nutriments?.["saturated-fat_100g"]}
                    tick="/img/icon_tick.svg"
                  />
                )}
                {getLevel('sugars') === 'low' && (
                  <NutritionItem
                    type="positive"
                    icon="/img/icon_sugar.svg"
                    title="Bajo en Azúcares"
                    description="Bueno para controlar el azúcar diario."
                    value={productData.nutriments?.sugars_100g}
                    tick="/img/icon_tick.svg"
                  />
                )}
                {getLevel('salt') === 'low' && (
                  <NutritionItem
                    type="positive"
                    icon="/img/icon_salt.svg"
                    title="Bajo en Sodio"
                    description="Ayuda a controlar la presión arterial."
                    value={productData.nutriments?.salt_100g}
                    tick="/img/icon_tick.svg"
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
                    tick="/img/icon_less.svg"
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
                    tick="/img/icon_close.svg"
                  />
                )}
                {productData.nova_group === '4' && (
                  <NutritionItem
                    type="negative"
                    icon="/img/icon_nova.svg"
                    title="Ultra Procesado"
                    description="Clasificado NOVA 4, muy procesado."
                    tick="/img/icon_close.svg"
                  />
                )}
              </>
            )}
          </div>
        </>
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  );
};

const NutritionItem = ({ type, icon, title, description, value, tick }) => (
  <div className={`nutrition-item ${type}`}>
    <img src={icon} className="nutrition-icon" alt={title} />
    <div className="nutrition-description">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
    {value !== undefined && <span>{value} g cada 100 g</span>}
    <img src={tick} className={type === 'negative' ? 'close-icon' : 'tick-icon'} />
  </div>
);

export default ProductPage;
