import { useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';

export function useFlashcards() {
  const [cards, setCards] = useState([]);
  const [filter, setFilter] = useState('All');
  const [modalState, setModalState] = useState({ open: false, mode: 'create', card: null });
  const [confirmState, setConfirmState] = useState({ open: false, cardId: null });
  const [toast, setToast] = useState(null);

  // Load seed data once on mount
  useEffect(() => {
    api.getCards().then(setCards);
  }, []);

  const showToast = useCallback((message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  }, []);

  // ── Read ──────────────────────────────────────────────────────────────────
  const getFilteredCards = useCallback(() => {
    if (filter === 'All') return cards;
    return cards.filter((c) => c.category === filter);
  }, [cards, filter]);

  // ── Create ────────────────────────────────────────────────────────────────
  const createCard = useCallback(
    async (data) => {
      const card = await api.createCard(data);
      setCards((prev) => [...prev, card]);
      showToast('Card created!');
      setModalState({ open: false, mode: 'create', card: null });
    },
    [showToast],
  );

  // ── Update ────────────────────────────────────────────────────────────────
  const updateCard = useCallback(
    async (id, data) => {
      const updated = await api.updateCard(id, data);
      setCards((prev) => prev.map((c) => (c.id === id ? updated : c)));
      showToast('Card updated!');
      setModalState({ open: false, mode: 'create', card: null });
    },
    [showToast],
  );

  // ── Delete ────────────────────────────────────────────────────────────────
  const deleteCard = useCallback(
    async (id) => {
      await api.deleteCard(id);
      setCards((prev) => prev.filter((c) => c.id !== id));
      showToast('Card deleted!');
      setConfirmState({ open: false, cardId: null });
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
