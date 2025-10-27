import React, { useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import { FaBalanceScale, FaInfoCircle, FaSearch, FaTimes, FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';

const clamp01 = (value) => Math.min(Math.max(value, 0), 1);

const getBoxStyle = (box, imageSize) => {
  if (!box?.vertices?.length) return null;
  const xs = box.vertices.map(v => v.x ?? 0);
  const ys = box.vertices.map(v => v.y ?? 0);
  let minX = Math.min(...xs);
  let maxX = Math.max(...xs);
  let minY = Math.min(...ys);
  let maxY = Math.max(...ys);
  const { width, height } = imageSize || { width: 1, height: 1 };
  if (width <= 0 || height <= 0) return null;
  const isNormalized = maxX <= 1 && maxY <= 1 && minX >= 0 && minY >= 0;
  if (!isNormalized) {
    minX /= width;
    maxX /= width;
    minY /= height;
    maxY /= height;
  }
  const left = clamp01(minX) * 100;
  const top = clamp01(minY) * 100;
  const w = clamp01(maxX) - clamp01(minX);
  const h = clamp01(maxY) - clamp01(minY);
  if (w <= 0 || h <= 0) return null;
  return {
    left: `${left}%`,
    top: `${top}%`,
    width: `${w * 100}%`,
    height: `${h * 100}%`
  };
};

const ScanResultDialog = ({ isOpen, scan, onClose }) => {
  const { items, addItem, removeItem, clearItems, hasItem, maxItems } = useCompare();
  const navigate = useNavigate();
  const [imageSize, setImageSize] = useState({ width: 1, height: 1 });
  const [warning, setWarning] = useState('');

  if (!isOpen || !scan) return null;

  const { preview, term, data } = scan;
  const offProduct = data?.off?.data;
  const offCode = offProduct?.code || offProduct?.id || null;
  const productName = offProduct?.product_name || term;
  const objects = useMemo(() => (data?.vision?.objects || []).filter(obj => obj.box), [data]);
  const primaryBox = data?.vision?.primaryBox;

  const closeAndClearWarning = () => {
    setWarning('');
    onClose();
  };

  const handleViewDetails = () => {
    if (offCode) {
      navigate(`/producto?code=${encodeURIComponent(offCode)}`);
    } else {
      navigate(`/search?query=${encodeURIComponent(term)}`);
    }
    onClose();
  };

  const handleGoToSearch = () => {
    navigate(`/search?query=${encodeURIComponent(term)}`);
    onClose();
  };

  const handleAddToCompare = () => {
    if (!offCode) {
      setWarning('No se encontró un código válido para comparar este producto.');
      return;
    }
    if (!hasItem(offCode) && items.length >= maxItems) {
      setWarning(`Solo puedes comparar hasta ${maxItems} productos.`);
      return;
    }
    addItem({ code: offCode, name: productName, image: offProduct?.image_url || preview });
    setWarning('');
  };

  const handleRemoveItem = (code) => {
    removeItem(code);
  };

  const handleClearAll = () => {
    clearItems();
  };

  const content = (
    <div className="scan-dialog-overlay" onClick={closeAndClearWarning}>
      <div className="scan-dialog" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <button className="scan-dialog__close" onClick={closeAndClearWarning} aria-label="Cerrar">
          <FaTimes />
        </button>
        <div className="scan-dialog__body">
          <div className="scan-dialog__preview">
            {preview && (
              <div className="scan-dialog__image-wrapper">
                <img
                  src={preview}
                  alt="Captura"
                  onLoad={e => setImageSize({ width: e.target.naturalWidth, height: e.target.naturalHeight })}
                />
                {primaryBox && (
                  <div className="scan-dialog__box scan-dialog__box--primary" style={getBoxStyle(primaryBox, imageSize)}>
                    Texto principal
                  </div>
                )}
                {objects.map((object, index) => {
                  const style = getBoxStyle(object.box, imageSize);
                  if (!style) return null;
                  return (
                    <div key={`${object.name}-${index}`} className="scan-dialog__box" style={style}>
                      {object.name}
                    </div>
                  );
                })}
              </div>
            )}
            <div className="scan-dialog__summary">
              <h2>{productName}</h2>
              {data?.vision?.primaryText && (
                <p className="scan-dialog__primary-text">
                  Texto detectado: <strong>{data.vision.primaryText}</strong>
                </p>
              )}
              {data?.ai?.response && data.ai.response !== term && (
                <p className="scan-dialog__ai-text">
                  Sugerencia IA: <strong>{data.ai.response}</strong>
                </p>
              )}
            </div>
          </div>
          <div className="scan-dialog__actions">
            <button className="scan-dialog__action" onClick={handleViewDetails}>
              <FaInfoCircle /> Ver información nutricional
            </button>
            <button className="scan-dialog__action" onClick={handleGoToSearch}>
              <FaSearch /> Buscar más resultados
            </button>
            <button className={`scan-dialog__action${offCode ? '' : ' disabled'}`} onClick={handleAddToCompare} disabled={!offCode}>
              <FaBalanceScale /> Agregar a la comparación
            </button>
            {warning && <div className="scan-dialog__warning">{warning}</div>}
            <div className="scan-dialog__compare-list">
              <div className="scan-dialog__compare-header">
                <h3>Productos guardados ({items.length})</h3>
                <button
                  type="button"
                  className="scan-dialog__clear"
                  onClick={handleClearAll}
                  disabled={!items.length}
                >
                  <FaTrashAlt /> Borrar todos
                </button>
              </div>
              {items.length === 0 ? (
                <p className="scan-dialog__empty">Todavía no guardaste productos para comparar.</p>
              ) : (
                <ul className="scan-dialog__compare-items">
                  {items.map(item => (
                    <li key={item.code} className="scan-dialog__compare-item">
                      <div className="scan-dialog__compare-info">
                        {item.image ? <img src={item.image} alt={item.name} /> : <span className="scan-dialog__placeholder" />}
                        <span>{item.name}</span>
                      </div>
                      <button type="button" onClick={() => handleRemoveItem(item.code)} aria-label={`Quitar ${item.name}`}>
                        <FaTimes />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(content, document.body);
};

export default ScanResultDialog;
