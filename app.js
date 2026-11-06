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
    links: [['Watch Vamos Tech Talks', 'https://www.mattandbibi.com/'], ['Connect on LinkedIn', 'https://linkedin.com/in/bibschan']]
  },
  about: {
    label: 'About / Bibiana Souza', title: 'An engineer’s mind. A community builder’s heart.',
    body: `<p>I’m Bibi, a software engineer and developer community builder based in Vancouver.</p><p>My work brings together hands-on engineering, developer education, open-source programs, and community leadership. I can talk implementation details with developers, then bring their experience back to product and engineering teams.</p><h3>Technical roots</h3><p>My engineering experience spans full-stack development, leading a team of four engineers, React and Next.js applications, API integrations, and agentic workflows. At Blossom, I led a React-to-Next.js migration that reduced initial load time by 2.8 seconds.</p><h3>Human connection</h3><p>I lead developer community programs at Interledger Foundation, serve as Board Vice President of Women in Tech Canada, and co-host Vamos Tech Talks.</p><p class="language-note">English / Português / Español</p>`,
    links: [['Experience on LinkedIn', 'https://linkedin.com/in/bibschan'], ['Let’s connect', 'https://linkedin.com/in/bibschan']]
  }
};

const eventPhotos = [
  { src: 'assets/community-speaking.webp', alt: 'Bibi speaking to a seated audience, holding a presentation remote.', caption: 'Sharing ideas with the technology community.' },
  { src: 'assets/women-in-tech-stage.webp', alt: 'A Women in Tech event in Vancouver, with Bibi on stage and the audience in the foreground.', caption: 'Women in Tech · Vancouver · February 2026' },
  { src: 'assets/fireside-panel.webp', alt: 'A fireside panel discussing women, creativity, and an agentic world.', caption: 'Fireside chat: Women leading creativity in an agentic world.' },
  { src: 'assets/community-gathering.webp', alt: 'Speakers addressing a seated audience at a community gathering.', caption: 'Bringing people together.' }
];

function createEventGallery() {
  const gallery = document.createElement('section');
  gallery.className = 'event-gallery';
  gallery.setAttribute('aria-label', 'Community event photographs');
  gallery.innerHTML = `<figure class="gallery-figure"><a class="gallery-full-image" target="_blank" rel="noopener noreferrer" aria-label="Open this event photo in a new tab"><img class="gallery-image" width="1600" height="1067" alt=""><span class="photo-expand" aria-hidden="true">↗</span></a><figcaption class="gallery-caption" aria-live="polite"></figcaption></figure><div class="gallery-toolbar"><div class="gallery-thumbnails" aria-label="Choose a photo"></div><div class="gallery-pagination"><button class="gallery-previous" type="button" aria-label="Previous photo">←</button><span class="gallery-counter"></span><button class="gallery-next" type="button" aria-label="Next photo">→</button></div></div>`;
  const image = gallery.querySelector('.gallery-image');
  const fullImage = gallery.querySelector('.gallery-full-image');
  const caption = gallery.querySelector('.gallery-caption');
  const counter = gallery.querySelector('.gallery-counter');
  const thumbnails = gallery.querySelector('.gallery-thumbnails');
  let selected = 0;
  const buttons = eventPhotos.map((photo, index) => {
    const button = document.createElement('button');
    button.className = 'gallery-thumbnail';
    button.type = 'button';
    button.setAttribute('aria-label', `Show photo ${index + 1}: ${photo.caption}`);
    button.innerHTML = `<img src="${photo.src}" alt="" loading="lazy" width="72" height="48">`;
    button.addEventListener('click', () => select(index));
    thumbnails.append(button);
    return button;
  });
  function select(index) {
    selected = (index + eventPhotos.length) % eventPhotos.length;
    const photo = eventPhotos[selected];
    image.src = photo.src;
    image.alt = photo.alt;
    fullImage.href = photo.src;
    caption.textContent = photo.caption;
    counter.textContent = `${selected + 1} / ${eventPhotos.length}`;
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === selected)));
  }
  gallery.querySelector('.gallery-previous').addEventListener('click', () => select(selected - 1));
  gallery.querySelector('.gallery-next').addEventListener('click', () => select(selected + 1));
  gallery.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      select(selected + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  select(0);
  return gallery;
}

const dialog = document.getElementById('detail-dialog');
const dialogContent = document.getElementById('dialog-content');
const dialogScroll = document.querySelector('.dialog-scroll');
let returnFocus;
let closeTimer = 0;

document.querySelectorAll('[data-dialog]').forEach(button => button.addEventListener('click', () => {
  const key = button.dataset.dialog;
  const item = cases[key];
  if (!item) return;
  returnFocus = button;
  clearTimeout(closeTimer);
  dialog.classList.remove('is-closing');
  dialog.classList.toggle('photo-dialog', key === 'connect');
  dialogContent.innerHTML = `<p class="eyebrow">${item.label}</p><h2 id="dialog-title">${item.title}</h2>${key === 'connect' ? '<div id="event-gallery-mount"></div>' : ''}${item.body}<div class="dialog-links">${item.links.map(([label, url]) => `<a class="button secondary" href="${url}" target="_blank" rel="noopener noreferrer">${label} <span aria-hidden="true">↗</span></a>`).join('')}</div>`;
  if (key === 'connect') document.getElementById('event-gallery-mount').append(createEventGallery());
  dialog.showModal();
  dialogScroll.scrollTop = 0;
  document.body.classList.add('dialog-open');
}));

