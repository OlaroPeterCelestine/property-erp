(function () {
  const KEY = 'property_erp_session';

  function read() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || 'null');
    } catch {
      return null;
    }
  }

  function write(session) {
    localStorage.setItem(KEY, JSON.stringify(session));
  }

  function clear() {
    localStorage.removeItem(KEY);
  }

  function isAuthed() {
    const s = read();
    return !!(s && s.authed);
  }

  function login(identity) {
    const email = String(identity || '').trim() || 'demo@propertyerp.ug';
    const base = email.includes('@') ? email.split('@')[0] : email;
    const name = base
      .replace(/[._-]+/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase()) || 'Demo User';
    const session = {
      authed: true,
      email,
      name,
      role: 'Director/Owner',
      at: new Date().toISOString(),
    };
    write(session);
    return session;
  }

  function logout() {
    clear();
    window.location.href = 'login.html';
  }

  function requireAuth() {
    if (isAuthed()) return true;
    window.location.replace('login.html');
    return false;
  }

  window.PropertyERPAuth = { login, logout, isAuthed, read, requireAuth, KEY };
})();
