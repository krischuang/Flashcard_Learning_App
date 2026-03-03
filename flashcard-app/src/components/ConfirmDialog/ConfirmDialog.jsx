import { useEffect, useRef } from 'react';
import styles from './ConfirmDialog.module.css';

function ConfirmDialog({ onConfirm, onCancel }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    // Focus the Cancel button first (safer default)
    const cancelBtn = dialogRef.current?.querySelector('[data-cancel]');
    cancelBtn?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onCancel();
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div
        className={styles.dialog}
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-desc"
      >
        <span className={styles.icon} aria-hidden="true">🗑️</span>
        <h3 id="confirm-title" className={styles.title}>Delete this card?</h3>
        <p id="confirm-desc" className={styles.desc}>
          This action cannot be undone.
        </p>
        <div className={styles.actions}>
          <button
            data-cancel
            className={styles.cancelBtn}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button className={styles.confirmBtn} onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
