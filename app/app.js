// Leonida Trophy Guide — tracker and renderer (no build step, no network at run time).
// It fetches only data/trophies.json from its own folder, keeps earned trophies in
// localStorage, and renders the checklist, the roadmap and the filters from that data.
const STORAGE_KEY = 'gta6-trophy-checklist';
const KIND_LABELS = {
  all: 'All trophies',
  story: 'Story',
  missable: 'Missable',
  collectibles: 'Collectibles',
  activities: 'Activities',
  side: 'Side quests',
  robbery: 'Robbery',
  openworld: 'Open-world mischief',
  money: 'Money & property',
  completion: '100% & stunts',
  online: 'Online',
};
const GRADE_ORDER = ['platinum', 'gold', 'silver', 'bronze'];

const guide = await loadGuideData();
const state = {
  earned: loadEarned(),
  kind: 'all',
  grade: 'all',
  query: '',
  hideEarned: false,
  hideSpoilers: true,
  openId: null,
};
applyUrlState();

function loadGuideData() {
  return fetch('data/trophies.json').then((response) => response.json());
}

function loadEarned() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return new Set(Array.isArray(saved) ? saved : saved.earned ?? []);
  } catch {
    return new Set();
  }
}

function saveEarned() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...state.earned]));
}

function applyUrlState() {
  const params = new URLSearchParams(location.search);
  if (params.get('view') === 'roadmap') {
    document.body.classList.add('view-roadmap');
    document.getElementById('roadmapDetails').open = true;
  }
  if (params.get('kind') && params.get('kind') in KIND_LABELS) state.kind = params.get('kind');
  if (params.get('grade') && (params.get('grade') === 'all' || GRADE_ORDER.includes(params.get('grade')))) state.grade = params.get('grade');
  if (params.get('spoiler') === 'off') state.hideSpoilers = false;
  if (params.get('spoiler') === 'on') state.hideSpoilers = true;
  if (params.get('q')) state.query = params.get('q');
  if (params.get('open')) state.openId = Number(params.get('open'));
}

function trophyIsSpoilerHidden(trophy) {
  return state.hideSpoilers && trophy.kind === 'story' && !state.earned.has(trophy.name);
}

function trophyIsVisible(trophy) {
  if (state.kind === 'online') return false;
  if (state.kind === 'missable' && !trophy.missable) return false;
  if (state.kind !== 'all' && state.kind !== 'missable' && trophy.kind !== state.kind) return false;
  if (state.grade !== 'all' && trophy.grade !== state.grade) return false;
  if (state.hideEarned && state.earned.has(trophy.name)) return false;
  if (state.query) {
    const haystack = `${trophy.name} ${trophy.description} ${trophy.guide}`.toLowerCase();
    if (!haystack.includes(state.query.toLowerCase())) return false;
  }
  return true;
}

function renderKindChips() {
  const holder = document.getElementById('kindChips');
  holder.replaceChildren();
  for (const [kind, label] of Object.entries(KIND_LABELS)) {
    const count = kind === 'all'
      ? guide.trophies.length
      : kind === 'online'
        ? 0
        : kind === 'missable'
          ? guide.trophies.filter((t) => t.missable).length
          : guide.trophies.filter((t) => t.kind === kind).length;
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'chip';
    chip.setAttribute('aria-pressed', String(state.kind === kind));
    chip.textContent = `${label} `;
    const number = document.createElement('span');
    number.className = 'count';
    number.textContent = `(${count})`;
    chip.append(number);
    chip.addEventListener('click', () => {
      state.kind = kind;
      renderKindChips();
      renderTrophyList();
    });
    holder.append(chip);
  }
}

function renderRoadmap() {
  const steps = document.getElementById('roadmapSteps');
  steps.replaceChildren();
  for (const step of guide.roadmap) {
    const item = document.createElement('li');
    const heading = document.createElement('h3');
    heading.textContent = `Step ${step.step} — ${step.title} (${step.hours} hours)`;
    const text = document.createElement('p');
    text.textContent = step.text;
    item.append(heading, text);
    steps.append(item);
  }
}

