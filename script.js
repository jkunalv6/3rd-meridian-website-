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

// Review pass: put the workflow and engineering examples at the center of the story.
const reviewLabel = (text) => text.replace(/^\d+\s*\/\s*/, '');
document.querySelectorAll('.section-label').forEach((label) => { label.textContent = reviewLabel(label.textContent); });
document.querySelectorAll('.story-step > span').forEach((step) => { step.textContent = ''; });

const storyIntro = document.querySelector('.relay-story .story-intro');
if (storyIntro) {
  storyIntro.innerHTML = '<h2>Relay connects the work around the work.</h2><p>And then it helps with the engineering itself. Start with a natural question, follow the evidence through the design, and keep the decision with the person responsible for it.</p>';
}

const reviewStorySteps = [
  ['Bring the engineering context together', 'Relay connects the files, requirements, messages, drawings, test results, and prior decisions already scattered across a project. You keep the source systems; Relay makes the relationships usable.'],
  ['Turn a vague problem into a real decision', 'Ask what you are trying to understand in ordinary language. Relay helps frame the decision, separates what is known from what is assumed, and asks only for information that could change the recommendation.'],
  ['Work through the trade-offs', 'Relay can help compare architectures, materials, manufacturing routes, interfaces, and verification paths. It brings the relevant engineering reasoning forward without pretending a screening result is a release decision.'],
  ['Review the change before it travels', 'When a requirement, load, supplier input, or field issue changes, Relay traces the direct impact and prepares a brief. You approve consequential actions, make the engineering judgment, and keep the record of why.']
];
document.querySelectorAll('.story-step').forEach((step, index) => {
  const [title, copy] = reviewStorySteps[index] || reviewStorySteps[0];
  step.querySelector('h3').textContent = title;
  step.querySelector('p').textContent = copy;
});
const stageCopy = document.querySelector('.stage-copy');
if (stageCopy) stageCopy.innerHTML = '<span class="stage-kicker">WORKFLOW</span><strong>From context to an engineering decision.</strong><small>A guided story of how Relay helps without taking control away from the engineer.</small>';
const reviewStageCounter = document.querySelector('.stage-counter');
if (reviewStageCounter) reviewStageCounter.textContent = 'Workflow';

const privacy = document.querySelector('.relay-card-copy');
if (privacy && !privacy.querySelector('.privacy-note')) {
  const note = document.createElement('div');
  note.className = 'privacy-note';
  note.innerHTML = '<strong>Your engineering data stays private.</strong><span>Relay is a connector to your controlled workspace, not a public data pool. Your project context stays where you keep it and is used to answer your request.</span>';
  privacy.appendChild(note);
}

const videoSection = document.querySelector('.feature-videos');
if (videoSection) {
  videoSection.querySelector('h2').textContent = 'A short film about how engineering context moves.';
  videoSection.querySelector('.video-intro').textContent = 'This is the video plan: four short scenes that make Relay understandable before anyone has to learn the vocabulary.';
  const videoData = [
    ['The problem', 'A mounting change arrives in a message.', 'Open on a busy engineering desk: CAD, a requirement, a test result, and a chat window. The message is simple: “The mounting requirement changed.”'],
    ['The question', 'The engineer asks what it affects.', 'Cut to the engineer asking in plain language. Show Relay finding the current revision, the source requirement, and the first affected interface.'],
    ['The engineering', 'The decision becomes a trade-off.', 'Show a calm comparison: stiffen the bracket, change the material, or change the process. Surface the missing load case and the verification needed before anyone claims certainty.'],
    ['The handoff', 'The engineer decides what happens next.', 'End with the change brief: evidence, impact, open question, next action. The engineer approves the documentation and keeps responsibility for the design decision.']
  ];
  videoSection.querySelector('.video-grid').innerHTML = videoData.map(([title, screen, direction], i) => `<article class="video-card"><div class="video-placeholder"><span class="scene-number">Scene ${i + 1}</span><span>${screen}</span><small>${direction}</small></div><h3>${title}</h3><p>${direction}</p></article>`).join('');
}

document.querySelectorAll('body *').forEach((node) => {
  if (node.children.length === 0 && /\bMCP server\b/i.test(node.textContent)) node.textContent = node.textContent.replace(/MCP server/gi, 'engineering plugin');
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
    if (stageCounter) stageCounter.textContent = 'Workflow';
    if (stageKicker) stageKicker.textContent = 'SCENE';
    if (stageTitle) stageTitle.textContent = sceneTitles[index] || sceneTitles[0];
    if (stageProgress) stageProgress.style.width = `${((index + 1) / storySteps.length) * 100}%`;
  }, { rootMargin: '-35% 0px -45% 0px', threshold: [0.2, 0.5, 0.8] });
  storySteps.forEach((step) => observer.observe(step));
}
