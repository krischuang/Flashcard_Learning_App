import { useState, useEffect, useRef } from 'react';
import styles from './CardModal.module.css';

function CardModal({ mode, card, categories, loading, onSubmit, onDelete, onClose }) {
  const [question, setQuestion] = useState(card?.question ?? '');
  const [answer, setAnswer] = useState(card?.answer ?? '');
  const [category, setCategory] = useState(card?.category ?? categories[0]);
  const [errors, setErrors] = useState({});
  const modalRef = useRef(null);

  // Focus management + focus trap + ESC key
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    // Focus first interactive element
    const firstFocusable = modal.querySelector('textarea, input, button');
    firstFocusable?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      // Focus trap: keep Tab cycling within the modal so keyboard users
      // cannot accidentally navigate behind the backdrop
      if (e.key === 'Tab') {
        const focusables = modal.querySelectorAll(
          'textarea, input, button:not([disabled])',
        );
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey) {
          // Shift+Tab on the first element wraps to the last
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          // Tab on the last element wraps to the first
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const validate = () => {
    const errs = {};
    if (!question.trim()) errs.question = 'Question is required.';
    if (!answer.trim()) errs.answer = 'Answer is required.';
    if (!category.trim()) errs.category = 'Category is required.';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSubmit({ question: question.trim(), answer: answer.trim(), category });
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div
        className={styles.modal}
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className={styles.modalHeader}>
          <h2 id="modal-title" className={styles.modalTitle}>
            {mode === 'create' ? '✨ Create New Card' : '✏️ Edit Card'}
          </h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          {/* Question */}
          <div className={styles.field}>
            <label htmlFor="modal-question">Question</label>
            <textarea
              id="modal-question"
              value={question}
              onChange={(e) => {
                setQuestion(e.target.value);
                setErrors((prev) => ({ ...prev, question: '' }));
              }}
              placeholder="Type your question here…"
              rows={3}
              className={errors.question ? styles.inputError : ''}
            />
            {errors.question && (
              <span className={styles.errorMsg} role="alert">
                {errors.question}
              </span>
            )}
          </div>

          {/* Answer */}
          <div className={styles.field}>
            <label htmlFor="modal-answer">Answer</label>
            <textarea
              id="modal-answer"
              value={answer}
              onChange={(e) => {
                setAnswer(e.target.value);
                setErrors((prev) => ({ ...prev, answer: '' }));
              }}
              placeholder="Type the answer here…"
              rows={3}
              className={errors.answer ? styles.inputError : ''}
            />
            {errors.answer && (
              <span className={styles.errorMsg} role="alert">
                {errors.answer}
              </span>
            )}
          </div>

          {/* Category */}
          <div className={styles.field}>
            <label htmlFor="modal-category">Category</label>
            <input
              id="modal-category"
              type="text"
              list="category-suggestions"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setErrors((prev) => ({ ...prev, category: '' }));
              }}
              placeholder="e.g. Science, History, or your own…"
              className={errors.category ? styles.inputError : ''}
            />
            <datalist id="category-suggestions">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
            {errors.category && (
              <span className={styles.errorMsg} role="alert">
                {errors.category}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            {/* Show delete button only in edit mode */}
            {mode === 'edit' && (
              <button
                type="button"
                className={styles.deleteBtn}
                onClick={() => { onDelete(card.id); onClose(); }}
                disabled={loading}
              >
                Delete
              </button>
            )}
            <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Saving…' : mode === 'create' ? 'Create Card' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CardModal;
