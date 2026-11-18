import React from 'react';
import type { AppTab } from '../types/propellant';

interface NavbarBottomProps {
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  isAuthenticated: boolean;
  username?: string | null;
}

export const NavbarBottom: React.FC<NavbarBottomProps> = ({
  activeTab,
  onSelectTab,
  isAuthenticated,
  username,
}) => {
  return (
    <nav className="bottom-tab-bar" style={{ zIndex: 100 }}>
      {/* 1. Лента */}
      <button
        type="button"
        className={`tab-nav-item ${activeTab === 'feed' ? 'active' : ''}`}
        onClick={() => onSelectTab('feed')}
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        title="Лента рекомендаций рабочих тел"
      >
        {activeTab === 'feed' && <div className="tab-active-indicator"></div>}
        <svg className="tab-nav-svg" viewBox="0 0 24 24">
          <path d="M12 2c-3.5 4-6 7.5-6 11a6 6 0 0 0 12 0c0-3.5-2.5-7-6-11z" />
          <path d="M12 18a2.5 2.5 0 0 1-2.5-2.5c0-1.5 1.5-2.5 2.5-4 1 1.5 2.5 2.5 2.5 4a2.5 2.5 0 0 1-2.5 2.5z" />
        </svg>
        <span>ЛЕНТА</span>
      </button>

      {/* 2. Добавить (доступно всем, но если гость — подсказка авторизоваться) */}
      <button
        type="button"
        className={`tab-nav-item ${activeTab === 'create' ? 'active' : ''}`}
        onClick={() => onSelectTab('create')}
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        title={isAuthenticated ? 'Мастер добавления рабочего тела' : 'Требуется авторизация для добавления'}
      >
        {activeTab === 'create' && <div className="tab-active-indicator"></div>}
        <svg className="tab-nav-svg" viewBox="0 0 24 24">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        <span>ДОБАВИТЬ</span>
      </button>

      {/* 3. Плитка / Каталог */}
      <button
        type="button"
        className={`tab-nav-item ${activeTab === 'catalog' ? 'active' : ''}`}
        onClick={() => onSelectTab('catalog')}
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        title="Каталог опубликованных рабочих тел"
      >
        {activeTab === 'catalog' && <div className="tab-active-indicator"></div>}
        <svg className="tab-nav-svg" viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="12" y1="3" x2="12" y2="21" />
        </svg>
        <span>ПЛИТКА</span>
      </button>

      {/* 4. Вход / Выход */}
      <button
        type="button"
        className={`tab-nav-item ${activeTab === 'login' ? 'active' : ''}`}
        onClick={() => onSelectTab('login')}
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        title={isAuthenticated ? `Авторизован: ${username || 'Инженер'}` : 'Вход в систему'}
      >
        {activeTab === 'login' && <div className="tab-active-indicator"></div>}
        {isAuthenticated ? (
          <>
            <svg className="tab-nav-svg" viewBox="0 0 24 24">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span style={{ fontWeight: 600 }}>ВЫХОД</span>
          </>
        ) : (
          <>
            <svg className="tab-nav-svg" viewBox="0 0 24 24">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            <span>ВХОД</span>
          </>
        )}
      </button>
    </nav>
  );
};
