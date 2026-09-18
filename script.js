if (!location.hash) {
  history.scrollRestoration = 'manual';
  requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' }));
  window.addEventListener('pageshow', () => window.scrollTo({ top: 0, left: 0, behavior: 'instant' }), { once: true });
}

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
    item.setAttribute('tabindex', active ? '0' : '-1');
  });
  workflowPanels.forEach((panel) => {
    const active = panel.dataset.workflowPanel === target;
    panel.classList.toggle('is-active', active);
    panel.hidden = !active;
  });
}));

workflowTabs.forEach((tab, index) => tab.addEventListener('keydown', (event) => {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  let nextIndex = index;
  if (event.key === 'ArrowRight') nextIndex = (index + 1) % workflowTabs.length;
  if (event.key === 'ArrowLeft') nextIndex = (index - 1 + workflowTabs.length) % workflowTabs.length;
  if (event.key === 'Home') nextIndex = 0;
  if (event.key === 'End') nextIndex = workflowTabs.length - 1;
  workflowTabs[nextIndex]?.focus();
  workflowTabs[nextIndex]?.click();
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
  if (note) note.textContent = 'Local preview: submitting opens an email draft. On the live site, the enquiry is sent to 3rd Meridian for review.';
}

contactForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    if (contactStatus) contactStatus.textContent = 'Please complete every field with valid information before sending.';
    return;
  }
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
    if (contactStatus) contactStatus.textContent = "Thanks for getting in touch. We'll review your project and reply using the contact details you provided.";
  } catch (error) {
    if (contactStatus) contactStatus.textContent = error.message || 'Unable to send right now. Please try again.';
  } finally {
    button.disabled = false;
    button.innerHTML = original;
  }
});

document.querySelectorAll('[data-year]').forEach((node) => { node.textContent = new Date().getFullYear(); });
// Replace values here when final product links and videos are available.
// Keeping external assets in one place avoids rebuilding page sections.
const RELAY_ASSETS = Object.freeze({
  productRepository: null,
  licenseUrl: null,
  installationGuideUrl: null,
  supportUrl: null,
  marketplace: { chatgpt: null, claude: null },
  videos: {
    assistantChatgpt: null,
    assistantClaude: null,
    veteranChatgpt: null,
    veteranClaude: null,
    installChatgpt: null,
    installClaude: null,
    privateDeployment: null,
  },
});

function assetValue(path) {
  return path.split('.').reduce((value, key) => value?.[key], RELAY_ASSETS) || null;
}

function videoEmbedUrl(url) {
  try {
    const parsed = new URL(url, location.href);
    if (parsed.hostname.includes('youtube.com') && parsed.searchParams.get('v')) return `https://www.youtube-nocookie.com/embed/${parsed.searchParams.get('v')}`;
    if (parsed.hostname === 'youtu.be') return `https://www.youtube-nocookie.com/embed/${parsed.pathname.slice(1)}`;
    if (parsed.hostname.includes('vimeo.com') && !parsed.hostname.startsWith('player.')) return `https://player.vimeo.com/video/${parsed.pathname.split('/').filter(Boolean).pop()}`;
    return null;
  } catch {
    return null;
  }
}

function renderConfiguredVideo(container, url) {
  if (!container || !url) return;
  const title = container.dataset.videoTitle || 'Relay tutorial';
  const embedUrl = videoEmbedUrl(url);
  const media = embedUrl ? document.createElement('iframe') : document.createElement('video');
  media.className = 'configured-video';
  media.setAttribute('title', title);
  if (embedUrl) {
    media.src = embedUrl;
    media.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    media.allowFullscreen = true;
    media.loading = 'lazy';
  } else {
    media.src = url;
    media.controls = true;
    media.preload = 'metadata';
  }
  container.replaceChildren(media);
  container.classList.add('has-configured-video');
  container.removeAttribute('role');
  container.removeAttribute('aria-label');
}

document.querySelectorAll('[data-asset-link]').forEach((link) => {
  const url = assetValue(link.dataset.assetLink);
  if (!url) return;
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.removeAttribute('aria-disabled');
  const readyLabel = link.dataset.readyLabel;
  if (readyLabel) link.textContent = readyLabel;
  link.querySelector('.access-status')?.replaceChildren('Open marketplace');
});

const workflowVideoKeys = ['videos.assistantChatgpt', 'videos.assistantClaude', 'videos.veteranChatgpt', 'videos.veteranClaude'];
document.querySelectorAll('.workflow-video-screen').forEach((container, index) => renderConfiguredVideo(container, assetValue(workflowVideoKeys[index])));
document.querySelectorAll('[data-asset-video]').forEach((container) => renderConfiguredVideo(container, assetValue(container.dataset.assetVideo)));
