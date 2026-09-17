const launchNote = document.getElementById('launch-note');

document.querySelectorAll('[data-placeholder]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    launchNote.textContent = `The Relay link for ${link.dataset.placeholder} is not available yet. The link will appear here at launch.`;
  });
});

const CONTACT_ENDPOINT = ''; // Add your hosted form endpoint here before launch.
if (!CONTACT_ENDPOINT) document.querySelector('#contact-form button').firstChild.textContent = 'Send message ';
document.querySelector('#contact-form .form-note').textContent = 'Messages will be stored securely for the 3rd Meridian team.';

document.getElementById('contact-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  data.set('website', '');
  const status = document.getElementById('contact-status');
  if (!CONTACT_ENDPOINT) {
    status.textContent = 'The form is ready, but its secure delivery service has not been connected yet. Please use the email link above for now.';
    return;
  }
  status.textContent = 'Sending…';
  try {
    const response = await fetch(CONTACT_ENDPOINT, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('Request failed');
    event.currentTarget.reset();
    status.textContent = 'Thanks — your message is on its way.';
  } catch {
    status.textContent = 'We could not send that message. Please use the email link above instead.';
  }
});

const story = document.querySelector('.relay-story');
const storySteps = [...document.querySelectorAll('.story-step')];
const stageCounter = document.querySelector('.stage-counter');
const stageKicker = document.querySelector('.stage-kicker');
const stageTitle = document.querySelector('.stage-copy strong');
const stageProgress = document.querySelector('.stage-progress span');
const sceneTitles = ['Engineering context, in one conversation.', 'Ask in the language of the problem.', 'Trace the change before it becomes rework.', 'The engineer stays in control.'];
if (story && storySteps.length) {
  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    const index = Number(visible.target.dataset.step);
    storySteps.forEach((step) => step.classList.toggle('is-active', step === visible.target));
    if (stageCounter) stageCounter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(storySteps.length).padStart(2, '0')}`;
    if (stageKicker) stageKicker.textContent = `SCENE ${String(index + 1).padStart(2, '0')}`;
    if (stageTitle) stageTitle.textContent = sceneTitles[index] || sceneTitles[0];
    if (stageProgress) stageProgress.style.width = `${((index + 1) / storySteps.length) * 100}%`;
  }, { rootMargin: '-35% 0px -45% 0px', threshold: [0.2, 0.5, 0.8] });
  storySteps.forEach((step) => observer.observe(step));
}
