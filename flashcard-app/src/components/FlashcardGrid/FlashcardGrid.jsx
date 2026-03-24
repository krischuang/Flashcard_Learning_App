import Flashcard from '../Flashcard/Flashcard';
import styles from './FlashcardGrid.module.css';

function FlashcardGrid({ cards, onEdit, onDiscard }) {
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
      {cards.map((card, index) => (
        <Flashcard
          key={card.id}
          card={card}
          colorIndex={index}
          onEdit={onEdit}
          onDiscard={onDiscard}
        />
      ))}
    </div>
  );
}

export default FlashcardGrid;
