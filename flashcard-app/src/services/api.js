// Base URL is read from the Vite environment variable VITE_API_URL.
// Default falls back to localhost:8000 for local development.
const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail ?? 'Request failed');
  }
  // 204 No Content has no body
  if (res.status === 204) return;
  return res.json();
}

// Read
export const getCards = () => request('/cards/');

// Create
export const createCard = (data) =>
  request('/cards/', { method: 'POST', body: JSON.stringify(data) });

// Update
export const updateCard = (id, data) =>
  request(`/cards/${id}`, { method: 'PUT', body: JSON.stringify(data) });

// Delete
export const deleteCard = (id) =>
  request(`/cards/${id}`, { method: 'DELETE' });
