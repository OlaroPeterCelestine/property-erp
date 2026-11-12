(function () {
  const Auth = window.PropertyERPAuth;
  if (!Auth) return;

  // Already signed in → dashboard
  if (Auth.isAuthed()) {
    window.location.replace('index.html');
    return;
  }

  const form = document.getElementById('login-form');
  const email = document.getElementById('login-email');
  const password = document.getElementById('login-password');
  const toggle = document.getElementById('toggle-password');
  const eye = document.getElementById('eye-icon');
  const hint = document.getElementById('login-hint');
  const google = document.getElementById('google-signin');
  const forgot = document.getElementById('forgot-password');
  const join = document.getElementById('join-free');

  function showHint(text) {
    if (!hint) return;
    hint.hidden = false;
    hint.textContent = text;
  }

  function enter(identity) {
    Auth.login(identity);
    showHint('Signed in — opening your portfolio…');
    window.location.href = 'index.html';
  }

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    // Demo: any email/password (including empty) works
    enter(email?.value || 'demo@propertyerp.ug');
  });

  google?.addEventListener('click', () => {
    enter('google.user@propertyerp.ug');
  });

  forgot?.addEventListener('click', () => {
    showHint('Demo mode — enter anything (or leave blank) and tap Sign In.');
  });

  join?.addEventListener('click', () => {
    showHint('Demo mode — no signup needed. Sign in with any details.');
    email?.focus();
  });

  toggle?.addEventListener('click', () => {
    if (!password) return;
    const show = password.type === 'password';
    password.type = show ? 'text' : 'password';
    if (eye) {
      eye.className = `hgi-stroke ${show ? 'hgi-view-off-slash' : 'hgi-view'} text-[16px]`;
    }
    toggle.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
  });

  // Showcase carousel
  let slide = 0;
  const slides = [...document.querySelectorAll('.login-slide')];
  const dots = [...document.querySelectorAll('#login-dots button')];

  function go(n) {
    slide = (n + slides.length) % slides.length;
    slides.forEach((el, i) => {
      const on = i === slide;
      el.hidden = !on;
      el.classList.toggle('is-active', on);
    });
    dots.forEach((d, i) => d.classList.toggle('is-active', i === slide));
  }

  dots.forEach((d) => {
    d.addEventListener('click', () => go(Number(d.dataset.dot || 0)));
  });

  setInterval(() => go(slide + 1), 5200);
})();
