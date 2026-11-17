import { useState, useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './store';
import {
  fetchPropellantsThunk,
  fetchPropellantFeedThunk,
  fetchPropellantDraftThunk,
  createPropellantDraftThunk,
  publishPropellantThunk,
  deletePropellantThunk,
  toggleLikePropellantThunk,
} from './store/slices/propellantsSlice';
import {
  setMaxMolarMass,
  setSearchQuery,
  resetFilter,
} from './store/slices/filterSlice';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearAuthError,
} from './store/slices/authSlice';
import { authService } from './services/authService';
import type { AppTab } from './types/propellant';
import type { PropellantResponseDto } from './api/generated/PropellantApi';
import { FeedPage } from './components/FeedPage';
import { CatalogPage } from './components/CatalogPage';
import { AddPropellantPage } from './components/AddPropellantPage';
import { LoginPage } from './components/LoginPage';
import { NavbarBottom } from './components/NavbarBottom';
import { LoadingOverlay } from './components/LoadingOverlay';
import './propellant-bwxt.css';

function getCurrentRoute(): { tab: AppTab; id?: number } {
  const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
  if (hash.startsWith('feed')) {
    const parts = hash.split('/');
    const id = parts[1] ? parseInt(parts[1], 10) : undefined;
    return { tab: 'feed', id: isNaN(id!) ? undefined : id };
  }
  if (hash.startsWith('create') || hash.startsWith('add')) {
    return { tab: 'create' };
  }
  if (hash.startsWith('login') || hash.startsWith('auth')) {
    return { tab: 'login' };
  }
  return { tab: 'catalog' };
}

