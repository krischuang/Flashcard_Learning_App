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

      {/* ── Decorative background scribbles ─────────────────────── */}
      {/* Top-right: overlapping oval loops */}
      <svg className={styles.scribbleTopRight} viewBox="0 0 380 260" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <ellipse cx="90"  cy="130" rx="82" ry="56" fill="none" stroke="#dba8d8" strokeWidth="11" strokeLinecap="round" transform="rotate(-22 90 130)"/>
        <ellipse cx="190" cy="100" rx="78" ry="54" fill="none" stroke="#dba8d8" strokeWidth="11" strokeLinecap="round" transform="rotate(-16 190 100)"/>
        <ellipse cx="285" cy="75"  rx="75" ry="52" fill="none" stroke="#dba8d8" strokeWidth="11" strokeLinecap="round" transform="rotate(-10 285 75)"/>
      </svg>

      {/* Bottom-center: stacked arch curves */}
      <svg className={styles.scribbleBottomCenter} viewBox="0 0 340 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M 10 190 Q 90 10 185 190"  fill="none" stroke="#dba8d8" strokeWidth="11" strokeLinecap="round"/>
        <path d="M 55 195 Q 140 5  240 195" fill="none" stroke="#dba8d8" strokeWidth="11" strokeLinecap="round"/>
        <path d="M 100 198 Q 188 2 290 198" fill="none" stroke="#dba8d8" strokeWidth="11" strokeLinecap="round"/>
      </svg>

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
          onDelete={deleteCard}
        />
      </main>

      {modalState.open && (
        <CardModal
          mode={modalState.mode}
          card={modalState.card}
          categories={categories}
          loading={loading}
          onSubmit={handleModalSubmit}
          onDelete={openConfirm}
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
