import React from 'react';
import type { PropellantResponseDto } from '../api/generated/PropellantApi';
import type { FilterState } from '../store/slices/filterSlice';
import { resolveMediaUrl } from '../api/apiClient';

interface CatalogPageProps {
  propellants: PropellantResponseDto[];
  filter: FilterState;
  onFilterChange: (newFilter: { maxMolarMass: number; searchQuery: string }) => void;
  onApplyFilter: () => void;
  onResetFilter: () => void;
  onSelectPropellant: (propellant: PropellantResponseDto) => void;
  onDeletePropellant?: (id: number) => void;
  isLoading: boolean;
  isMockMode?: boolean;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({
  propellants,
  filter,
  onFilterChange,
  onApplyFilter,
  onResetFilter,
  onSelectPropellant,
  onDeletePropellant,
  isLoading,
  isMockMode = false,
}) => {
  const defaultImage = '/img/default_propellant.jpg';

  const handleDelete = (id: number, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Вы действительно хотите удалить рабочее тело "${name}"?`)) {
      if (onDeletePropellant) {
        onDeletePropellant(id);
      }
    }
  };

  return (
    <div className="page-content-scrollable">
      <div className="screen-header-block">
        <h1 className="screen-title">Рабочие тела ЯРД</h1>
        <p className="screen-subtitle">Каталог и характеристики компонентов</p>
      </div>

      {isMockMode && (
        <div
          style={{
            margin: '0 16px 12px 16px',
            padding: '8px 12px',
            borderRadius: '8px',
            background: 'rgba(54, 69, 150, 0.25)',
            border: '1px solid rgba(0, 210, 255, 0.35)',
            color: '#00d2ff',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>&#9888;</span>
          <span>Отображаются mock-данные</span>
        </div>
      )}

      {/* Filter Bar (Redux-controlled) */}
      <div className="catalog-filter-bar">
        <form
          className="filter-form-slider"
          onSubmit={(e) => {
            e.preventDefault();
            onApplyFilter();
          }}
        >
          {/* Search Input */}
          <div style={{ marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="Поиск по наименованию..."
              value={filter.searchQuery}
              onChange={(e) =>
                onFilterChange({
                  ...filter,
                  searchQuery: e.target.value,
                })
              }
              style={{
                width: '100%',
                padding: '6px 12px',
                borderRadius: '6px',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                fontSize: '0.85rem',
              }}
            />
          </div>

          <div className="slider-meta-row">
            <span className="slider-range-label">Макс. молярная масса:</span>
            <span className="slider-current-value" id="sliderValDisplay">
              {Number(filter.maxMolarMass).toFixed(1)} г/моль
            </span>
          </div>

          <div className="slider-input-container">
            <input
              type="range"
              min="1.00"
              max="150.00"
              step="0.5"
              name="max_molar_mass"
              value={filter.maxMolarMass}
              onChange={(e) =>
                onFilterChange({
                  ...filter,
                  maxMolarMass: parseFloat(e.target.value) || 64.0,
                })
              }
              className="filter-range-slider"
              id="molarMassSlider"
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-filter-submit-block"
              style={{ flex: 1 }}
            >
              Применить фильтр
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={onResetFilter}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#cbd5e1',
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              Сброс
            </button>
          </div>
        </form>
      </div>

      {/* Grid of Cards */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
          Синхронизация каталога...
        </div>
      ) : propellants.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
          Рабочие тела по заданному критерию не найдены
        </div>
      ) : (
        <div className="catalog-cards-grid">
          {propellants.map((propellant) => {
            const isCreator = propellant.is_creator === 1;
            const imgSrc = propellant.image_url
              ? resolveMediaUrl(propellant.image_url)
              : defaultImage;

            return (
              <div key={propellant.id} className="propellant-card-wrapper">
                <div
                  className="propellant-grid-card"
                  onClick={() => onSelectPropellant(propellant)}
                  style={{ cursor: 'pointer', position: 'relative' }}
                  title="Нажмите для перехода в ленту"
                >
                  {/* Delete Button for Creator */}
                  {isCreator && (
                    <button
                      type="button"
                      onClick={(e) => handleDelete(propellant.id, propellant.name, e)}
                      title="Удалить запись (вы автор)"
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        zIndex: 10,
                        background: 'rgba(239, 68, 68, 0.9)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '50%',
                        width: '28px',
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  )}

                  <div className="card-image-box">
                    <img
                      src={imgSrc}
                      alt={propellant.name}
                      className="propellant-card-img"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = defaultImage;
                      }}
                    />
                  </div>

                  <div className="card-meta-content">
                    <div className="card-propellant-title">{propellant.name}</div>

                    <div className="card-bottom-row">
                      <span className="card-molar-mass">
                        M: {propellant.molar_mass !== null ? propellant.molar_mass : '—'}
                      </span>
                      <span className="card-gamma">
                        &gamma;: {propellant.specific_heat_ratio !== null ? propellant.specific_heat_ratio : '—'}
                      </span>
                      <span className="card-likes-count">
                        <span
                          className="card-heart-icon"
                          style={{ color: propellant.is_liked === 1 ? 'var(--accent-red)' : undefined }}
                        >
                          &hearts;
                        </span>{' '}
                        {propellant.likes_count ?? 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
