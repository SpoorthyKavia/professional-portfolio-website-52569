/**
 * Minimal API client for the portfolio backend.
 * Uses REACT_APP_API_BASE_URL when provided; otherwise defaults to localhost:3001.
 */

const API_BASE =
  process.env.REACT_APP_API_BASE_URL ||
  'http://localhost:3001';

// PUBLIC_INTERFACE
export async function fetchPortfolio() {
  /** Fetches portfolio payload from backend. */
  const res = await fetch(`${API_BASE}/api/portfolio`);
  if (!res.ok) {
    throw new Error(`Failed to load portfolio (${res.status})`);
  }
  return res.json();
}

// PUBLIC_INTERFACE
export async function submitContact(payload) {
  /** Submits contact form payload to backend. */
  const res = await fetch(`${API_BASE}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.message || `Request failed (${res.status})`;
    const err = new Error(message);
    err.details = data?.details;
    throw err;
  }
  return data;
}
