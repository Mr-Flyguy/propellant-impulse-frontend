import React, { useState, useEffect } from 'react';
import type { Propellant } from '../types/propellant';

interface FeedPageProps {
  propellant: Propellant | null;
  onNext: () => void;
  isLoading: boolean;
}

export const FeedPage: React.FC<FeedPageProps> = ({
  propellant,
  onNext,
}) => {
  const defaultVideo = '/video/default_exhaust.mp4';

  const [videoSrc, setVideoSrc] = useState<string>(
    propellant?.videoUrl && propellant.videoUrl.trim() !== ''
      ? propellant.videoUrl
      : defaultVideo
  );

  useEffect(() => {
    if (propellant?.videoUrl && propellant.videoUrl.trim() !== '') {
      setVideoSrc(propellant.videoUrl);
    } else {
      setVideoSrc(defaultVideo);
    }
  }, [propellant]);

  const handleVideoError = () => {
    if (videoSrc !== defaultVideo) {
      setVideoSrc(defaultVideo);
    }
  };

  if (!propellant) {
    return null;
  }

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

      <div className="feed-scrim-overlay"></div>

      <div className="feed-system-tag">ЛЕНТА ЭЛЕМЕНТОВ</div>

      <div className="feed-actions-stack">
        <div className="feed-like-group">
          <div className="action-atom-btn" title="Одобрено инженерами">
            <svg
              className="action-atom-svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle cx="12" cy="12" r="2.5" fill="currentColor" />
              <circle cx="7.5" cy="7.5" r="3" />
              <circle cx="16.5" cy="7.5" r="3" />
              <circle cx="16.5" cy="16.5" r="3" />
              <circle cx="7.5" cy="16.5" r="3" />
            </svg>
          </div>
          <span className="action-like-counter">{propellant.likesCount}</span>
        </div>

        <div className="feed-action-pill">M = {propellant.molarMass} г/моль</div>
        <div className="feed-action-pill">&gamma; = {propellant.specificHeatRatio}</div>

        <button
          type="button"
          onClick={onNext}
          className="btn-next-feed"
          style={{ border: 'none' }}
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
