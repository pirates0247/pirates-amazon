import { getCurrentUser } from './ensureAuth.js';

function redirectToLogin() {
  window.location.href = 'login.html';
}

const user = getCurrentUser();
if (!user) {
  redirectToLogin();
}

