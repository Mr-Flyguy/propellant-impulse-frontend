import React from 'react';
import type { AppTab } from '../types/propellant';

interface NavbarBottomProps {
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
}

export const NavbarBottom: React.FC<NavbarBottomProps> = ({
  activeTab,
  onSelectTab,
}) => {
  return (
    <nav className="bottom-tab-bar">
      <button
        type="button"
        className={`tab-nav-item ${activeTab === 'feed' ? 'active' : ''}`}
        onClick={() => onSelectTab('feed')}
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
      >
        {activeTab === 'feed' && <div className="tab-active-indicator"></div>}
        <svg className="tab-nav-svg" viewBox="0 0 24 24">
          <path d="M12 2c-3.5 4-6 7.5-6 11a6 6 0 0 0 12 0c0-3.5-2.5-7-6-11z" />
          <path d="M12 18a2.5 2.5 0 0 1-2.5-2.5c0-1.5 1.5-2.5 2.5-4 1 1.5 2.5 2.5 2.5 4a2.5 2.5 0 0 1-2.5 2.5z" />
        </svg>
        <span>ЛЕНТА</span>
      </button>

      <button
        type="button"
        disabled
        className="tab-nav-item"
        style={{ background: 'none', border: 'none', cursor: 'not-allowed' }}
        title="Добавление доступно только авторизованным специалистам"
      >
        <svg className="tab-nav-svg" viewBox="0 0 24 24">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        <span>ДОБАВИТЬ</span>
      </button>

      <button
        type="button"
        className={`tab-nav-item ${activeTab === 'catalog' ? 'active' : ''}`}
        onClick={() => onSelectTab('catalog')}
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
      >
        {activeTab === 'catalog' && <div className="tab-active-indicator"></div>}
        <svg className="tab-nav-svg" viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="12" y1="3" x2="12" y2="21" />
        </svg>
        <span>ПЛИТКА</span>
      </button>

      <button
        type="button"
        disabled
        className="tab-nav-item"
        style={{ background: 'none', border: 'none', cursor: 'not-allowed' }}
        title="Авторизация недоступна в гостевом режиме"
      >
        <svg className="tab-nav-svg" viewBox="0 0 24 24">
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
          <polyline points="10 17 15 12 10 7" />
          <line x1="15" y1="12" x2="3" y2="12" />
        </svg>
        <span>ВХОД</span>
      </button>
    </nav>
  );
};
