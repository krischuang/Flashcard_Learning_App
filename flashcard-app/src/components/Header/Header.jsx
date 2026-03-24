import styles from './Header.module.css';

function Header({ cardCount, onNewCard }) {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
<h1 className={styles.title}>
          Flash<span className={styles.titleAccent}>Card</span>
        </h1>
      </div>
      <div className={styles.actions}>
        <span className={styles.badge} aria-live="polite">
          {cardCount} {cardCount === 1 ? 'card' : 'cards'}
        </span>
        <button className={styles.newBtn} onClick={onNewCard} aria-label="Create new flashcard">
          + New Card
        </button>
      </div>
    </header>
  );
}

export default Header;
