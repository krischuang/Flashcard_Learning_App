import { useFlashcards } from './hooks/useFlashcards';
import { CATEGORIES } from './utils/constants';
import Header from './components/Header/Header';
import CategoryFilter from './components/CategoryFilter/CategoryFilter';
import FlashcardGrid from './components/FlashcardGrid/FlashcardGrid';
import CardModal from './components/CardModal/CardModal';
import styles from './App.module.css';

function App() {
  const {
    cards,
    filter,
    setFilter,
    modalState,
    toast,
    getFilteredCards,
    createCard,
    updateCard,
    deleteCard,
    openCreateModal,
    openEditModal,
    closeModal,
  } = useFlashcards();

  const filteredCards = getFilteredCards();

  const handleModalSubmit = (data) => {
    if (modalState.mode === 'create') {
      createCard(data);
    } else {
      updateCard(modalState.card.id, data);
    }
  };

  return (
    <div className={styles.app}>
      <Header cardCount={cards.length} onNewCard={openCreateModal} />

      <main className={styles.main}>
        <CategoryFilter
          categories={CATEGORIES}
          activeFilter={filter}
          onFilterChange={setFilter}
        />
        <FlashcardGrid
          cards={filteredCards}
          onEdit={openEditModal}
          onDiscard={deleteCard}
        />
      </main>

      {modalState.open && (
        <CardModal
          mode={modalState.mode}
          card={modalState.card}
          categories={CATEGORIES}
          onSubmit={handleModalSubmit}
          onClose={closeModal}
        />
      )}

      {toast && (
        <div className={styles.toast} role="status" aria-live="polite">
          {toast}
        </div>
      )}
    </div>
  );
}

export default App;
