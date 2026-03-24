import { useState } from 'react';
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

function Flashcard({ card, colorIndex = 0, onEdit, onDelete }) {
  const [flipped, setFlipped] = useState(false);

  const handleClick = (e) => {
    if (e.target.closest('button')) return;
    setFlipped((prev) => !prev);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(e);
    }
  };

  // Cycle through the palette so consecutive cards always differ in colour
  const cardColor = CARD_COLORS[colorIndex % CARD_COLORS.length];

  return (
    <div
      className={styles.wrapper}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
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
          <div className={styles.backActions}>
            <button
              className={styles.flipBackBtn}
              onClick={(e) => { e.stopPropagation(); setFlipped(false); }}
              aria-label="Flip card back to question"
            >
              ↩ Flip Back
            </button>
            <button
              className={styles.deleteBtn}
              onClick={(e) => { e.stopPropagation(); onDelete(card.id); }}
              aria-label="Delete card"
            >
              🗑 Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Flashcard;
