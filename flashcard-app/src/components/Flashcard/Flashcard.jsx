import { useState, useEffect, useRef } from 'react';
import styles from './Flashcard.module.css';

const CARD_COLORS = [
  '#8b1a4a', // burgundy
  '#1a5c6b', // deep teal
  '#6b3a8e', // purple
  '#2a6b52', // forest green
  '#c45a28', // terracotta
  '#1a456e', // navy
  '#8b4a1a', // sienna
  '#4a1a6e', // deep violet
];

const COUNTDOWN_SECONDS = 10;

function Flashcard({ card, colorIndex = 0, onEdit, onDelete, onDeleteRequest }) {
  const [flipped, setFlipped] = useState(false);
  // "leaving" triggers the fade-out animation before the card is removed
  const [leaving, setLeaving] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const timerRef = useRef(null);

  // Start countdown when flipped, clear it when flipped back
  useEffect(() => {
    if (flipped) {
      setCountdown(COUNTDOWN_SECONDS);
    } else {
      clearTimeout(timerRef.current);
      setCountdown(null);
    }
    return () => clearTimeout(timerRef.current);
  }, [flipped]);

  // Tick the countdown down every second
  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      setLeaving(true);
      setTimeout(() => onDelete(card.id), 450);
      return;
    }
    timerRef.current = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [countdown, onDelete, card.id]);

  const handleClick = (e) => {
    if (e.target.closest('button')) return;
    // Clicking the back face flips back and cancels the countdown
    if (flipped) {
      clearTimeout(timerRef.current);
      setCountdown(null);
    }
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
      className={`${styles.wrapper} ${leaving ? styles.leaving : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Flashcard: ${card.question}. Press Enter or Space to flip.`}
    >
      <div className={`${styles.inner} ${flipped ? styles.flipped : ''}`}>
        {/* ── Front ─────────────────────────────────────────────── */}
        <div className={styles.front} style={{ background: cardColor, pointerEvents: flipped ? 'none' : 'auto' }}>
          <div className={styles.topRow}>
            <span className={styles.categoryTag}>{card.category}</span>
            <div className={styles.cardActions}>
              <button
                className={styles.editBtn}
                onClick={(e) => { e.stopPropagation(); onEdit(card); }}
                aria-label="Edit card"
                title="Edit"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              <button
                className={styles.deleteBtn}
                onClick={(e) => { e.stopPropagation(); onDeleteRequest(card.id); }}
                aria-label="Delete card"
                title="Delete"
              >
                🗑
              </button>
            </div>
          </div>
          <div className={styles.decorativeArea} />
          <div className={styles.cardFooter}>
            <div className={styles.textScroll}>
              <p className={styles.question}>{card.question}</p>
            </div>
            <span className={styles.hint}>Tap to reveal →</span>
          </div>
        </div>

        {/* ── Back ──────────────────────────────────────────────── */}
        <div className={styles.back} style={{ background: cardColor, pointerEvents: flipped ? 'auto' : 'none' }}>
          <div className={styles.backTopRow}>
            <p className={styles.answerLabel}>Answer</p>
            {countdown !== null && (
              <span
                className={`${styles.countdown} ${countdown <= 3 ? styles.countdownUrgent : ''}`}
                aria-label={`Card deletes in ${countdown} seconds`}
              >
                🗑 {countdown}s
              </span>
            )}
          </div>
          <div className={styles.decorativeArea} />
          <div className={styles.cardFooter}>
            <div className={styles.textScroll}>
              <p className={styles.answer}>{card.answer}</p>
            </div>
            <span className={styles.hint}>Tap to flip back →</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Flashcard;
