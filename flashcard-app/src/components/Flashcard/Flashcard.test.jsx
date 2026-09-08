import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Flashcard from './Flashcard';

const card = { id: 1, question: 'What is 2+2?', answer: '4', category: 'Maths' };

describe('Flashcard', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows the question and no countdown before flipping', () => {
    render(<Flashcard card={card} onEdit={vi.fn()} onDelete={vi.fn()} onDeleteRequest={vi.fn()} />);
    expect(screen.getByText('What is 2+2?')).toBeInTheDocument();
    expect(screen.queryByLabelText(/card deletes in/i)).not.toBeInTheDocument();
  });

  it('starts a 10s countdown on click', () => {
    render(<Flashcard card={card} onEdit={vi.fn()} onDelete={vi.fn()} onDeleteRequest={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /flashcard: what is 2\+2\?/i }));

    expect(screen.getByLabelText('Card deletes in 10 seconds')).toBeInTheDocument();
  });

  it('ticks the countdown down over time and does not restart it on a second click', () => {
    render(<Flashcard card={card} onEdit={vi.fn()} onDelete={vi.fn()} onDeleteRequest={vi.fn()} />);
    const wrapper = screen.getByRole('button', { name: /flashcard: what is 2\+2\?/i });

    fireEvent.click(wrapper);
    for (let i = 0; i < 3; i++) act(() => vi.advanceTimersByTime(1000)); // 10 -> 7, one tick at a time
    fireEvent.click(wrapper); // second click on an already-flipped card is a no-op

    expect(screen.getByLabelText('Card deletes in 7 seconds')).toBeInTheDocument();
  });

  it('counts down to zero and calls onDelete after the fade-out', () => {
    const onDelete = vi.fn();
    render(<Flashcard card={card} onEdit={vi.fn()} onDelete={onDelete} onDeleteRequest={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /flashcard: what is 2\+2\?/i }));

    for (let i = 0; i < 10; i++) act(() => vi.advanceTimersByTime(1000)); // countdown 10 -> 0, one tick at a time
    expect(onDelete).not.toHaveBeenCalled(); // fade-out hasn't completed yet

    act(() => vi.advanceTimersByTime(450)); // fade-out delay
    expect(onDelete).toHaveBeenCalledWith(1);
  });

  it('calls onEdit/onDeleteRequest without flipping the card', () => {
    const onEdit = vi.fn();
    const onDeleteRequest = vi.fn();
    render(<Flashcard card={card} onEdit={onEdit} onDelete={vi.fn()} onDeleteRequest={onDeleteRequest} />);

    fireEvent.click(screen.getByLabelText('Edit card'));
    fireEvent.click(screen.getByLabelText('Delete card'));

    expect(onEdit).toHaveBeenCalledWith(card);
    expect(onDeleteRequest).toHaveBeenCalledWith(1);
    expect(screen.queryByLabelText(/card deletes in/i)).not.toBeInTheDocument(); // still not flipped
  });
});
