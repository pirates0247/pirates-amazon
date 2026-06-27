function getFlag() {
  try {
    return JSON.parse(localStorage.getItem('loginSuccessMessage') || 'null');
  } catch {
    return null;
  }
}

function clearFlag() {
  try {
    localStorage.setItem('loginSuccessMessage', JSON.stringify(null));
  } catch {
    // ignore
  }
}

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '<')
    .replaceAll('>', '>')
    .replaceAll('"', '"')
    .replaceAll("'", '&#039;');
}

function init() {
  const banner = document.querySelector('.js-login-success-banner');
  if (!banner) return;

  const flag = getFlag();
  if (!flag) return;

  const msg = flag.message || 'Login successful';
  banner.innerHTML = `
    <div class="login-success-banner-title">${escapeHtml(msg)}</div>
    <div class="login-success-banner-subtitle">Redirected to your homepage.</div>
  `;

  banner.hidden = false;
  clearFlag();
}

try {
  init();
} catch {
  // best-effort
}