function closeDetails() {
  if (!dialog.open || dialog.classList.contains('is-closing')) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { dialog.close(); return; }
  dialog.classList.add('is-closing');
  closeTimer = window.setTimeout(() => dialog.close(), 145);
}
document.querySelector('.dialog-close').addEventListener('click', closeDetails);
dialog.addEventListener('cancel', event => { event.preventDefault(); closeDetails(); });
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeDetails();
});
dialog.addEventListener('close', () => {
  clearTimeout(closeTimer);
  dialog.classList.remove('is-closing');
  document.body.classList.remove('dialog-open');
  returnFocus?.focus({ preventScroll: true });
});


// A short, visible breeze starts shortly after load, followed by a quiet pause.
// Separate rigid pieces hinge at their roots; the artwork is never distorted.
const illustration = document.getElementById('bibi-illustration');
const motionToggle = document.getElementById('motion-toggle');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let motionPaused = reducedMotion.matches;
const frontHair = document.getElementById('front-hair-motion');
const rightHair = document.getElementById('right-hair-motion');
const leftHair = document.getElementById('left-hair-motion');
const topLeaf = document.getElementById('top-leaf-motion');
const rightLeaf = document.getElementById('right-leaf-motion');
const leftLeaf = document.getElementById('left-leaf-motion');
const broadLeaf = document.getElementById('broad-leaf-motion');
const upperRightLeaf = document.getElementById('upper-right-leaf-motion');
let breezeFrame = 0;
let breezeStartedAt = 0;
let lastBreezeFrame = 0;
let heroVisible = true;
let previousHair = '';
let previousLeaves = '';

function setBreeze(hair, leaves) {
  const hairValue = (hair / 42).toFixed(3);
  const leafValue = (leaves / 65).toFixed(3);
  if (hairValue !== previousHair) {
    frontHair.setAttribute('transform', `rotate(${(hair / 42 * 2.25).toFixed(3)} 520 680)`);
    rightHair.setAttribute('transform', `rotate(${(-hair / 42 * 1.9).toFixed(3)} 842 548)`);
    leftHair.setAttribute('transform', `rotate(${(hair / 42 * 1.8).toFixed(3)} 344 625)`);
  }
  if (leafValue !== previousLeaves) {
    topLeaf.setAttribute('transform', `rotate(${(leaves / 65 * 4.2).toFixed(3)} 344 950)`);
    rightLeaf.setAttribute('transform', `rotate(${(-leaves / 65 * 3.5).toFixed(3)} 365 957)`);
    leftLeaf.setAttribute('transform', `rotate(${(leaves / 65 * 3.6).toFixed(3)} 92 995)`);
    broadLeaf.setAttribute('transform', `rotate(${(-leaves / 65 * 3.4).toFixed(3)} 211 933)`);
    upperRightLeaf.setAttribute('transform', `rotate(${(leaves / 65 * 3.1).toFixed(3)} 395 958)`);
  }
  previousHair = hairValue;
  previousLeaves = leafValue;
}

function animateBreeze(now) {
  if (motionPaused || document.hidden || !heroVisible) return;
  // Cap updates at 30 fps and leave each piece still during the rest period.
  if (now - lastBreezeFrame >= 32) {
    lastBreezeFrame = now;
    const phase = ((now - breezeStartedAt) / 1000) % 12;
    const progress = Math.max(0, Math.min(1, (phase - 0.35) / 5));
    const gust = Math.sin(Math.PI * progress) ** 2;
    const hair = gust * (Math.sin(phase * 1.65) * 42 + Math.sin(phase * 2.8) * 8);
    const leaves = gust * (Math.sin(phase * 1.65 - 0.35) * 65 + Math.sin(phase * 3.1) * 9);
    setBreeze(hair, leaves);
  }
  breezeFrame = requestAnimationFrame(animateBreeze);
}

function updateMotion() {
  cancelAnimationFrame(breezeFrame);
  const paused = motionPaused || document.hidden || !heroVisible;
  setBreeze(0, 0);
  illustration.dataset.breezeState = paused ? 'paused' : 'playing';
  if (!paused) {
    breezeStartedAt = performance.now();
    lastBreezeFrame = 0;
    breezeFrame = requestAnimationFrame(animateBreeze);
  }
  motionToggle.textContent = motionPaused ? 'Enable breeze' : 'Pause breeze';
  motionToggle.setAttribute('aria-pressed', String(!motionPaused));
  motionToggle.hidden = false;
}
motionToggle.addEventListener('click', () => { motionPaused = !motionPaused; updateMotion(); });
reducedMotion.addEventListener('change', () => { motionPaused = reducedMotion.matches; updateMotion(); });
document.addEventListener('visibilitychange', updateMotion);
if ('IntersectionObserver' in window) {
  new IntersectionObserver(entries => {
    const visible = entries[0].isIntersecting;
    if (visible !== heroVisible) { heroVisible = visible; updateMotion(); }
  }).observe(illustration);
}
updateMotion();
