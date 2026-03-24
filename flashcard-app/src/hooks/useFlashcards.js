import { useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';

export function useFlashcards() {
  const [cards, setCards] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [modalState, setModalState] = useState({ open: false, mode: 'create', card: null });
  const [confirmState, setConfirmState] = useState({ open: false, cardId: null });
  // toast is either null or { message, type } where type is 'success' | 'error'
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Load all cards once on mount; show error toast if the backend is unreachable
  useEffect(() => {
    setLoading(true);
    api.getCards()
      .then(setCards)
      .catch(() => showToast('Could not load cards — is the backend running?', 'error'))
      .finally(() => setLoading(false));
  }, [showToast]);

  // ── Read ──────────────────────────────────────────────────────────────────
  const getFilteredCards = useCallback(() => {
    if (filter === 'All') return cards;
    return cards.filter((c) => c.category === filter);
  }, [cards, filter]);

  // ── Create ────────────────────────────────────────────────────────────────
  const createCard = useCallback(
    async (data) => {
      setLoading(true);
      try {
        const card = await api.createCard(data);
        setCards((prev) => [...prev, card]);
        showToast('Card created!', 'success');
        setModalState({ open: false, mode: 'create', card: null });
      } catch (err) {
        showToast(`Failed to create card: ${err.message}`, 'error');
      } finally {
        setLoading(false);
      }
    },
    [showToast],
  );

  // ── Update ────────────────────────────────────────────────────────────────
  const updateCard = useCallback(
    async (id, data) => {
      setLoading(true);
      try {
        const updated = await api.updateCard(id, data);
        setCards((prev) => prev.map((c) => (c.id === id ? updated : c)));
        showToast('Card updated!', 'success');
        setModalState({ open: false, mode: 'create', card: null });
      } catch (err) {
        showToast(`Failed to update card: ${err.message}`, 'error');
      } finally {
        setLoading(false);
      }
    },
    [showToast],
  );

  // ── Delete ────────────────────────────────────────────────────────────────
  const deleteCard = useCallback(
    async (id) => {
      setLoading(true);
      try {
        await api.deleteCard(id);
        setCards((prev) => prev.filter((c) => c.id !== id));
        showToast('Card deleted!', 'success');
        setConfirmState({ open: false, cardId: null });
      } catch (err) {
        showToast(`Failed to delete card: ${err.message}`, 'error');
        setConfirmState({ open: false, cardId: null });
      } finally {
        setLoading(false);
      }
    },
    [showToast],
  );

  // ── Modal helpers ─────────────────────────────────────────────────────────
  const openCreateModal = useCallback(() => {
    setModalState({ open: true, mode: 'create', card: null });
  }, []);

  const openEditModal = useCallback((card) => {
    setModalState({ open: true, mode: 'edit', card });
  }, []);

  const closeModal = useCallback(() => {
    setModalState({ open: false, mode: 'create', card: null });
  }, []);

  // ── Confirm helpers ───────────────────────────────────────────────────────
  const openConfirm = useCallback((cardId) => {
    setConfirmState({ open: true, cardId });
  }, []);

  const closeConfirm = useCallback(() => {
    setConfirmState({ open: false, cardId: null });
  }, []);

  return {
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
  };
}
