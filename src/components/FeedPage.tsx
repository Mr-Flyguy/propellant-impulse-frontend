import React, { useState, useEffect } from 'react';
import type { PropellantResponseDto } from '../api/generated/PropellantApi';
import { resolveMediaUrl } from '../api/apiClient';

interface FeedPageProps {
  propellant: PropellantResponseDto | null;
  onNext: () => void;
  onToggleLike?: (id: number, like: boolean) => void;
  isAuthenticated: boolean;
  onRequireAuth?: () => void;
  isLoading: boolean;
}

export const FeedPage: React.FC<FeedPageProps> = ({
  propellant,
  onNext,
  onToggleLike,
  isAuthenticated,
  onRequireAuth,
  isLoading,
}) => {
  const defaultVideo = '/video/default_exhaust.mp4';
  const defaultImage = '/assets/default_propellant.jpg';

  const rawVideo = propellant?.video_url ? resolveMediaUrl(propellant.video_url) : '';
  const rawImage = propellant?.image_url ? resolveMediaUrl(propellant.image_url) : defaultImage;

  const [videoSrc, setVideoSrc] = useState<string>(rawVideo || defaultVideo);
  const [videoFailed, setVideoFailed] = useState<boolean>(!rawVideo);

  useEffect(() => {
    if (rawVideo && rawVideo.trim() !== '') {
      setVideoSrc(rawVideo);
      setVideoFailed(false);
    } else {
      setVideoSrc(defaultVideo);
      setVideoFailed(false);
    }
  }, [rawVideo]);

  const handleVideoError = () => {
    if (videoSrc !== defaultVideo) {
      setVideoSrc(defaultVideo);
    } else {
      setVideoFailed(true);
    }
  };

  const handleLikeClick = () => {
    if (!isAuthenticated) {
      if (onRequireAuth) onRequireAuth();
      return;
    }
    if (propellant && onToggleLike) {
      const nextLike = propellant.is_liked !== 1;
      onToggleLike(propellant.id, nextLike);
    }
  };

  if (!propellant) {
    return (
      <div className="feed-viewport" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#94a3b8' }}>Нет доступных рабочих тел в ленте</p>
      </div>
    );
  }

  const isLiked = propellant.is_liked === 1;

  return (
    <div
      className="feed-viewport"
      style={{
        flex: 1,
        minHeight: 0,
        height: '100%',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#0b0d1e',
      }}
    >
      {/* Background Video or Image fallback */}
      {!videoFailed ? (
        <video
          key={videoSrc}
          className="feed-bg-video"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          src={videoSrc}
          onError={handleVideoError}
        >
          <source src={videoSrc} type="video/mp4" />
          <source src={defaultVideo} type="video/mp4" />
        </video>
      ) : (
        <img
          src={rawImage}
          alt={propellant.name}
          className="feed-bg-video"
          style={{ objectFit: 'cover' }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = defaultImage;
          }}
        />
      )}

      <div className="feed-scrim-overlay"></div>

      <div className="feed-system-tag">ЛЕНТА РАБОЧИХ ТЕЛ</div>

      <div className="feed-actions-stack">
        {/* Like Button */}
        <div className="feed-like-group">
          <button
            type="button"
            className="action-atom-btn"
            onClick={handleLikeClick}
            disabled={isLoading}
            style={{
              cursor: 'pointer',
              border: 'none',
              background: isLiked ? 'rgba(240, 125, 36, 0.3)' : 'rgba(15, 23, 42, 0.65)',
              transform: isLiked ? 'scale(1.1)' : 'scale(1)',
              transition: 'all 0.2s ease',
            }}
            title={
              isAuthenticated
                ? isLiked
                  ? 'Снять отметку "нравится"'
                  : 'Поставить отметку "нравится"'
                : 'Авторизуйтесь, чтобы ставить отметки'
            }
          >
            <svg
              className="action-atom-svg"
              viewBox="0 0 24 24"
              fill={isLiked ? '#f07d24' : 'none'}
              stroke={isLiked ? '#f07d24' : 'currentColor'}
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
          <span className="action-like-counter" style={{ color: isLiked ? '#f07d24' : '#ffffff' }}>
            {propellant.likes_count ?? 0}
          </span>
        </div>

        {propellant.molar_mass !== null && (
          <div className="feed-action-pill">M = {propellant.molar_mass} г/моль</div>
        )}
        {propellant.specific_heat_ratio !== null && (
          <div className="feed-action-pill">&gamma; = {propellant.specific_heat_ratio}</div>
        )}

        <button
          type="button"
          onClick={onNext}
          disabled={isLoading}
          className="btn-next-feed"
          style={{ border: 'none', cursor: 'pointer' }}
        >
          Далее &gt;
        </button>
      </div>

      <div className="feed-info-card">
        <h1 className="feed-title">{propellant.name}</h1>

        {propellant.description && (
          <div className="desc-expandable-block">
            <details className="desc-details">
              <summary>
                <span className="desc-toggle-more">Подробнее &#9662;</span>
                <span className="desc-toggle-less">Свернуть &#9652;</span>
              </summary>
              <p className="desc-full-text">{propellant.description}</p>
            </details>
            <p className="desc-short-preview">{propellant.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};
