
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
   2. THEME TOGGLE — circular ripple from button
══════════════════════════════════════ */
const html     = document.documentElement;
const themeBtn = document.getElementById('theme-btn');
const overlay  = document.getElementById('theme-overlay');
let isDark     = true;
let switching  = false;  // prevent double-click glitch

themeBtn.addEventListener('click', () => {
  if (switching) return;
  switching = true;

  isDark = !isDark;
  const newTheme = isDark ? 'dark' : 'light';
  const emoji    = isDark ? '☀️' : '🌙';

  // Get button center coordinates for ripple origin
  const rect = themeBtn.getBoundingClientRect();
  const ox = rect.left + rect.width  / 2;
  const oy = rect.top  + rect.height / 2;

  // ── View Transitions API (Chrome 111+) ──────────────
  if (document.startViewTransition) {
    // Set ripple origin BEFORE starting transition
    html.style.setProperty('--vt-x', ox + 'px');
    html.style.setProperty('--vt-y', oy + 'px');

    const transition = document.startViewTransition(() => {
      html.setAttribute('data-theme', newTheme);
      themeBtn.textContent = emoji;
    });

    transition.finished.then(() => { switching = false; });
    return;
  }

  // ── Fallback: scale-up overlay (Firefox / Safari) ───
  // Position overlay at button center
  overlay.style.setProperty('--ox', ox + 'px');
  overlay.style.setProperty('--oy', oy + 'px');

  // Force the overlay to the NEW theme color
  // Temporarily set attribute so CSS picks correct bg color
  html.setAttribute('data-theme', newTheme);

  // Reset scale without transition, then animate in
  overlay.style.transition = 'none';
  overlay.classList.remove('expanding');
  void overlay.offsetWidth; // reflow

  overlay.style.transition = '';
  overlay.classList.add('expanding');
  themeBtn.textContent = emoji;

  // After animation, remove overlay
  setTimeout(() => {
    overlay.classList.remove('expanding');
    switching = false;
  }, 650);
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
   6. UNIFIED SCROLL HANDLER (RAF throttle)
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
});
