
/* ══════════════════════════════════════
   1. SCROLL PROGRESS BAR
══════════════════════════════════════ */
const progressBar = document.getElementById('progress');

function updateProgress() {
  const scrolled = window.scrollY;
  const total    = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (scrolled / total * 100).toFixed(1) + '%';
}

/* ══════════════════════════════════════
   2. THEME TOGGLE — zero-jank ripple
   Strategy:
   - add .theme-switching to kill all transitions instantly
   - set CSS vars for ripple origin
   - startViewTransition applies new theme under the ripple
   - remove .theme-switching after transition ends
══════════════════════════════════════ */
const html     = document.documentElement;
const themeBtn = document.getElementById('theme-btn');
const overlay  = document.getElementById('theme-overlay');
let isDark     = true;
let switching  = false;

themeBtn.addEventListener('click', () => {
  if (switching) return;
  switching = true;

  isDark = !isDark;
  const newTheme = isDark ? 'dark' : 'light';
  const emoji    = isDark ? '☀️' : '🌙';

  // Ripple origin = button center
  const rect = themeBtn.getBoundingClientRect();
  const ox   = (rect.left + rect.width  / 2).toFixed(1);
  const oy   = (rect.top  + rect.height / 2).toFixed(1);

  // Kill all element transitions instantly (prevents 31 simultaneous repaints)
  html.classList.add('theme-switching');

  // ── View Transitions API (Chrome 111+) ──────────────
  if (document.startViewTransition) {
    html.style.setProperty('--vt-x', ox + 'px');
    html.style.setProperty('--vt-y', oy + 'px');

    const t = document.startViewTransition(() => {
      html.setAttribute('data-theme', newTheme);
      themeBtn.textContent = emoji;
    });

    t.ready.then(() => {
      // Re-enable transitions after new frame is painted
      requestAnimationFrame(() => {
        html.classList.remove('theme-switching');
      });
    });

    t.finished.then(() => { switching = false; });
    return;
  }

  // ── Fallback: overlay scale (Firefox / Safari) ──────
  overlay.style.setProperty('--ox', ox + 'px');
  overlay.style.setProperty('--oy', oy + 'px');

  // Snap to new theme color, then animate
  html.setAttribute('data-theme', newTheme);
  themeBtn.textContent = emoji;

  // Force style recalc before adding transition class
  overlay.getBoundingClientRect();
  overlay.classList.add('expanding');

  setTimeout(() => {
    overlay.classList.remove('expanding');
    html.classList.remove('theme-switching');
    switching = false;
  }, 580);
});

/* ══════════════════════════════════════
   3. MARQUEE — infinite scrolling tech strip
══════════════════════════════════════ */
const techs = [
  { name: 'HTML5',      icon: '🌐' },
  { name: 'CSS3',       icon: '🎨' },
  { name: 'JavaScript', icon: '⚡' },
  { name: 'Python',     icon: '🐍' },
  { name: 'Node.js',    icon: '🟢' },
  { name: 'SQL',        icon: '🗄️' },
  { name: 'Docker',     icon: '🐳' },
  { name: 'Git',        icon: '🔀' },
  { name: 'GitHub',     icon: '🐙' },
  { name: 'VS Code',    icon: '💻' },
  { name: 'Figma',      icon: '🖌️' },
  { name: 'Linux',      icon: '🐧' },
];

function buildMarquee() {
  const track = document.getElementById('marquee-track');
  if (!track) return;

  // Duplicate twice so seamless loop works at any screen width
  [0, 1].forEach(() => {
    techs.forEach((t, i) => {
      const item = document.createElement('span');
      item.className   = 'marquee-item';
      item.textContent = `${t.icon} ${t.name}`;
      track.appendChild(item);

      if (i < techs.length - 1) {
        const sep = document.createElement('span');
        sep.className   = 'marquee-sep';
        sep.textContent = '·';
        track.appendChild(sep);
      }
    });
    // gap between the two copies
    const gap = document.createElement('span');
    gap.className = 'marquee-sep';
    gap.innerHTML = '&nbsp;&nbsp;&nbsp;';
    track.appendChild(gap);
  });
}

buildMarquee();

/* ══════════════════════════════════════
   4. SCROLL REVEAL (IntersectionObserver)
══════════════════════════════════════ */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target); // fire only once
    }
  });
}, { threshold: 0.05, rootMargin: "0px 0px -20px 0px" });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ══════════════════════════════════════
   5. ACTIVE NAV HIGHLIGHT on scroll
══════════════════════════════════════ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

function highlightNav() {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 80) current = s.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}

/* ══════════════════════════════════════
   6. UNIFIED SCROLL HANDLER
   Uses passive listener + RAF — zero blocking
══════════════════════════════════════ */
let ticking = false;

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateProgress();
      highlightNav();
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true }); /* passive: true tells browser no preventDefault → smoother scroll */

/* Preload fonts to avoid FOUT causing layout shifts */
if ('fonts' in document) {
  document.fonts.ready.then(() => {
    document.body.classList.add('fonts-loaded');
  });
}
