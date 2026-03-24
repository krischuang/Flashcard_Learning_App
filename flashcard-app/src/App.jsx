import { useMemo } from 'react';
import { useFlashcards } from './hooks/useFlashcards';
import Header from './components/Header/Header';
import CategoryFilter from './components/CategoryFilter/CategoryFilter';
import FlashcardGrid from './components/FlashcardGrid/FlashcardGrid';
import CardModal from './components/CardModal/CardModal';
import ConfirmDialog from './components/ConfirmDialog/ConfirmDialog';
import styles from './App.module.css';

function App() {
  const {
    cards,
    filter,
    setFilter,
    loading,
    modalState,
    confirmState,
    toast,
    getFilteredCards,
    createCard,
    updateCard,
    deleteCard,
    openCreateModal,
    openEditModal,
    closeModal,
    openConfirm,
    closeConfirm,
  } = useFlashcards();

  // Derive categories dynamically from actual card data
  const categories = useMemo(
    () => [...new Set(cards.map((c) => c.category))].sort(),
    [cards],
  );

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
          categories={categories}
          activeFilter={filter}
          onFilterChange={setFilter}
        />
        <FlashcardGrid
          cards={filteredCards}
          loading={loading}
          onEdit={openEditModal}
          onDelete={openConfirm}
        />
      </main>

      {modalState.open && (
        <CardModal
          mode={modalState.mode}
          card={modalState.card}
          categories={categories}
          loading={loading}
          onSubmit={handleModalSubmit}
          onClose={closeModal}
        />
      )}

      {confirmState.open && (
        <ConfirmDialog
          loading={loading}
          onConfirm={() => deleteCard(confirmState.cardId)}
          onCancel={closeConfirm}
        />
      )}

      {toast && (
        <div
          className={`${styles.toast} ${styles[toast.type]}`}
          role="status"
          aria-live="polite"
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default App;
