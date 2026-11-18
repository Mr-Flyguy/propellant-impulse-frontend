import React, { useState } from 'react';
import type { UserInfo } from '../services/authService';

interface LoginPageProps {
  isAuthenticated: boolean;
  user: UserInfo | null;
  onLogin: (username: string, password: string) => Promise<void>;
  onRegister: (username: string, email: string, password: string) => Promise<void>;
  onLogout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  onClearError: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  isAuthenticated,
  user,
  onLogin,
  onRegister,
  onLogout,
  isLoading,
  error,
  onClearError,
}) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState('test_engineer');
  const [email, setEmail] = useState('engineer@propellant.org');
  const [password, setPassword] = useState('secret123');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onClearError();
    setSuccessMessage(null);

    if (isRegisterMode) {
      if (!username || !email || !password) return;
      try {
        await onRegister(username, email, password);
        setSuccessMessage('Регистрация успешна! Теперь вы можете войти в систему.');
        setIsRegisterMode(false);
      } catch {
        // error handled via Redux state
      }
    } else {
      if (!username || !password) return;
      try {
        await onLogin(username, password);
      } catch {
        // error handled via Redux state
      }
    }
  };

  // If already authenticated -> Show Profile & Logout view
  if (isAuthenticated && user) {
    return (
      <div className="page-content-scrollable" style={{ padding: '24px 16px' }}>
        <div className="screen-header-block">
          <h1 className="screen-title">Профиль инженера</h1>
          <p className="screen-subtitle">Управление сессией пользователя</p>
        </div>

        <div
          style={{
            marginTop: '20px',
            padding: '24px',
            background: 'rgba(30, 41, 59, 0.75)',
            borderRadius: '12px',
            border: '1px solid rgba(240, 125, 36, 0.3)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f07d24, #ea580c)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                fontWeight: 700,
              }}
            >
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', color: '#ffffff', margin: 0 }}>{user.username}</h2>
              <span
                style={{
                  display: 'inline-block',
                  marginTop: '4px',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  background: 'rgba(240, 125, 36, 0.2)',
                  color: '#f07d24',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}
              >
                Роль: {user.role || 'user'}
              </span>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '16px', marginBottom: '24px' }}>
            <div style={{ marginBottom: '10px' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Идентификатор пользователя:</span>{' '}
              <strong style={{ color: '#e2e8f0', fontSize: '0.85rem' }}>#{user.id}</strong>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Электронная почта:</span>{' '}
              <strong style={{ color: '#e2e8f0', fontSize: '0.85rem' }}>{user.email}</strong>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Статус сессии:</span>{' '}
              <span style={{ color: '#4ade80', fontSize: '0.85rem', fontWeight: 600 }}>● Активна (HTTP-only Cookie)</span>
            </div>
          </div>

          <button
            type="button"
            disabled={isLoading}
            onClick={onLogout}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid #ef4444',
              color: '#f87171',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.2s ease',
            }}
          >
            {isLoading ? 'Завершение сессии...' : 'Выйти из системы (Выход)'}
          </button>
        </div>
      </div>
    );
  }

  // Guest view: Login or Register Form
  return (
    <div className="page-content-scrollable" style={{ padding: '24px 16px' }}>
      <div className="screen-header-block">
        <h1 className="screen-title">{isRegisterMode ? 'Регистрация' : 'Авторизация'}</h1>
        <p className="screen-subtitle">
          {isRegisterMode ? 'Создание новой учетной записи' : 'Вход в закрытый инженерный контур'}
        </p>
      </div>

      {/* Tabs Switcher */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        <button
          type="button"
          onClick={() => {
            setIsRegisterMode(false);
            onClearError();
          }}
          style={{
            flex: 1,
            height: '38px',
            borderRadius: '6px',
            background: !isRegisterMode
              ? 'linear-gradient(90deg, #c93146 0%, #364596 100%)'
              : 'rgba(15, 23, 42, 0.6)',
            boxShadow: !isRegisterMode ? '0 4px 14px rgba(201, 49, 70, 0.35)' : 'none',
            border: !isRegisterMode ? 'none' : '1px solid rgba(255, 255, 255, 0.15)',
            color: '#ffffff',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s ease',
          }}
        >
          Вход
        </button>
        <button
          type="button"
          onClick={() => {
            setIsRegisterMode(true);
            onClearError();
          }}
          style={{
            flex: 1,
            height: '38px',
            borderRadius: '6px',
            background: isRegisterMode
              ? 'linear-gradient(90deg, #c93146 0%, #364596 100%)'
              : 'rgba(15, 23, 42, 0.6)',
            boxShadow: isRegisterMode ? '0 4px 14px rgba(201, 49, 70, 0.35)' : 'none',
            border: isRegisterMode ? 'none' : '1px solid rgba(255, 255, 255, 0.15)',
            color: '#ffffff',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s ease',
          }}
        >
          Регистрация
        </button>
      </div>

      {error && (
        <div
          style={{
            padding: '10px 14px',
            marginBottom: '16px',
            borderRadius: '8px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid #ef4444',
            color: '#fca5a5',
            fontSize: '0.85rem',
          }}
        >
          {error}
        </div>
      )}

      {successMessage && (
        <div
          style={{
            padding: '10px 14px',
            marginBottom: '16px',
            borderRadius: '8px',
            background: 'rgba(34, 197, 94, 0.15)',
            border: '1px solid #22c55e',
            color: '#86efac',
            fontSize: '0.85rem',
          }}
        >
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '6px' }}>
            Логин (username) *
          </label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              fontSize: '0.9rem',
            }}
          />
        </div>

        {isRegisterMode && (
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '6px' }}>
              Электронная почта *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                background: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                fontSize: '0.9rem',
              }}
            />
          </div>
        )}

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '6px' }}>
            Пароль *
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              fontSize: '0.9rem',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-filter-submit-block"
          style={{
            width: '100%',
            height: '40px',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 700,
          }}
        >
          {isLoading
            ? 'Выполняется запрос...'
            : isRegisterMode
            ? 'Регистрация'
            : 'Вход'}
        </button>
      </form>
    </div>
  );
};
