import React from 'react';

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  message = 'Выполняется синхронизация данных...',
}) => {
  if (!isLoading) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(10, 16, 26, 0.72)',
        backdropFilter: 'blur(3px)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        pointerEvents: 'all',
        userSelect: 'none',
      }}
    >
      <div
        className="spinner-border"
        role="status"
        style={{
          width: '3.5rem',
          height: '3.5rem',
          color: '#f07d24',
          borderWidth: '0.35rem',
          marginBottom: '1rem',
        }}
      >
        <span className="visually-hidden">Загрузка...</span>
      </div>
      <div
        style={{
          fontSize: '0.95rem',
          fontWeight: 600,
          letterSpacing: '0.5px',
          color: '#e2e8f0',
          textTransform: 'uppercase',
        }}
      >
        {message}
      </div>
    </div>
  );
};
