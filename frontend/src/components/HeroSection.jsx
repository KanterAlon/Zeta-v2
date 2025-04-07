import React from 'react';

const HeroSection = () => {
  return (
    <section className="page">
      <div className="inner">
        <div className="evaluation-content">
          <h1>EVALUÁ TU PRODUCTO</h1>
          <h3>Acá encontrarás toda la información nutricional 100% simplificada</h3>
          <div className="search-bar">
            <form action="/home/product" method="get">
              <button type="submit" className="search-button">
                <img src="./assets/img/icon_search.svg" alt="Search Icon" width="20" height="20" />
              </button>
              <input
                type="text"
                id="search-input"
                name="query"
                placeholder="Ej: Fideos Matarazzo"
                className="search-input"
                autoComplete="off"
              />
            </form>
            <div id="autocomplete-results" className="autocomplete-results">
              <div id="loader" className="loader">
                <img src="./assets/img/loader.gif" alt="Cargando..." />
              </div>
              {/* Aquí va el resultado de la búsqueda */}
              {/* Ejemplo de conexión:
                  fetch(`/home/SearchProducts?query=${query}`)
              */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
