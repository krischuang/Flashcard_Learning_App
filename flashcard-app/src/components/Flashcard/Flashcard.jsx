import { useState, useRef } from 'react';
import styles from './Flashcard.module.css';

const CATEGORY_COLORS = {
  'General Knowledge': '#10b981',
  Science: '#3b82f6',
  Math: '#f59e0b',
};

function Flashcard({ card, onEdit, onDiscard }) {
  const [flipped, setFlipped] = useState(false);
  const [disappearing, setDisappearing] = useState(false);
  const timerRef = useRef(null);

  const handleClick = (e) => {
    // Ignore button clicks and ignore if already flipped/leaving
    if (e.target.closest('button')) return;
    if (flipped || disappearing) return;

    setFlipped(true);
    // Give the user time to read the answer, then fade the card out
    timerRef.current = setTimeout(() => setDisappearing(true), 1500);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(e);
    }
  };

  // Called when the CSS fade-out animation finishes
  const handleAnimationEnd = () => {
    if (disappearing) {
      clearTimeout(timerRef.current);
      onDiscard(card.id);
    }
  };

  const categoryColor = CATEGORY_COLORS[card.category] ?? '#6b7280';

  return (
    <div
      className={`${styles.wrapper} ${disappearing ? styles.disappearing : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onAnimationEnd={handleAnimationEnd}
      role="button"
      tabIndex={0}
      aria-label={`Flashcard: ${card.question}. Press Enter or Space to flip.`}
    >
      <div className={`${styles.inner} ${flipped ? styles.flipped : ''}`}>
        {/* ── Front ───────────────────────────────────────────────── */}
        <div className={styles.front}>
          <span className={styles.category} style={{ color: categoryColor }}>
            {card.category}
          </span>
          <p className={styles.question}>{card.question}</p>
          <div className={styles.frontFooter}>
            <button
              className={styles.editBtn}
              onClick={(e) => {
                e.stopPropagation();
                onEdit(card);
              }}
              aria-label="Edit card"
              title="Edit"
            >
              ✏️ Edit
            </button>
            <span className={styles.hint}>Click to reveal</span>
          </div>
        </div>

        {/* ── Back ────────────────────────────────────────────────── */}
        <div className={styles.back}>
          <p className={styles.answerLabel}>Answer</p>
          <p className={styles.answer}>{card.answer}</p>
          <p className={styles.dismissHint}>Card will disappear shortly…</p>
        </div>
      </div>
    </div>
  );
}

export default Flashcard;
