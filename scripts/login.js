const USERS_KEY = 'users';
const SESSION_KEY = 'session';
const LOGIN_LOG_KEY = 'loginLog';

function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

function setUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getSession() {
  return JSON.parse(localStorage.getItem(SESSION_KEY)) || null;
}

function setSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function getLoginLog() {
  return JSON.parse(localStorage.getItem(LOGIN_LOG_KEY)) || [];
}

function addLoginLog(entry) {
  const log = getLoginLog();
  log.unshift(entry);
  localStorage.setItem(LOGIN_LOG_KEY, JSON.stringify(log.slice(0, 20)));
}

function formatTime(ts) {
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return String(ts);
  }
}

function showError(el, msg) {
  if (!el) return;
  el.textContent = msg;
  el.hidden = !msg;
}

function renderLoginHistory(listEl) {
  if (!listEl) return;
  const log = getLoginLog();

  listEl.innerHTML = '';
  if (!log.length) return;

  log.forEach((item) => {
    const div = document.createElement('div');
    div.className = 'login-history-item';
    div.textContent = `${item.email} logged in at ${formatTime(item.time)}`;
    listEl.appendChild(div);
  });
}

function initLoggedInUI() {
  const session = getSession();
  const banner = document.querySelector('.js-logged-in');
  const emailEl = document.querySelector('.js-current-user-email');
  const lastLoginEl = document.querySelector('.js-last-login-time');

  // Hide login history by default (so it doesn’t show “who logged in” on the page)
  // If you still want it later, re-enable this block.
  const historyPanel = document.querySelector('.login-history');
  if (historyPanel) {
    historyPanel.hidden = true;
  }


  if (!session) return;

  if (banner) banner.hidden = false;
  if (emailEl) emailEl.textContent = session.email || '';
  if (lastLoginEl) lastLoginEl.textContent = formatTime(session.lastLoginTime);

  const logoutBtn = document.querySelector('.js-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      setSession(null);
      window.location.reload();
    });
  }
}

function handleLogin() {
  const form = document.querySelector('.js-login-form');
  if (!form) return;

  const errorEl = document.querySelector('.js-login-error');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const fd = new FormData(form);
    const email = String(fd.get('email') || '').trim().toLowerCase();
    const password = String(fd.get('password') || '');

    const users = getUsers();
    const found = users.find((u) => u.email === email);

    if (!found || found.password !== password) {
      showError(errorEl, 'Invalid email or password');
      return;
    }

    showError(errorEl, '');

    const now = Date.now();
    setSession({
      email,
      lastLoginTime: now
    });

    addLoginLog({
      email,
      time: now
    });

    // Show success message on the homepage after redirect
    try {
      localStorage.setItem(
        'loginSuccessMessage',
        JSON.stringify({ message: 'Login successful' })
      );
    } catch {
      // ignore
    }

    window.location.href = 'index.html';
    return;
  });
}


function handleSignup() {
  const form = document.querySelector('.js-signup-form');
  if (!form) return;

  const errorEl = document.querySelector('.js-signup-error');
  const successBox = document.querySelector('.js-signup-success');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const fd = new FormData(form);
    const email = String(fd.get('email') || '').trim().toLowerCase();
    const password = String(fd.get('password') || '');
    const fullName = String(fd.get('fullName') || '').trim();

    if (!email || !password) {
      showError(errorEl, 'Please enter email and password');
      return;
    }

    const users = getUsers();
    const exists = users.some((u) => u.email === email);

    if (exists) {
      showError(errorEl, 'Email already exists');
      return;
    }

    users.push({
      email,
      password,
      fullName,
      createdAt: Date.now()
    });

    setUsers(users);
    showError(errorEl, '');

    if (successBox) successBox.hidden = false;

    form.reset();
  });
}

try {
  initLoggedInUI();
  handleLogin();
  handleSignup();
} catch (err) {
  // Best-effort: surface the error on both pages
  const msg = err?.message ? String(err.message) : String(err);
  const loginErrorEl = document.querySelector('.js-login-error');
  const signupErrorEl = document.querySelector('.js-signup-error');
  if (loginErrorEl) showError(loginErrorEl, msg);
  if (signupErrorEl) showError(signupErrorEl, msg);
  // Also log for debugging
  console.error(err);
}


