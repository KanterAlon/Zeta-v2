// src/components/HeroSection.jsx
import React, { useRef, useState } from 'react';
import { FiCamera, FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import CameraModal from './CameraModal';
import Loader from './Loader';
import AlertPopup from './AlertPopup';
import ScanResultDialog from './ScanResultDialog';

const HeroSection = () => {
  const [query, setQuery] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanError, setScanError] = useState('');
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);

  const readAsDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleCameraClick = () => {
    if (isMobile && fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      setShowCamera(true);
    }
  };

  const handleCapture = async (input) => {
    let file = null;
    let preview = null;

    if (input?.target?.files?.[0]) {
      file = input.target.files[0];
      try {
        preview = await readAsDataUrl(file);
      } catch (err) {
        console.warn('No se pudo generar la previsualización', err);
      }
    } else if (input?.file) {
      file = input.file;
      preview = input.preview || null;
      if (!preview) {
        try {
          preview = await readAsDataUrl(file);
        } catch (err) {
          console.warn('No se pudo generar la previsualización', err);
        }
      }
    } else if (input instanceof Blob) {
      file = input;
      try {
        preview = await readAsDataUrl(file);
      } catch (err) {
        console.warn('No se pudo generar la previsualización', err);
      }
    }

    if (!file) return;

    const formData = new FormData();
    formData.append('image', file, 'capture.jpg');
    try {
      setLoading(true);
      setScanError('');
      const res = await fetch('http://localhost:3000/api/camera/upload', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        throw new Error('No se pudo analizar la imagen');
      }
      const data = await res.json();
      const aiTerm = data.ai?.response?.trim() || '';
      const dominantText = data.vision?.primaryText?.trim() || '';
      const fallbackText = data.vision?.text?.split('\n').map(t => t.trim()).find(Boolean) || '';
      const term = aiTerm || dominantText || fallbackText;
      if (!term) {
        setScanError('No se pudo reconocer el texto principal del envase. Intentalo nuevamente.');
        return;
      }
      setScanResult({
        preview,
        term,
        data,
      });
    } catch (err) {
      console.error('Camera search error', err);
      setScanError(err.message || 'Ocurrió un error al analizar la imagen');
    } finally {
      setLoading(false);
      setShowCamera(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCloseScanResult = () => {
    setScanResult(null);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="page">
      <div className="inner">
        <div className="evaluation-content">
          <h1>EVALUÁ TU PRODUCTO</h1>
          <h3>Acá encontrarás toda la información nutricional 100% simplificada</h3>

          <div className="search-bar">
            <div className="search-wrapper">
              <button
                className="search-button search-icon-button"
                onClick={handleSearch}
              >
                <FiSearch size={20} />
              </button>
              <input
                type="text"
                className="search-input"
                placeholder="Ej: Fideos Matarazzo"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
              />
              <button
                type="button"
                className="search-button camera-icon-button"
                onClick={handleCameraClick}
              >
                <FiCamera size={20} />
              </button>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleCapture}
              />
              <CameraModal
                isOpen={showCamera}
                onClose={() => setShowCamera(false)}
                onCapture={handleCapture}
              />
            </div>
          </div>
          <div className="search-hint">Presioná Enter o la lupa para buscar</div>
        </div>
      </div>
      {loading && (
        <div className="page-loader">
          <Loader />
        </div>
      )}
      <ScanResultDialog
        isOpen={!!scanResult}
        scan={scanResult}
        onClose={handleCloseScanResult}
      />
      {scanError && (
        <AlertPopup message={scanError} onClose={() => setScanError('')} />
      )}
    </section>
  );
};

export default HeroSection;
