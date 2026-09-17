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
  storyIntro.innerHTML = '<h2>Relay joins the ecosystem you already use.</h2><p>It connects to CAD, Gmail, documents, and project context—then works beside the engineer as a documentation partner, context finder, and sounding board throughout the design lifecycle.</p>';
}

const reviewStorySteps = [
  ['Merge into the ecosystem', 'Relay brings CAD, Gmail, documents, requirements, drawings, test results, and project conversations into one working context. It does not ask the engineer to rebuild the workspace somewhere else.'],
  ['Take care of the documentation', 'As the engineer works, Relay turns decisions, changes, evidence, and open questions into usable documentation. It helps prepare briefs, update records, and keep the story of the design from getting lost.'],
  ['Sound like a veteran in the room', 'Relay brings relevant lifecycle playbooks, engineering patterns, trade-offs, and questions to the moment. Think of it as a veteran mechanical engineer you can consult while you are still exploring the problem.'],
  ['Keep helping when connectors are missing', 'If a CAD, Gmail, or document connector is not available in a workspace, Relay still has its own repository of engineering knowledge and lifecycle playbooks. The ecosystem makes it richer; it is not the only source of value.']
];
document.querySelectorAll('.story-step').forEach((step, index) => {
  const [title, copy] = reviewStorySteps[index] || reviewStorySteps[0];
  step.querySelector('h3').textContent = title;
  step.querySelector('p').textContent = copy;
});
const stageCopy = document.querySelector('.stage-copy');
if (stageCopy) stageCopy.innerHTML = '<span class="stage-kicker">RELAY IN THE WORKSPACE</span><strong>Your engineering assistant, inside the work.</strong><small>Connect the ecosystem, document the journey, and keep a veteran sounding board close at every stage.</small>';
const reviewStageCounter = document.querySelector('.stage-counter');
if (reviewStageCounter) reviewStageCounter.textContent = 'Workflow';

const privacy = document.querySelector('.relay-card-copy');
if (privacy && !privacy.querySelector('.privacy-note')) {
  const note = document.createElement('div');
  note.className = 'privacy-note';
  note.innerHTML = '<strong>Your engineering data stays private.</strong><span>Relay is a connector to your controlled workspace, not a public data pool. Your project context stays where you keep it and is used to answer your request.</span>';
  privacy.appendChild(note);
}
const relayCardTitle = document.querySelector('.relay-card-copy h3');
if (relayCardTitle) relayCardTitle.textContent = 'An engineering assistant that fits into the ecosystem you already have.';
const relayCardBody = document.querySelector('.relay-card-copy>p');
if (relayCardBody) relayCardBody.textContent = 'Relay connects to CAD, Gmail, documents, and project context, then helps the engineer carry decisions, evidence, and next steps through the lifecycle. When a connector is unavailable, its own engineering repository and playbooks still give you a useful place to start.';

const videoSection = document.querySelector('.feature-videos');
if (videoSection) {
  videoSection.querySelector('h2').textContent = 'A short film about the engineer’s second brain.';
  videoSection.querySelector('.video-intro').textContent = 'The story should feel like a veteran engineer joining the project: first connecting to the ecosystem, then helping document the work, then bringing ideas and lifecycle context when the engineer needs a sounding board.';
  const videoData = [
    ['Join the ecosystem', 'CAD, Gmail, and documents become one working context.', 'Open on the engineer moving between CAD, an email thread, a requirements document, and a test report. Relay quietly connects the pieces without asking for a new system of record.'],
    ['Document the work', 'The assistant keeps the engineering story alive.', 'Show Relay turning a design decision into a clear brief: what changed, why it changed, which evidence supports it, what is still open, and who needs to know.'],
    ['Be the sounding board', 'A veteran perspective appears at the right moment.', 'Show the engineer exploring a design choice. Relay brings relevant lifecycle playbooks, alternatives, failure modes, manufacturing questions, and verification ideas—without pretending to replace judgment.'],
    ['Keep working without every connector', 'The repository and playbooks still travel with Relay.', 'End with a workspace that cannot connect to one of its tools. Relay still answers from its engineering repository and lifecycle playbooks, then becomes more useful as integrations are added.']
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
