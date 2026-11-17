import React, { useState, useEffect } from 'react';
import type { PropellantResponseDto } from '../api/generated/PropellantApi';

interface AddPropellantPageProps {
  isAuthenticated: boolean;
  draftItem: PropellantResponseDto | null;
  onCreateDraft: (payload: { name: string; imageFile?: File | null; videoFile?: File | null }) => Promise<any>;
  onPublishDraft: (payload: { id: number; molarMass?: number; specificHeatRatio?: number; description?: string }) => Promise<any>;
  onNavigateToLogin: () => void;
  isLoading: boolean;
}

export const AddPropellantPage: React.FC<AddPropellantPageProps> = ({
  isAuthenticated,
  draftItem,
  onCreateDraft,
  onPublishDraft,
  onNavigateToLogin,
  isLoading,
}) => {
  // Step 1 Form state
  const [name, setName] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  // Step 2 Form state
  const [molarMass, setMolarMass] = useState<string>('2.016');
  const [specificHeatRatio, setSpecificHeatRatio] = useState<string>('1.41');
  const [description, setDescription] = useState<string>('');

  const [step, setStep] = useState<1 | 2>(draftItem ? 2 : 1);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (draftItem) {
      setStep(2);
      if (draftItem.molar_mass) setMolarMass(String(draftItem.molar_mass));
      if (draftItem.specific_heat_ratio) setSpecificHeatRatio(String(draftItem.specific_heat_ratio));
      if (draftItem.description) setDescription(draftItem.description);
    } else {
      setStep(1);
    }
  }, [draftItem]);

  if (!isAuthenticated) {
    return (
      <div className="page-content-scrollable" style={{ padding: '24px 16px' }}>
        <div className="screen-header-block">
          <h1 className="screen-title">Добавление рабочего тела</h1>
          <p className="screen-subtitle">Мастер создания компонентов</p>
        </div>

        <div
          style={{
            marginTop: '32px',
            padding: '24px',
            background: 'rgba(30, 41, 59, 0.7)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🔒</div>
          <h2 style={{ fontSize: '1.2rem', color: '#f8fafc', marginBottom: '8px' }}>
            Требуется авторизация
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '20px' }}>
            Создание черновиков и публикация рабочих тел доступны только зарегистрированным специалистам.
          </p>
          <button
            type="button"
            onClick={onNavigateToLogin}
            className="btn-filter-submit-block"
            style={{ width: 'auto', padding: '10px 24px', display: 'inline-block' }}
          >
            Войти в систему
          </button>
        </div>
      </div>
    );
  }

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setStatusMessage({ type: 'error', text: 'Укажите наименование рабочего тела' });
      return;
    }
    setStatusMessage(null);
    try {
      await onCreateDraft({ name: name.trim(), imageFile, videoFile });
      setStatusMessage({ type: 'success', text: 'Черновик успешно сформирован! Переход к шагу публикации.' });
      setStep(2);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Ошибка при сохранении черновика' });
    }
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftItem) {
      setStatusMessage({ type: 'error', text: 'Черновик не найден' });
      return;
    }
    setStatusMessage(null);
    try {
      await onPublishDraft({
        id: draftItem.id,
        molarMass: parseFloat(molarMass) || undefined,
        specificHeatRatio: parseFloat(specificHeatRatio) || undefined,
        description: description.trim() || undefined,
      });
      setStatusMessage({ type: 'success', text: `Рабочее тело "${draftItem.name}" успешно опубликовано в каталоге!` });
      // Reset form
      setName('');
      setImageFile(null);
      setVideoFile(null);
      setDescription('');
      setStep(1);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Ошибка публикации' });
    }
  };

  return (
    <div className="page-content-scrollable" style={{ padding: '20px 16px 80px 16px' }}>
      <div className="screen-header-block">
        <h1 className="screen-title">Добавление рабочего тела</h1>
        <p className="screen-subtitle">
          {step === 1 ? 'Шаг 1: Формирование черновика' : 'Шаг 2: Термодинамические параметры и публикация'}
        </p>
      </div>

      {statusMessage && (
        <div
          style={{
            padding: '10px 14px',
            marginBottom: '16px',
            borderRadius: '8px',
            background: statusMessage.type === 'success' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: `1px solid ${statusMessage.type === 'success' ? '#22c55e' : '#ef4444'}`,
            color: statusMessage.type === 'success' ? '#86efac' : '#fca5a5',
            fontSize: '0.85rem',
          }}
        >
          {statusMessage.text}
        </div>
      )}

      {/* Step Indicator */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <div
          style={{
            flex: 1,
            height: '4px',
            borderRadius: '2px',
            background: '#f07d24',
          }}
        />
        <div
          style={{
            flex: 1,
            height: '4px',
            borderRadius: '2px',
            background: step === 2 ? '#f07d24' : 'rgba(255, 255, 255, 0.2)',
          }}
        />
      </div>

      {step === 1 ? (
        <form onSubmit={handleStep1Submit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '6px' }}>
              Наименование рабочего тела *
            </label>
            <input
              type="text"
              required
              placeholder="Например: Метан или Жидкий водород"
              value={name}
              onChange={(e) => setName(e.target.value)}
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

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '6px' }}>
              Схема или фотография (файл для S3 MinIO)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#94a3b8',
                fontSize: '0.85rem',
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '6px' }}>
              Видеозапись истечения струи (файл MP4 для S3 MinIO)
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#94a3b8',
                fontSize: '0.85rem',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-filter-submit-block"
            style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }}
          >
            {isLoading ? 'Сохранение черновика...' : 'Сформировать черновик →'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleStep2Submit}>
          <div
            style={{
              padding: '12px 16px',
              background: 'rgba(30, 41, 59, 0.6)',
              borderRadius: '8px',
              border: '1px solid rgba(240, 125, 36, 0.3)',
              marginBottom: '16px',
            }}
          >
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Активный черновик:</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#f07d24' }}>{draftItem?.name}</div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '6px' }}>
                Молярная масса (г/моль)
              </label>
              <input
                type="number"
                step="0.001"
                required
                value={molarMass}
                onChange={(e) => setMolarMass(e.target.value)}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '6px' }}>
                Показатель адиабаты (&gamma;)
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={specificHeatRatio}
                onChange={(e) => setSpecificHeatRatio(e.target.value)}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '6px' }}>
              Термодинамическое описание свойств
            </label>
            <textarea
              rows={4}
              placeholder="Опишите физические свойства, температуру диссоциации и специфику нагрева в реакторе..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                background: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                fontSize: '0.85rem',
                resize: 'vertical',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              disabled={isLoading}
              onClick={() => setStep(1)}
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#cbd5e1',
                cursor: 'pointer',
              }}
            >
              ← Назад
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-filter-submit-block"
              style={{ flex: 1, padding: '12px', fontSize: '0.95rem' }}
            >
              {isLoading ? 'Публикация...' : 'Опубликовать рабочее тело ✔'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
