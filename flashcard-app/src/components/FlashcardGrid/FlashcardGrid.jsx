import Flashcard from '../Flashcard/Flashcard';
import styles from './FlashcardGrid.module.css';

function FlashcardGrid({ cards, onEdit, onDiscard }) {
  if (cards.length === 0) {
    return (
      <div className={styles.empty} role="status">
        <span className={styles.emptyIcon} aria-hidden="true">🃏</span>
        <h3 className={styles.emptyTitle}>No cards found</h3>
        <p className={styles.emptyText}>
          Try a different filter or click <strong>+ New Card</strong> to get started!
        </p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {cards.map((card) => (
        <Flashcard key={card.id} card={card} onEdit={onEdit} onDiscard={onDiscard} />
      ))}
    </div>
  );
}

export default FlashcardGrid;
