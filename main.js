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
══════════════════════════════════════ */
const html     = document.documentElement;
const themeBtn = document.getElementById('theme-btn');
const overlay  = document.getElementById('theme-overlay');
const iconSun  = document.getElementById('icon-sun');
const iconMoon = document.getElementById('icon-moon');
let isDark     = true;
let switching  = false;

function updateThemeIcon() {
  if (isDark) {
    // dark mode → show sun (to switch to light)
    iconSun.style.display  = 'block';
    iconMoon.style.display = 'none';
  } else {
    // light mode → show moon (to switch to dark)
    iconSun.style.display  = 'none';
    iconMoon.style.display = 'block';
  }
}

themeBtn.addEventListener('click', () => {
  if (switching) return;
  switching = true;

  isDark = !isDark;
  const newTheme = isDark ? 'dark' : 'light';

  // Ripple origin = button center
  const rect = themeBtn.getBoundingClientRect();
  const ox   = (rect.left + rect.width  / 2).toFixed(1);
  const oy   = (rect.top  + rect.height / 2).toFixed(1);

  html.classList.add('theme-switching');

  if (document.startViewTransition) {
    html.style.setProperty('--vt-x', ox + 'px');
    html.style.setProperty('--vt-y', oy + 'px');

    const t = document.startViewTransition(() => {
      html.setAttribute('data-theme', newTheme);
      updateThemeIcon();
    });

    t.ready.then(() => {
      requestAnimationFrame(() => {
        html.classList.remove('theme-switching');
      });
    });

    t.finished.then(() => { switching = false; });
    return;
  }

  // Fallback overlay
  overlay.style.setProperty('--ox', ox + 'px');
  overlay.style.setProperty('--oy', oy + 'px');

  html.setAttribute('data-theme', newTheme);
  updateThemeIcon();

  overlay.getBoundingClientRect();
  overlay.classList.add('expanding');

  setTimeout(() => {
    overlay.classList.remove('expanding');
    html.classList.remove('theme-switching');
    switching = false;
  }, 580);
});

/* ══════════════════════════════════════
   3. MARQUEE — inline SVG tech icons
══════════════════════════════════════ */

