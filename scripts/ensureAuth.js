// Optional helper for other pages.
// Current app uses localStorage session set by scripts/login.js.

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('session'));
  } catch {
    return null;
  }
}