function renderMissableBanner() {
  const banner = document.getElementById('missableBanner');
  const missable = guide.trophies.filter((t) => t.missable);
  const note = document.createElement('span');
  note.innerHTML = '';
  const strong = document.createElement('strong');
  strong.textContent = 'Possibly missable: ';
  note.append(strong);
  note.append(document.createTextNode(
    `${missable.map((t) => t.name).join(', ')} — meditate at every spot, and do the Chapter 1 balcony meditation with Lucia before Chapter 1 ends. Every other trophy can be earned after the story. `,
  ));
  const show = document.createElement('button');
  show.type = 'button';
  show.className = 'chip';
  show.textContent = 'Show the missable trophy';
  show.addEventListener('click', () => {
    state.kind = 'missable';
    renderKindChips();
    renderTrophyList();
    document.getElementById('trophyList').scrollIntoView();
  });
  note.append(show);
  banner.replaceChildren(note);
}

function renderProgress() {
  const total = guide.trophies.length;
  const earned = state.earned.size;
  document.getElementById('earnedCount').textContent = String(earned);
  document.getElementById('progressFill').style.width = `${(earned / total) * 100}%`;
  const parts = GRADE_ORDER.map((grade) => {
    const inGrade = guide.trophies.filter((t) => t.grade === grade);
    const got = inGrade.filter((t) => state.earned.has(t.name)).length;
    return `${got}/${inGrade.length} ${grade}`;
  });
  document.getElementById('gradeCounts').textContent = parts.join(' · ');
  const next = document.getElementById('nextUp');
  const meditation = guide.trophies.find((t) => t.name === 'Positive Mental Attitude');
  if (meditation && !state.earned.has(meditation.name)) {
    next.textContent = 'First: do the Chapter 1 balcony meditation — it may be missable.';
  } else {
    const firstLeft = guide.trophies.find((t) => !state.earned.has(t.name));
    next.textContent = firstLeft ? `Next up: ${firstLeft.name}.` : 'Platinum earned — Vice Got a Price!';
  }
}

function gradeBadge(trophy) {
  const badge = document.createElement('span');
  badge.className = `badge grade-${trophy.grade}`;
  badge.textContent = trophy.grade;
  return badge;
}

function buildTrophyCard(trophy) {
  const card = document.createElement('article');
  card.className = `trophy grade-${trophy.grade}${state.earned.has(trophy.name) ? ' earned' : ''}`;
  card.id = `trophy-${trophy.id}`;

  const head = document.createElement('div');
  head.className = 'trophy-head';
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.className = 'trophy-check';
  box.checked = state.earned.has(trophy.name);
  box.setAttribute('aria-label', `Mark ${trophy.name} as earned`);
  box.addEventListener('change', () => {
    if (box.checked) state.earned.add(trophy.name);
    else state.earned.delete(trophy.name);
    saveEarned();
    renderProgress();
    renderTrophyList();
  });
  const titles = document.createElement('div');
  titles.className = 'trophy-titles';
  const name = document.createElement('h3');
  if (trophyIsSpoilerHidden(trophy)) {
    name.textContent = 'Story trophy — hidden';
  } else {
    name.textContent = trophy.name;
    if (state.earned.has(trophy.name)) {
      const mark = document.createElement('span');
      mark.className = 'earned-mark';
      mark.textContent = ' ✓ earned';
      name.append(mark);
    }
  }
  titles.append(name);
  if (!trophyIsSpoilerHidden(trophy)) {
    const desc = document.createElement('p');
    desc.className = 'trophy-desc';
    desc.textContent = trophy.description;
    titles.append(desc);
  }
  head.append(box, titles);
  card.append(head);

  const badges = document.createElement('div');
  badges.className = 'badges';
  badges.append(gradeBadge(trophy));
  if (trophy.hidden) {
    const hidden = document.createElement('span');
    hidden.className = 'badge hidden-flag';
    hidden.textContent = 'hidden on PS5';
    badges.append(hidden);
  }
  if (trophy.missable) {
    const flag = document.createElement('span');
    flag.className = 'badge missable';
    flag.textContent = '⚠ possibly missable';
    badges.append(flag);
  }
  if (trophy.target) {
    const count = document.createElement('span');
    count.className = 'badge count';
    count.textContent = trophy.total ? `${trophy.target} of ${trophy.total}` : `target: ${trophy.target}`;
    badges.append(count);
  }
  const kind = document.createElement('span');
  kind.className = 'badge';
  kind.textContent = KIND_LABELS[trophy.kind] ?? trophy.kind;
  badges.append(kind);
  card.append(badges);

  if (trophyIsSpoilerHidden(trophy)) {
    const masked = document.createElement('p');
    masked.className = 'trophy-spoiler';
    masked.textContent = 'Hidden to avoid story spoilers. Earn it in-game (or switch off “Hide story spoilers” above) to reveal its name, description and guide.';
    card.append(masked);
    return card;
  }

  const guideBox = document.createElement('details');
  guideBox.className = 'trophy-guide';
  if (state.openId === trophy.id) guideBox.open = true;
  const summary = document.createElement('summary');
  summary.textContent = 'How to get it';
  const text = document.createElement('p');
  text.textContent = trophy.guide;
  guideBox.append(summary, text);
  if (trophy.missable && trophy.missableNote) {
    const warn = document.createElement('p');
    warn.textContent = trophy.missableNote;
    guideBox.append(warn);
  }
  const sources = document.createElement('p');
  sources.className = 'trophy-sources';
  sources.append(document.createTextNode('Sources: '));
  trophy.src.forEach((key, index) => {
    const source = guide.sources[key];
    if (index > 0) sources.append(document.createTextNode(', '));
    if (source?.url) {
      const link = document.createElement('a');
      link.href = source.url;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = source.name;
      sources.append(link);
    } else {
      sources.append(document.createTextNode(source?.name ?? key));
    }
  });
  guideBox.append(sources);
  card.append(guideBox);
  return card;
}

