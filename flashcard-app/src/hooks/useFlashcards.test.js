import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useFlashcards } from './useFlashcards';
import * as api from '../services/api';

vi.mock('../services/api');

const sampleCard = { id: 1, question: 'Q', answer: 'A', category: 'General' };

describe('useFlashcards', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.getCards.mockResolvedValue([sampleCard]);
  });

  it('loads cards on mount', async () => {
    const { result } = renderHook(() => useFlashcards());
    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.cards).toEqual([sampleCard]);
  });

  it('shows an error toast if the backend is unreachable', async () => {
    api.getCards.mockRejectedValue(new Error('network error'));
    const { result } = renderHook(() => useFlashcards());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.toast).toEqual({
      message: 'Could not load cards — is the backend running?',
      type: 'error',
    });
  });

  it('filters cards by category', async () => {
    api.getCards.mockResolvedValue([
      { id: 1, question: 'Q1', answer: 'A1', category: 'Python' },
      { id: 2, question: 'Q2', answer: 'A2', category: 'Web' },
    ]);
    const { result } = renderHook(() => useFlashcards());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.getFilteredCards()).toHaveLength(2);

    act(() => result.current.setFilter('Python'));
    expect(result.current.getFilteredCards()).toEqual([
      { id: 1, question: 'Q1', answer: 'A1', category: 'Python' },
    ]);
  });

  it('appends a new card on createCard and closes the modal', async () => {
    const newCard = { id: 2, question: 'New Q', answer: 'New A', category: 'General' };
    api.createCard.mockResolvedValue(newCard);
    const { result } = renderHook(() => useFlashcards());
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => result.current.openCreateModal());
    expect(result.current.modalState.open).toBe(true);

    await act(async () => {
      await result.current.createCard({ question: 'New Q', answer: 'New A' });
    });

    expect(result.current.cards).toContainEqual(newCard);
    expect(result.current.modalState.open).toBe(false);
    expect(result.current.toast).toEqual({ message: 'Card created!', type: 'success' });
  });

  it('removes the card on deleteCard', async () => {
    api.deleteCard.mockResolvedValue(undefined);
    const { result } = renderHook(() => useFlashcards());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.deleteCard(1);
    });

    expect(result.current.cards).toEqual([]);
    expect(result.current.confirmState).toEqual({ open: false, cardId: null });
  });

  it('shows an error toast when deleteCard fails, but still closes the confirm dialog', async () => {
    api.deleteCard.mockRejectedValue(new Error('server error'));
    const { result } = renderHook(() => useFlashcards());
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => result.current.openConfirm(1));
    await act(async () => {
      await result.current.deleteCard(1);
    });

    expect(result.current.cards).toEqual([sampleCard]); // unchanged
    expect(result.current.confirmState).toEqual({ open: false, cardId: null });
    expect(result.current.toast.type).toBe('error');
  });
});
