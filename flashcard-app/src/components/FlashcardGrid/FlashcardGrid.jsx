import Flashcard from '../Flashcard/Flashcard';
import styles from './FlashcardGrid.module.css';

function FlashcardGrid({ cards, loading, onEdit, onDelete, onDeleteRequest }) {
  if (loading && cards.length === 0) {
    return (
      <div className={styles.empty} role="status" aria-label="Loading cards">
        <span className={styles.emptyIcon} aria-hidden="true">⏳</span>
        <h3 className={styles.emptyTitle}>Loading cards…</h3>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className={styles.empty} role="status">
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
        <Flashcard
          key={card.id}
          card={card}
          colorIndex={card.id}
          onEdit={onEdit}
          onDelete={onDelete}
          onDeleteRequest={onDeleteRequest}
        />
      ))}
    </div>
  );
}

export default FlashcardGrid;
