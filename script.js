const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const mobileMenu = document.querySelector('[data-mobile-menu]');
function closeMenu() {
  menuToggle?.setAttribute('aria-expanded', 'false');
  menuToggle?.setAttribute('aria-label', 'Open navigation');
  header?.classList.remove('menu-active');
  document.body.classList.remove('menu-open');
}

menuToggle?.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  header?.classList.toggle('menu-active', open);
  document.body.classList.toggle('menu-open', open);
});

mobileMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });

function updateHeader() { header?.classList.toggle('is-scrolled', window.scrollY > 16); }
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const hero = document.querySelector('.hero');
if (hero && window.matchMedia('(pointer:fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  hero.addEventListener('pointermove', (event) => {
    const bounds = hero.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * -18;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * -12;
    hero.style.setProperty('--hero-x', `${x.toFixed(2)}px`);
    hero.style.setProperty('--hero-y', `${y.toFixed(2)}px`);
  }, { passive: true });
  hero.addEventListener('pointerleave', () => {
    hero.style.setProperty('--hero-x', '0px');
    hero.style.setProperty('--hero-y', '0px');
  });
}

const chapters = [...document.querySelectorAll('[data-chapter]')];
const stageMessage = document.querySelector('.stage-message');
const stageKicker = document.querySelector('[data-stage-kicker]');
const stageTitle = document.querySelector('[data-stage-title]');
const stageCopy = document.querySelector('[data-stage-copy]');
const stageCounter = document.querySelector('[data-stage-counter]');
const stageProgress = document.querySelector('[data-stage-progress]');

function activateChapter(chapter) {
  const index = Number(chapter.dataset.chapter || 0);
  chapters.forEach((item) => {
    const active = item === chapter;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-selected', String(active));
  });
  stageMessage?.classList.add('is-changing');
  window.setTimeout(() => {
    if (stageKicker) stageKicker.textContent = chapter.dataset.kicker || '';
    if (stageTitle) stageTitle.textContent = chapter.dataset.title || '';
    if (stageCopy) stageCopy.textContent = chapter.dataset.copy || '';
    if (stageCounter) stageCounter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(chapters.length).padStart(2, '0')}`;
    if (stageProgress) stageProgress.style.width = `${((index + 1) / chapters.length) * 100}%`;
    stageMessage?.classList.remove('is-changing');
  }, 170);
}

chapters.forEach((chapter) => chapter.addEventListener('click', () => activateChapter(chapter)));

const videoTabs = [...document.querySelectorAll('[data-video-tab]')];
const videoPanels = [...document.querySelectorAll('[data-video-panel]')];
videoTabs.forEach((tab) => tab.addEventListener('click', () => {
  const target = tab.dataset.videoTab;
  videoTabs.forEach((item) => {
    const active = item === tab;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-selected', String(active));
  });
  videoPanels.forEach((panel) => { panel.hidden = panel.dataset.videoPanel !== target; });
}));

const workflowTabs = [...document.querySelectorAll('[data-workflow-tab]')];
const workflowPanels = [...document.querySelectorAll('[data-workflow-panel]')];
workflowTabs.forEach((tab) => tab.addEventListener('click', () => {
  const target = tab.dataset.workflowTab;
  workflowTabs.forEach((item) => {
    const active = item === tab;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-selected', String(active));
  });
  workflowPanels.forEach((panel) => {
    const active = panel.dataset.workflowPanel === target;
    panel.classList.toggle('is-active', active);
    panel.hidden = !active;
  });
}));

document.querySelectorAll('.case-file').forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    document.querySelectorAll('.case-file[open]').forEach((openItem) => {
      if (openItem !== item) openItem.removeAttribute('open');
    });
  });
});

const contactForm = document.getElementById('contact-form');
const contactStatus = document.getElementById('contact-status');
const isLocalPreview = location.protocol === 'file:' || ['localhost', '127.0.0.1'].includes(location.hostname);

if (isLocalPreview) {
  const note = contactForm?.querySelector('.form-note');
  if (note) note.textContent = 'Local preview: submitting will open an email draft. Production saves inquiries securely.';
}

contactForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const button = contactForm.querySelector('button[type="submit"]');
  const formData = new FormData(contactForm);
  const original = button.innerHTML;
  button.disabled = true;
  button.textContent = 'Sending…';
  if (contactStatus) contactStatus.textContent = '';

  if (isLocalPreview) {
    const subject = encodeURIComponent('3rd Meridian enterprise inquiry');
    const body = encodeURIComponent(`Name: ${formData.get('name')}\nEmail: ${formData.get('email')}\nPhone: ${formData.get('phone') || 'Not provided'}\n\n${formData.get('message')}`);
    location.href = `mailto:bluengineeringservices@gmail.com?subject=${subject}&body=${body}`;
    button.disabled = false;
    button.innerHTML = original;
    return;
  }

  try {
    const response = await fetch('/api/contact', { method: 'POST', body: formData, headers: { Accept: 'application/json' } });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || 'Unable to send your inquiry.');
    contactForm.reset();
    if (contactStatus) contactStatus.textContent = 'Inquiry received. We’ll be in touch.';
  } catch (error) {
    if (contactStatus) contactStatus.textContent = error.message || 'Unable to send right now. Please try again.';
  } finally {
    button.disabled = false;
    button.innerHTML = original;
  }
});

document.querySelectorAll('[data-year]').forEach((node) => { node.textContent = new Date().getFullYear(); });