// SVG icon strings for each tech
const techIcons = {
  html5: `<svg viewBox="0 0 24 24" width="14" height="14" fill="#E34F26"><path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z"/></svg>`,
  css3: `<svg viewBox="0 0 24 24" width="14" height="14" fill="#1572B6"><path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622 10.125.002-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.855L12 19.288l5.373-1.53L18.59 4.414v-.001z"/></svg>`,
  js: `<svg viewBox="0 0 24 24" width="14" height="14" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" fill="#F7DF1E"/><text x="14.5" y="19" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="11" fill="#000000">JS</text></svg>`,
  python: `<svg viewBox="0 0 24 24" width="14" height="14"><defs><linearGradient id="mq-py1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#387EB8"/><stop offset="100%" stop-color="#366994"/></linearGradient><linearGradient id="mq-py2" x1="1" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="#FFE052"/><stop offset="100%" stop-color="#FFC331"/></linearGradient></defs><path d="M11.914.072C5.976.072 6.33 2.664 6.33 2.664l.007 2.676h5.682v.804H4.086S.072 5.68.072 11.683c0 6.004 3.527 5.79 3.527 5.79h2.106v-2.785s-.113-3.527 3.47-3.527h5.98s3.354.054 3.354-3.24V3.604S18.95.072 11.914.072zm-3.327 1.93a1.085 1.085 0 1 1 0 2.17 1.085 1.085 0 0 1 0-2.17z" fill="url(#mq-py1)"/><path d="M12.086 23.928c5.938 0 5.584-2.592 5.584-2.592l-.007-2.676h-5.682v-.804h7.933s4.014.464 4.014-5.539c0-6.004-3.527-5.79-3.527-5.79h-2.106v2.785s.113 3.527-3.47 3.527h-5.98s-3.354-.054-3.354 3.24v5.157S5.05 23.928 12.086 23.928zm3.327-1.93a1.085 1.085 0 1 1 0-2.17 1.085 1.085 0 0 1 0 2.17z" fill="url(#mq-py2)"/></svg>`,
  nodejs: `<svg viewBox="0 0 24 24" width="14" height="14" fill="#339933"><path d="M11.998 24c-.321 0-.641-.084-.922-.247l-2.936-1.737c-.438-.245-.224-.332-.08-.383.585-.203.703-.25 1.328-.604.066-.037.152-.023.217.017l2.256 1.339c.082.045.198.045.275 0l8.795-5.076c.082-.047.134-.141.134-.238V6.921c0-.099-.052-.19-.137-.24l-8.791-5.073c-.082-.047-.19-.047-.271 0L3.075 6.68c-.087.05-.141.143-.141.241v10.15c0 .097.054.189.139.235l2.409 1.392c1.307.654 2.108-.116 2.108-.891V7.787c0-.142.114-.253.256-.253h1.115c.139 0 .255.111.255.253v10.021c0 1.745-.95 2.745-2.604 2.745-.508 0-.909 0-2.026-.551L2.28 18.675C1.728 18.368 1.38 17.775 1.38 17.133V6.921c0-.643.348-1.234.906-1.548L11.07.299c.545-.301 1.268-.301 1.81 0l8.782 5.074c.557.314.907.905.907 1.548v10.212c0 .642-.35 1.231-.907 1.547l-8.782 5.074c-.28.162-.6.246-.882.246zm2.715-7.001c-3.851 0-4.659-1.767-4.659-3.252 0-.142.114-.253.257-.253h1.136c.127 0 .233.092.253.217.172 1.161.683 1.747 3.018 1.747 1.858 0 2.648-.42 2.648-1.407 0-.568-.226-.99-3.112-1.273-2.413-.238-3.906-.773-3.906-2.706 0-1.782 1.503-2.843 4.021-2.843 2.826 0 4.228.981 4.403 3.088.008.07-.019.139-.065.189-.046.05-.112.079-.18.079h-1.14c-.12 0-.226-.086-.25-.204-.276-1.221-.95-1.613-2.768-1.613-2.039 0-2.275.71-2.275 1.241 0 .645.28.832 3.014 1.195 2.706.359 4.002.866 4.002 2.767-.002 1.927-1.606 3.027-4.395 3.027z"/></svg>`,
  sql: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v4c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M3 9v4c0 1.66 4.03 3 9 3s9-1.34 9-3V9"/><path d="M3 13v4c0 1.66 4.03 3 9 3s9-1.34 9-3v-4"/></svg>`,
  docker: `<svg viewBox="0 0 24 24" width="14" height="14" fill="#2496ED"><path d="M13.983 11.078h2.119a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.119a.185.185 0 0 0-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 0 0 .186-.186V3.574a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 0 0 .186-.186V6.29a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 0 0 .184-.186V6.29a.185.185 0 0 0-.185-.185H8.1a.185.185 0 0 0-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 0 0 .185-.186V6.29a.185.185 0 0 0-.185-.185H5.136a.186.186 0 0 0-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.118a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 0 0 .184-.185V9.006a.185.185 0 0 0-.184-.186h-2.12a.185.185 0 0 0-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 0 0 .185-.185V9.006a.185.185 0 0 0-.184-.186h-2.12a.186.186 0 0 0-.186.185v1.888c0 .102.084.185.186.185m-2.92 0h2.12a.185.185 0 0 0 .184-.185V9.006a.185.185 0 0 0-.184-.186h-2.12a.185.185 0 0 0-.184.185v1.888c0 .102.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 0 0-.75.748 11.376 11.376 0 0 0 .692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983.003 1.963-.086 2.93-.266a12.248 12.248 0 0 0 3.823-1.389c.98-.567 1.86-1.288 2.61-2.136 1.252-1.418 1.998-2.997 2.553-4.4h.221c1.372 0 2.215-.549 2.68-1.009.309-.293.55-.65.707-1.046l.098-.288Z"/></svg>`,
  git: `<svg viewBox="0 0 24 24" width="14" height="14" fill="#F05032"><path d="M23.546 10.93L13.067.452a1.55 1.55 0 0 0-2.188 0L8.708 2.627l2.76 2.76a1.838 1.838 0 0 1 2.327 2.341l2.658 2.66a1.838 1.838 0 0 1 1.9 3.039 1.837 1.837 0 0 1-2.6 0 1.846 1.846 0 0 1-.404-1.996L12.86 9.047v6.567a1.837 1.837 0 0 1 .484 3.548 1.837 1.837 0 0 1-2.319-1.769 1.837 1.837 0 0 1 1.167-1.704V8.978a1.843 1.843 0 0 1-.998-2.417L8.467 3.844.454 11.86a1.55 1.55 0 0 0 0 2.187l10.48 10.478a1.549 1.549 0 0 0 2.186 0l10.426-10.424a1.55 1.55 0 0 0 0-2.171"/></svg>`,
  github: `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>`,
  vscode: `<svg viewBox="0 0 24 24" width="14" height="14" fill="#007ACC"><path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z"/></svg>`,
  figma: `<svg viewBox="0 0 24 24" width="14" height="14"><path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z" fill="#F24E1E"/><path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z" fill="#FF7262"/><path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" fill="#1ABCFE"/><path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z" fill="#0ACF83"/><path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z" fill="#A259FF"/></svg>`,
  linux: `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.09-2.346 2.794-2.784 4.566-.13.516-.158 1.225-.055 1.994.032.255.088.516.155.78.517 1.904 2.088 3.525 4.208 4.39.48.196 1.73.673 2.23.673.499 0 1.747-.477 2.226-.673 2.12-.865 3.69-2.486 4.208-4.39.068-.264.124-.525.155-.78.103-.769.076-1.478-.054-1.994-.438-1.772-1.9-3.476-2.785-4.566-.75-1.067-.973-1.928-1.049-3.02-.065-1.49 1.057-5.964-3.17-6.298-.165-.013-.325-.021-.48-.021zm0 2.66c.573 0 1.12.182 1.558.51.4.303.66.73.746 1.207.068.374.068.752.068 1.128v.01c0 .376 0 .754-.068 1.128-.085.477-.346.904-.746 1.207-.439.328-.985.51-1.558.51s-1.12-.182-1.558-.51c-.4-.303-.66-.73-.746-1.207-.068-.374-.068-.752-.068-1.128v-.01c0-.376 0-.754.068-1.128.085-.477.346-.904.746-1.207.439-.328.985-.51 1.558-.51z"/></svg>`,
};

