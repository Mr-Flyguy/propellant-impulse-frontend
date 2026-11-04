import { useState, useEffect, useMemo } from 'react';
import type { Propellant, FilterState, AppTab } from './types/propellant';
import { INITIAL_MOCK_PROPELLANTS } from './data/mockPropellants';
import { fetchMockPropellants } from './services/mockApi';
import { FeedPage } from './components/FeedPage';
import { CatalogPage } from './components/CatalogPage';
import { NavbarBottom } from './components/NavbarBottom';
import './propellant-bwxt.css';

const DEFAULT_FILTER: FilterState = {
  maxMolarMass: 64.0,
};

function getCurrentRoute(): { tab: AppTab; id?: number } {
  const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
  if (hash.startsWith('catalog')) {
    return { tab: 'catalog' };
  }
  if (hash.startsWith('feed')) {
    const parts = hash.split('/');
    const id = parts[1] ? parseInt(parts[1], 10) : undefined;
    return { tab: 'feed', id: isNaN(id!) ? undefined : id };
  }

  const path = window.location.pathname.replace(/^\//, '').toLowerCase();
  if (path.startsWith('catalog')) {
    return { tab: 'catalog' };
  }
  if (path.startsWith('feed')) {
    const parts = path.split('/');
    const id = parts[1] ? parseInt(parts[1], 10) : undefined;
    return { tab: 'feed', id: isNaN(id!) ? undefined : id };
  }

  return { tab: 'catalog' };
}

export function App() {
  const initialRoute = getCurrentRoute();
  const [activeTab, setActiveTab] = useState<AppTab>(initialRoute.tab);
  const [propellants, setPropellants] = useState<Propellant[]>(INITIAL_MOCK_PROPELLANTS);
  const [feedIndex, setFeedIndex] = useState<number>(() => {
    if (initialRoute.id) {
      const idx = INITIAL_MOCK_PROPELLANTS.findIndex((p) => p.id === initialRoute.id);
      return idx !== -1 ? idx : 0;
    }
    return 0;
  });
  const [filter, setFilter] = useState<FilterState>(DEFAULT_FILTER);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetchMockPropellants()
      .then((data) => {
        if (isMounted) {
          if (data && data.length > 0) {
            setPropellants(data);
          }
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.warn('Сетевой запрос к mock API завершен с ошибкой:', err);
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handleRouteSync = () => {
      const route = getCurrentRoute();
      setActiveTab(route.tab);
      if (route.id && propellants.length > 0) {
        const idx = propellants.findIndex((p) => p.id === route.id);
        if (idx !== -1) {
          setFeedIndex(idx);
        }
      }
    };

    window.addEventListener('hashchange', handleRouteSync);
    window.addEventListener('popstate', handleRouteSync);

    if (!window.location.hash) {
      window.location.hash = activeTab === 'feed'
        ? `#/feed/${propellants[feedIndex]?.id || 1}`
        : '#/catalog';
    }

    return () => {
      window.removeEventListener('hashchange', handleRouteSync);
      window.removeEventListener('popstate', handleRouteSync);
    };
  }, [propellants, feedIndex, activeTab]);

  const filteredPropellants = useMemo(() => {
    return propellants.filter((item) => item.molarMass <= filter.maxMolarMass);
  }, [propellants, filter]);

  const handleSelectTab = (tab: AppTab) => {
    if (tab === 'feed' || tab === 'catalog') {
      setActiveTab(tab);
      if (tab === 'feed') {
        const curId = propellants[feedIndex]?.id || 1;
        window.location.hash = `#/feed/${curId}`;
      } else {
        window.location.hash = '#/catalog';
      }
    }
  };

  const handleNextFeed = () => {
    if (propellants.length > 0) {
      const nextIdx = (feedIndex + 1) % propellants.length;
      setFeedIndex(nextIdx);
      const nextProp = propellants[nextIdx];
      if (nextProp) {
        window.location.hash = `#/feed/${nextProp.id}`;
      }
    }
  };

  const handleSelectPropellant = (propellant: Propellant) => {
    const idx = propellants.findIndex((p) => p.id === propellant.id);
    if (idx !== -1) {
      setFeedIndex(idx);
    }
    setActiveTab('feed');
    window.location.hash = `#/feed/${propellant.id}`;
  };

  const currentPropellant = propellants[feedIndex] || propellants[0] || null;

  return (
    <div className="mobile-app-frame">
      {activeTab === 'feed' && (
        <FeedPage
          propellant={currentPropellant}
          onNext={handleNextFeed}
          isLoading={isLoading}
        />
      )}

      {activeTab === 'catalog' && (
        <CatalogPage
          propellants={propellants}
          filteredPropellants={filteredPropellants}
          filter={filter}
          onFilterChange={setFilter}
          onSelectPropellant={handleSelectPropellant}
          isLoading={isLoading}
        />
      )}

      <NavbarBottom
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
      />
    </div>
  );
}

export default App;
