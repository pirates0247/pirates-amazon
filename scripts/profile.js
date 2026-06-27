import { getCurrentUser } from './ensureAuth.js';

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '<')
    .replaceAll('>', '>')
    .replaceAll('"', '"')
    .replaceAll("'", '&#039;');
}

function renderProfile(el, user) {
  if (!el) return;

  if (!user) {
    el.innerHTML = `
      <a class="header-profile-link" href="login.html">Login</a>
    `;
    return;
  }

  const email = user.email || '';
  const fullName = user.fullName || '';

  const displayEmailOrName = fullName || email;

  el.innerHTML = `
    <div class="header-profile-user">
      <span class="header-profile-email">${escapeHtml(displayEmailOrName)}</span>
      <button type="button" class="header-profile-logout js-header-logout-btn">Logout</button>
    </div>
  `;



  const logoutBtn = el.querySelector('.js-header-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      try {
        localStorage.setItem('session', JSON.stringify(null));
      } catch {
        // ignore
      }
      window.location.reload();
    });
  }
}

function init() {
  const el = document.getElementById('header-profile');
  const user = getCurrentUser();
  renderProfile(el, user);
}

try {
  init();
} catch {
  // best-effort
}