function renderTrophyList() {
  const list = document.getElementById('trophyList');
  list.replaceChildren();
  const shown = guide.trophies.filter(trophyIsVisible);
  for (const trophy of shown) list.append(buildTrophyCard(trophy));
  document.getElementById('emptyNote').hidden = shown.length > 0;
  const meta = state.kind === 'online'
    ? 'There are no online trophies in GTA VI — all 55 are offline single-player, so this filter is empty by design.'
    : `Showing ${shown.length} of ${guide.trophies.length} trophies.`;
  document.getElementById('listMeta').textContent = meta;
}

function renderSources() {
  document.getElementById('accuracyNote').textContent = guide.accuracy;
  const list = document.getElementById('sourceList');
  list.replaceChildren();
  for (const source of Object.values(guide.sources)) {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = source.url;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = source.name;
    item.append(link);
    list.append(item);
  }
}

function exportProgress() {
  const payload = JSON.stringify({ game: guide.game, earned: [...state.earned] }, null, 2);
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([payload], { type: 'application/json' }));
  link.download = 'gta6-trophy-progress.json';
  link.click();
  URL.revokeObjectURL(link.href);
}

function importProgressFile(file) {
  file.text().then((text) => {
    const parsed = JSON.parse(text);
    const names = Array.isArray(parsed) ? parsed : parsed.earned ?? [];
    const known = new Set(guide.trophies.map((t) => t.name));
    state.earned = new Set(names.filter((name) => known.has(name)));
    saveEarned();
    renderProgress();
    renderTrophyList();
  }).catch(() => {
    document.getElementById('listMeta').textContent = 'That file could not be imported — it is not a progress export from this guide.';
  });
}

function wireControls() {
  const search = document.getElementById('search');
  search.value = state.query;
  search.addEventListener('input', () => {
    state.query = search.value;
    renderTrophyList();
  });
  const grade = document.getElementById('grade');
  grade.value = state.grade;
  grade.addEventListener('change', () => {
    state.grade = grade.value;
    renderTrophyList();
  });
  const hideEarned = document.getElementById('hideEarned');
  hideEarned.addEventListener('change', () => {
    state.hideEarned = hideEarned.checked;
    renderTrophyList();
  });
  const spoiler = document.getElementById('spoilerToggle');
  spoiler.checked = state.hideSpoilers;
  spoiler.addEventListener('change', () => {
    state.hideSpoilers = spoiler.checked;
    renderTrophyList();
  });
  document.getElementById('export').addEventListener('click', exportProgress);
  document.getElementById('import').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) importProgressFile(file);
  });
}

renderKindChips();
renderRoadmap();
renderMissableBanner();
renderProgress();
renderTrophyList();
renderSources();
wireControls();
