import { useState, useRef } from 'react';
import styles from './Flashcard.module.css';

const CARD_COLORS = [
  '#fa0644', // red
  '#fa5300', // orange
  '#aa02ff', // purple
  '#0071c9', // blue
  '#304254', // dark navy
  '#e2007a', // hot pink
  '#00a896', // teal
  '#f5a623', // amber
];

function Flashcard({ card, colorIndex = 0, onEdit, onDiscard }) {
  const [flipped, setFlipped] = useState(false);
  const [disappearing, setDisappearing] = useState(false);
  const timerRef = useRef(null);

  const handleClick = (e) => {
    if (e.target.closest('button')) return;
    if (flipped || disappearing) return;

    setFlipped(true);
    timerRef.current = setTimeout(() => setDisappearing(true), 1500);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(e);
    }
  };

  const handleAnimationEnd = () => {
    if (disappearing) {
      clearTimeout(timerRef.current);
      onDiscard(card.id);
    }
  };

  const cardColor = CARD_COLORS[colorIndex % CARD_COLORS.length];

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
        {/* ── Front ─────────────────────────────────────────────── */}
        <div className={styles.front} style={{ background: cardColor }}>
          <div className={styles.topRow}>
            <span className={styles.categoryTag}>{card.category}</span>
            <button
              className={styles.editBtn}
              onClick={(e) => { e.stopPropagation(); onEdit(card); }}
              aria-label="Edit card"
              title="Edit"
            >
              ✎
            </button>
          </div>
          <p className={styles.question}>{card.question}</p>
          <span className={styles.hint}>Tap to reveal →</span>
        </div>

        {/* ── Back ──────────────────────────────────────────────── */}
        <div className={styles.back} style={{ background: cardColor }}>
          <p className={styles.answerLabel}>Answer</p>
          <p className={styles.answer}>{card.answer}</p>
          <p className={styles.dismissHint}>Disappearing shortly…</p>
        </div>
      </div>
    </div>
  );
}

export default Flashcard;
