import React from 'react';
import type { Propellant, FilterState } from '../types/propellant';

interface CatalogPageProps {
  propellants: Propellant[];
  filteredPropellants: Propellant[];
  filter: FilterState;
  onFilterChange: (newFilter: FilterState) => void;
  onSelectPropellant: (propellant: Propellant) => void;
  isLoading: boolean;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({
  filteredPropellants,
  filter,
  onFilterChange,
  onSelectPropellant,
  isLoading,
}) => {
  return (
    <div className="page-content-scrollable">
      <div className="screen-header-block">
        <h1 className="screen-title">Рабочие тела ЯРД</h1>
        <p className="screen-subtitle">Реестр компонентов</p>
      </div>

      <div className="catalog-filter-bar">
        <form className="filter-form-slider" onSubmit={(e) => e.preventDefault()}>
          <div className="slider-meta-row">
            <span className="slider-range-label">Диапазон: 1.00–64.00</span>
            <span className="slider-current-value" id="sliderValDisplay">
              {filter.maxMolarMass.toFixed(2)}
            </span>
          </div>
          <div className="slider-input-container">
            <input
              type="range"
              min="1.00"
              max="64.00"
              step="0.01"
              name="max_molar_mass"
              value={filter.maxMolarMass}
              onChange={(e) =>
                onFilterChange({
                  maxMolarMass: parseFloat(e.target.value) || 64.0,
                })
              }
              className="filter-range-slider"
              id="molarMassSlider"
            />
          </div>
          <button type="submit" className="btn-filter-submit-block">
            Фильтр
          </button>
        </form>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
          Загрузка каталога...
        </div>
      ) : filteredPropellants.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
          Компоненты по заданному критерию не найдены
        </div>
      ) : (
        <div className="catalog-cards-grid">
          {filteredPropellants.map((propellant) => (
            <div key={propellant.id} className="propellant-card-wrapper">
              <div
                className="propellant-grid-card"
                onClick={() => onSelectPropellant(propellant)}
                style={{ cursor: 'pointer' }}
                title="Нажмите для перехода в ленту"
              >
                <div className="card-image-box">
                  <img
                    src={
                      propellant.imageUrl && propellant.imageUrl.trim() !== ''
                        ? propellant.imageUrl
                        : '/img/default_propellant.jpg'
                    }
                    alt={propellant.name}
                    className="propellant-card-img"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/img/default_propellant.jpg';
                    }}
                  />
                </div>
                <div className="card-meta-content">
                  <div className="card-propellant-title">{propellant.name}</div>
                  <div className="card-bottom-row">
                    <span className="card-molar-mass">M: {propellant.molarMass}</span>
                    <span className="card-gamma">&gamma;: {propellant.specificHeatRatio}</span>
                    <span className="card-likes-count">
                      <span className="card-heart-icon">&hearts;</span> {propellant.likesCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
