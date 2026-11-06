'use strict';

const cases = {
  build: {
    label: 'Build / Developer tooling', title: 'Community signal hub',
    body: `<p>At Interledger Foundation, I built a custom TypeScript community signal hub and contribution leaderboard to make developer participation visible to the team.</p><p>Working with GitHub and Slack activity helps connect community conversations to the people building the product.</p><h3>From signals to useful feedback</h3><ul><li>Track developer engagement and repository activity to understand the impact of community programs.</li><li>Turn recurring questions into documentation improvements, program changes, and product feedback.</li><li>Share community insights in company-wide meetings to inform product and campaign direction.</li></ul>`,
    links: [['Explore my GitHub', 'https://github.com/bibschan'], ['Read my writing', 'https://dev.to/bibschan']]
  },
  teach: {
    label: 'Teach / Developer education', title: 'Learn by building.',
    body: `<p>I design practical learning experiences that help developers move from a new idea to a working implementation.</p><h3>Open Payments API workshop</h3><p>Designed and taught a hands-on workshop for university students. Approximately 50 students completed the workshop, working directly with the Open Payments API.</p><h3>Open Payments Learning Month</h3><p>A separate bilingual, gamified program reached 66 developers across 8+ countries, bringing learning and community participation together.</p><h3>Hacktoberfest 2026</h3><p>Led a campaign across 11 Interledger repositories. 29 contributors submitted 260 pull requests, with 127 merged.</p>`,
    links: [['Explore the workshop', 'https://github.com/bibschan/OP-workshop'], ['Technical writing', 'https://dev.to/bibschan']]
  },
  connect: {
    label: 'Connect / Community leadership', title: 'Communities that grow.',
    body: `<p>I love creating spaces where people feel welcome, find their voice, and keep coming back.</p><h3>Women in Tech® Canada</h3><p>Built the British Columbia chapter from zero as its first volunteer, growing it to 11 volunteers and 12 events reaching 2,000+ attendees. As Board Vice President, I support national events and coach provincial chapter heads.</p><h3>VanJS</h3><p>Helped revive Vancouver’s JavaScript meetup after it went dormant, growing monthly attendance to 100+ developers within a 5,000+ member community. Created and co-organized Super VanJS, a one-day developer conference.</p><h3>Vamos Tech Talks</h3><p>Co-host conversations with technology leaders about the ideas and experiences behind their work.</p>`,
    links: [['Watch Vamos Tech Talks', 'https://www.youtube.com/watch?v=1Qdh8q4pnDU'], ['Connect on LinkedIn', 'https://linkedin.com/in/bibschan']]
  },
  about: {
    label: 'About / Bibiana Souza', title: 'An engineer’s mind. A community builder’s heart.',
    body: `<p>I’m Bibi, a software engineer and developer community builder based in Vancouver.</p><p>My work brings together hands-on engineering, developer education, open-source programs, and community leadership. I can talk implementation details with developers, then bring their experience back to product and engineering teams.</p><h3>Technical roots</h3><p>My engineering experience spans full-stack development, leading a team of four engineers, React and Next.js applications, API integrations, and agentic workflows. At Blossom, I led a React-to-Next.js migration that reduced initial load time by 2.8 seconds.</p><h3>Human connection</h3><p>I lead developer community programs at Interledger Foundation, serve as Board Vice President of Women in Tech Canada, and co-host Vamos Tech Talks.</p><p class="language-note">English / Português / Español</p>`,
    links: [['Experience on LinkedIn', 'https://linkedin.com/in/bibschan'], ['Let’s connect', 'https://linkedin.com/in/bibschan']]
  }
};

const dialog = document.getElementById('detail-dialog');
const dialogContent = document.getElementById('dialog-content');
let returnFocus;
document.querySelectorAll('[data-dialog]').forEach(button => button.addEventListener('click', () => {
  const item = cases[button.dataset.dialog];
  if (!item) return;
  returnFocus = button;
  dialogContent.innerHTML = `<p class="eyebrow">${item.label}</p><h2 id="dialog-title">${item.title}</h2>${item.body}<div class="dialog-links">${item.links.map(([label, url]) => `<a class="button secondary" href="${url}">${label} <span aria-hidden="true">↗</span></a>`).join('')}</div>`;
  dialog.showModal();
  document.body.classList.add('dialog-open');
}));
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
dialog.addEventListener('close', () => { document.body.classList.remove('dialog-open'); returnFocus?.focus(); });

// A light, intermittent breeze affects only masked hair and leaf regions.
// The face, body, laptop and plant pot stay still.
const illustration = document.getElementById('bibi-illustration');
const motionToggle = document.getElementById('motion-toggle');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let motionPaused = reducedMotion.matches;
let animationsStarted = false;
function updateMotion() {
  const paused = motionPaused || reducedMotion.matches || document.hidden;
  if (!animationsStarted && !paused) {
    document.querySelectorAll('.breeze-animation').forEach(animation => animation.beginElement());
    animationsStarted = true;
  }
  if (paused) illustration.pauseAnimations(); else illustration.unpauseAnimations();
  motionToggle.textContent = paused ? 'Enable breeze' : 'Pause breeze';
  motionToggle.setAttribute('aria-pressed', String(!paused));
  motionToggle.hidden = reducedMotion.matches;
}
motionToggle.addEventListener('click', () => { motionPaused = !motionPaused; updateMotion(); });
reducedMotion.addEventListener('change', () => { motionPaused = reducedMotion.matches; updateMotion(); });
document.addEventListener('visibilitychange', updateMotion);
updateMotion();

const grid = document.getElementById('contributions');
// An explicitly labelled decorative fallback is used if no snapshot is available.
function drawContributions(days) {
  grid.replaceChildren(...days.map(day => {
    const square = document.createElement('span');
    square.className = 'contribution';
    square.dataset.level = String(day.level);
    if (day.date) square.title = `${day.date} · GitHub contribution level ${day.level} of 4`;
    return square;
  }));
}
const decorativePattern = Array.from({length: 147}, (_, i) => ({level: ((i * 7 + Math.floor(i / 7) * 3) % 17) < 8 ? 0 : (i * 11 % 4) + 1}));
drawContributions(decorativePattern);
document.getElementById('activity-caption').textContent = 'Illustrative contribution pattern';
fetch('assets/contributions.json').then(response => { if (!response.ok) throw new Error('No snapshot'); return response.json(); }).then(data => {
  if (!Array.isArray(data.days) || !data.days.length) return;
  drawContributions(data.days);
  document.getElementById('activity-caption').textContent = `GitHub snapshot · ${data.updated}`;
}).catch(() => { /* The labelled fallback keeps the panel useful when offline. */ });