const techs = [
  { name: 'HTML5',      icon: techIcons.html5  },
  { name: 'CSS3',       icon: techIcons.css3   },
  { name: 'JavaScript', icon: techIcons.js     },
  { name: 'Python',     icon: techIcons.python },
  { name: 'Node.js',    icon: techIcons.nodejs },
  { name: 'SQL',        icon: techIcons.sql    },
  { name: 'Docker',     icon: techIcons.docker },
  { name: 'Git',        icon: techIcons.git    },
  { name: 'GitHub',     icon: techIcons.github },
  { name: 'VS Code',    icon: techIcons.vscode },
  { name: 'Figma',      icon: techIcons.figma  },
  { name: 'Linux',      icon: techIcons.linux  },
];

function buildMarquee() {
  const track = document.getElementById('marquee-track');
  if (!track) return;

  // Build two identical sets so we can loop seamlessly
  [0, 1].forEach(() => {
    techs.forEach((t, i) => {
      const item = document.createElement('span');
      item.className = 'marquee-item';
      item.innerHTML = `${t.icon} ${t.name}`;
      track.appendChild(item);

      if (i < techs.length - 1) {
        const sep = document.createElement('span');
        sep.className   = 'marquee-sep';
        sep.textContent = '·';
        track.appendChild(sep);
      }
    });
    const gap = document.createElement('span');
    gap.className = 'marquee-sep';
    gap.innerHTML = '&nbsp;&nbsp;&nbsp;';
    track.appendChild(gap);
  });

  // Disable any CSS animation — we drive it with RAF
  track.style.animation = 'none';
  track.style.willChange = 'transform';

  const speed = 0.3; // px per frame
  let pos = 0;

  requestAnimationFrame(() => {
    const halfWidth = track.scrollWidth / 2;

    function tick() {
      pos += speed;
      if (pos >= halfWidth) pos -= halfWidth; // seamless instant reset
      track.style.transform = `translateX(-${pos}px)`;
      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
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
      revealObserver.unobserve(entry.target);
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
}, { passive: true });

if ('fonts' in document) {
  document.fonts.ready.then(() => {
    document.body.classList.add('fonts-loaded');
  });
}