export function App() {
  const dispatch = useAppDispatch();
  const initialRoute = getCurrentRoute();
  const [activeTab, setActiveTab] = useState<AppTab>(initialRoute.tab);

  // Redux Selectors
  const auth = useAppSelector((state) => state.auth);
  const filter = useAppSelector((state) => state.filter);
  const propellantsState = useAppSelector((state) => state.propellants);

  const { catalog, feedItem, draftItem, loading: propellantsLoading, isMockMode } = propellantsState;
  const isLoading = auth.loading || propellantsLoading;

  // Initial load of catalog and feed
  useEffect(() => {
    dispatch(
      fetchPropellantsThunk({
        max_molar_mass: filter.maxMolarMass,
        query: filter.searchQuery,
      })
    );
    dispatch(fetchPropellantFeedThunk({ id: initialRoute.id }));
    // Notice: on F5 / initial load, auth state remains guest in Redux,
    // demonstrating that session cookie is stored separately in browser Application storage.
  }, [dispatch]);

  // Sync hash routing
  useEffect(() => {
    const handleRouteSync = () => {
      const route = getCurrentRoute();
      setActiveTab(route.tab);
      if (route.id && (!feedItem || feedItem.id !== route.id)) {
        dispatch(fetchPropellantFeedThunk({ id: route.id }));
      }
    };

    window.addEventListener('hashchange', handleRouteSync);
    window.addEventListener('popstate', handleRouteSync);

    if (!window.location.hash) {
      window.location.hash = activeTab === 'feed'
        ? `#/feed/${feedItem?.id || 1}`
        : `#/${activeTab}`;
    }

    return () => {
      window.removeEventListener('hashchange', handleRouteSync);
      window.removeEventListener('popstate', handleRouteSync);
    };
  }, [activeTab, feedItem, dispatch]);

  const handleSelectTab = (tab: AppTab) => {
    setActiveTab(tab);
    if (tab === 'feed') {
      window.location.hash = `#/feed/${feedItem?.id || 1}`;
    } else {
      window.location.hash = `#/${tab}`;
    }
  };

  // Filter handlers (Redux Toolkit)
  const handleFilterChange = (newFilter: { maxMolarMass: number; searchQuery: string }) => {
    dispatch(setMaxMolarMass(newFilter.maxMolarMass));
    dispatch(setSearchQuery(newFilter.searchQuery));
  };

  const handleApplyFilter = useCallback(() => {
    dispatch(
      fetchPropellantsThunk({
        max_molar_mass: filter.maxMolarMass,
        query: filter.searchQuery,
      })
    );
  }, [dispatch, filter]);

  const handleResetFilter = () => {
    dispatch(resetFilter());
    dispatch(fetchPropellantsThunk({ max_molar_mass: 64.0, query: '' }));
  };

  // Feed handlers
  const handleNextFeed = () => {
    dispatch(fetchPropellantFeedThunk({ id: feedItem?.id, next: true }))
      .unwrap()
      .then((res) => {
        window.location.hash = `#/feed/${res.data.id}`;
      });
  };

  const handleSelectPropellant = (propellant: PropellantResponseDto) => {
    dispatch(fetchPropellantFeedThunk({ id: propellant.id }));
    setActiveTab('feed');
    window.location.hash = `#/feed/${propellant.id}`;
  };

  const handleToggleLike = (id: number, like: boolean) => {
    dispatch(toggleLikePropellantThunk({ id, like }));
  };

  const handleDeletePropellant = (id: number) => {
    dispatch(deletePropellantThunk(id));
  };

  // Creation wizard handlers (Thunks with Axios)
  const handleCreateDraft = async (payload: { name: string; imageFile?: File | null; videoFile?: File | null }) => {
    return dispatch(createPropellantDraftThunk(payload)).unwrap();
  };

  const handlePublishDraft = async (payload: {
    id: number;
    molarMass?: number;
    specificHeatRatio?: number;
    description?: string;
  }) => {
    const res = await dispatch(
      publishPropellantThunk({
        id: payload.id,
        data: {
          molar_mass: payload.molarMass,
          specific_heat_ratio: payload.specificHeatRatio,
          description: payload.description,
        },
      })
    ).unwrap();
    // After publishing, refresh catalog
    dispatch(
      fetchPropellantsThunk({
        max_molar_mass: filter.maxMolarMass,
        query: filter.searchQuery,
      })
    );
    return res;
  };

  // Auth handlers (Direct Axios without thunk/codegen)
  const handleLogin = async (username: string, password: string) => {
    dispatch(loginStart());
    try {
      const data = await authService.login(username, password);
      dispatch(loginSuccess(data.user));
      // Refresh draft and catalog with creator/liked flags for user
      dispatch(fetchPropellantDraftThunk());
      dispatch(
        fetchPropellantsThunk({
          max_molar_mass: filter.maxMolarMass,
          query: filter.searchQuery,
        })
      );
      setActiveTab('catalog');
      window.location.hash = '#/catalog';
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Ошибка авторизации';
      dispatch(loginFailure(msg));
      throw err;
    }
  };

  const handleRegister = async (username: string, email: string, password: string) => {
    dispatch(loginStart());
    try {
      await authService.register(username, email, password);
      dispatch(clearAuthError());
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Ошибка регистрации';
      dispatch(loginFailure(msg));
      throw err;
    }
  };

  const handleLogout = async () => {
    dispatch(loginStart());
    try {
      await authService.logout();
    } catch (err) {
      console.warn('Logout request failed on server:', err);
    } finally {
      dispatch(logout());
      dispatch(resetFilter()); // Filter is reset on logout as required
      dispatch(fetchPropellantsThunk({ max_molar_mass: 64.0, query: '' }));
      setActiveTab('login');
      window.location.hash = '#/login';
    }
  };

  return (
    <div className="mobile-app-frame" style={{ position: 'relative' }}>
      {/* Universal Loading Overlay blocking interactions */}
      <LoadingOverlay isLoading={isLoading} />

      {activeTab === 'feed' && (
        <FeedPage
          propellant={feedItem}
          onNext={handleNextFeed}
          onToggleLike={handleToggleLike}
          isAuthenticated={auth.isAuthenticated}
          onRequireAuth={() => handleSelectTab('login')}
          isLoading={isLoading}
        />
      )}

      {activeTab === 'catalog' && (
        <CatalogPage
          propellants={catalog}
          filter={filter}
          onFilterChange={handleFilterChange}
          onApplyFilter={handleApplyFilter}
          onResetFilter={handleResetFilter}
          onSelectPropellant={handleSelectPropellant}
          onDeletePropellant={handleDeletePropellant}
          isLoading={isLoading}
          isMockMode={isMockMode}
        />
      )}

      {activeTab === 'create' && (
        <AddPropellantPage
          isAuthenticated={auth.isAuthenticated}
          draftItem={draftItem}
          onCreateDraft={handleCreateDraft}
          onPublishDraft={handlePublishDraft}
          onNavigateToLogin={() => handleSelectTab('login')}
          isLoading={isLoading}
        />
      )}

      {activeTab === 'login' && (
        <LoginPage
          isAuthenticated={auth.isAuthenticated}
          user={auth.user}
          onLogin={handleLogin}
          onRegister={handleRegister}
          onLogout={handleLogout}
          isLoading={isLoading}
          error={auth.error}
          onClearError={() => dispatch(clearAuthError())}
        />
      )}

      <NavbarBottom
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        isAuthenticated={auth.isAuthenticated}
        username={auth.user?.username}
      />
    </div>
  );
}

export default App;
