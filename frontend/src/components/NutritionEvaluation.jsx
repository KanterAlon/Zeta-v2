import React from 'react';

const NutritionEvaluation = () => {
  return (
    <section className="sec-nutrition-evaluation">
      <div className="nutrition-evaluation-inner">
        <div className="product-info">
          <div className="img-rating">
            <img src="./img/lays-classic.svg" alt="Lays Clasicas" className="product-image" />
            <div className="rating">
              <div className="circle red"></div>
              <h3>Muy Malo</h3>
            </div>
          </div>
          <div className="nutrition-details">
            <div className="nutrition-detail">
              <img src="./img/icon_fat.svg" alt="Alto en grasas" />
              <span>Alto en Grasas</span>
            </div>
            <div className="nutrition-detail">
              <img src="./img/icon_calories.svg" alt="Alto en calorías" />
              <span>Alto en Calorías</span>
            </div>
            <div className="nutrition-detail">
              <img src="./img/icon_protein.svg" alt="Bajas proteínas" />
              <span>Bajas Proteínas</span>
            </div>
          </div>
        </div>
        <div className="nutritional-info">
          <h2>Conocé cual es la calidad nutricional de tus comidas y bebidas</h2>
          <p>
            ¿Sabés realmente lo que estás comprando? ¡Nosotros sí! Zeta escanea y analiza las etiquetas
            en un abrir y cerrar de ojos para que puedas saber de un vistazo qué productos son buenos para ti y cuáles debes evitar.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NutritionEvaluation;
