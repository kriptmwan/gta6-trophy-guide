// Leonida Trophy Guide — checklist tracker and page renderer (no build step, no
// network at run time). It fetches only data/trophies.json from its own folder,
// keeps earned trophies in localStorage, and draws the checklist, the roadmap and
// the filters from that data.
const SAVE_KEY = 'gta6-trophy-checklist';
const KIND_NAMES = {
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
const GRADES = ['platinum', 'gold', 'silver', 'bronze'];

const data = await fetchGuide();
const tracker = {
  earned: readEarned(),
  kind: 'all',
  grade: 'all',
  query: '',
  hideEarned: false,
  hideSpoilers: true,
  openId: null,
};
readUrl();

function fetchGuide() {
  return fetch('data/trophies.json').then((response) => response.json());
}

function readEarned() {
  try {
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY) ?? '[]');
    return new Set(Array.isArray(saved) ? saved : saved.earned ?? []);
  } catch {
    return new Set();
  }
}

function storeEarned() {
  localStorage.setItem(SAVE_KEY, JSON.stringify([...tracker.earned]));
}

function readUrl() {
  const params = new URLSearchParams(location.search);
  if (params.get('view') === 'roadmap') {
    document.body.classList.add('view-roadmap');
    document.getElementById('roadmapDetails').open = true;
  }
  if (params.get('kind') && params.get('kind') in KIND_NAMES) tracker.kind = params.get('kind');
  if (params.get('grade') && (params.get('grade') === 'all' || GRADES.includes(params.get('grade')))) tracker.grade = params.get('grade');
  if (params.get('spoiler') === 'off') tracker.hideSpoilers = false;
  if (params.get('spoiler') === 'on') tracker.hideSpoilers = true;
  if (params.get('q')) tracker.query = params.get('q');
  if (params.get('open')) tracker.openId = Number(params.get('open'));
}

function isSpoilerMasked(trophy) {
  return tracker.hideSpoilers && trophy.kind === 'story' && !tracker.earned.has(trophy.name);
}

function isShown(trophy) {
  if (tracker.kind === 'online') return false;
  if (tracker.kind === 'missable' && !trophy.missable) return false;
  if (tracker.kind !== 'all' && tracker.kind !== 'missable' && trophy.kind !== tracker.kind) return false;
  if (tracker.grade !== 'all' && trophy.grade !== tracker.grade) return false;
  if (tracker.hideEarned && tracker.earned.has(trophy.name)) return false;
  if (tracker.query) {
    const haystack = `${trophy.name} ${trophy.description} ${trophy.guide}`.toLowerCase();
    if (!haystack.includes(tracker.query.toLowerCase())) return false;
  }
  return true;
}

function drawKindChips() {
  const holder = document.getElementById('kindChips');
  holder.replaceChildren();
  for (const [kind, label] of Object.entries(KIND_NAMES)) {
    const count = kind === 'all'
      ? data.trophies.length
      : kind === 'online'
        ? 0
        : kind === 'missable'
          ? data.trophies.filter((t) => t.missable).length
          : data.trophies.filter((t) => t.kind === kind).length;
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'chip';
    chip.setAttribute('aria-pressed', String(tracker.kind === kind));
    chip.textContent = `${label} `;
    const number = document.createElement('span');
    number.className = 'count';
    number.textContent = `(${count})`;
    chip.append(number);
    chip.addEventListener('click', () => {
      tracker.kind = kind;
      drawKindChips();
      drawTrophyList();
    });
    holder.append(chip);
  }
}

function drawRoadmap() {
  const steps = document.getElementById('roadmapSteps');
  steps.replaceChildren();
  for (const step of data.roadmap) {
    const item = document.createElement('li');
    const heading = document.createElement('h3');
    heading.textContent = `Step ${step.step} — ${step.title} (${step.hours} hours)`;
    const text = document.createElement('p');
    text.textContent = step.text;
    item.append(heading, text);
    steps.append(item);
  }
}

function drawMissableBanner() {
  const banner = document.getElementById('missableBanner');
  const missable = data.trophies.filter((t) => t.missable);
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
    tracker.kind = 'missable';
    drawKindChips();
    drawTrophyList();
    document.getElementById('trophyList').scrollIntoView();
  });
  note.append(show);
  banner.replaceChildren(note);
}

function drawProgress() {
  const total = data.trophies.length;
  const earned = tracker.earned.size;
  document.getElementById('earnedCount').textContent = String(earned);
  document.getElementById('progressFill').style.width = `${(earned / total) * 100}%`;
  const parts = GRADES.map((grade) => {
    const inGrade = data.trophies.filter((t) => t.grade === grade);
    const got = inGrade.filter((t) => tracker.earned.has(t.name)).length;
    return `${got}/${inGrade.length} ${grade}`;
  });
  document.getElementById('gradeCounts').textContent = parts.join(' · ');
  const next = document.getElementById('nextUp');
  const meditation = data.trophies.find((t) => t.name === 'Positive Mental Attitude');
  if (meditation && !tracker.earned.has(meditation.name)) {
    next.textContent = 'First: do the Chapter 1 balcony meditation — it may be missable.';
  } else {
    const firstLeft = data.trophies.find((t) => !tracker.earned.has(t.name));
    next.textContent = firstLeft ? `Next up: ${firstLeft.name}.` : 'Platinum earned — Vice Got a Price!';
  }
}

function makeGradeBadge(trophy) {
  const badge = document.createElement('span');
  badge.className = `badge grade-${trophy.grade}`;
  badge.textContent = trophy.grade;
  return badge;
}

function makeTrophyCard(trophy) {
  const card = document.createElement('article');
  card.className = `trophy grade-${trophy.grade}${tracker.earned.has(trophy.name) ? ' earned' : ''}`;
  card.id = `trophy-${trophy.id}`;

  const head = document.createElement('div');
  head.className = 'trophy-head';
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.className = 'trophy-check';
  box.checked = tracker.earned.has(trophy.name);
  box.setAttribute('aria-label', `Mark ${trophy.name} as earned`);
  box.addEventListener('change', () => {
    if (box.checked) tracker.earned.add(trophy.name);
    else tracker.earned.delete(trophy.name);
    storeEarned();
    drawProgress();
    drawTrophyList();
  });
  const titles = document.createElement('div');
  titles.className = 'trophy-titles';
  const name = document.createElement('h3');
  if (isSpoilerMasked(trophy)) {
    name.textContent = 'Story trophy — hidden';
  } else {
    name.textContent = trophy.name;
    if (tracker.earned.has(trophy.name)) {
      const mark = document.createElement('span');
      mark.className = 'earned-mark';
      mark.textContent = ' ✓ earned';
      name.append(mark);
    }
  }
  titles.append(name);
  if (!isSpoilerMasked(trophy)) {
    const desc = document.createElement('p');
    desc.className = 'trophy-desc';
    desc.textContent = trophy.description;
    titles.append(desc);
  }
  head.append(box, titles);
  card.append(head);

  const badges = document.createElement('div');
  badges.className = 'badges';
  badges.append(makeGradeBadge(trophy));
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
  kind.textContent = KIND_NAMES[trophy.kind] ?? trophy.kind;
  badges.append(kind);
  card.append(badges);

  if (isSpoilerMasked(trophy)) {
    const masked = document.createElement('p');
    masked.className = 'trophy-spoiler';
    masked.textContent = 'Hidden to avoid story spoilers. Earn it in-game (or switch off “Hide story spoilers” above) to reveal its name, description and guide.';
    card.append(masked);
    return card;
  }

  const guideBox = document.createElement('details');
  guideBox.className = 'trophy-guide';
  if (tracker.openId === trophy.id) guideBox.open = true;
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
    const source = data.sources[key];
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

function drawTrophyList() {
  const list = document.getElementById('trophyList');
  list.replaceChildren();
  const shown = data.trophies.filter(isShown);
  for (const trophy of shown) list.append(makeTrophyCard(trophy));
  document.getElementById('emptyNote').hidden = shown.length > 0;
  const meta = tracker.kind === 'online'
    ? 'There are no online trophies in GTA VI — all 55 are offline single-player, so this filter is empty by design.'
    : `Showing ${shown.length} of ${data.trophies.length} trophies.`;
  document.getElementById('listMeta').textContent = meta;
}

function drawSources() {
  document.getElementById('accuracyNote').textContent = data.accuracy;
  const list = document.getElementById('sourceList');
  list.replaceChildren();
  for (const source of Object.values(data.sources)) {
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

function downloadProgress() {
  const payload = JSON.stringify({ game: data.game, earned: [...tracker.earned] }, null, 2);
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([payload], { type: 'application/json' }));
  link.download = 'gta6-trophy-progress.json';
  link.click();
  URL.revokeObjectURL(link.href);
}

function loadProgressFile(file) {
  file.text().then((text) => {
    const parsed = JSON.parse(text);
    const names = Array.isArray(parsed) ? parsed : parsed.earned ?? [];
    const known = new Set(data.trophies.map((t) => t.name));
    tracker.earned = new Set(names.filter((name) => known.has(name)));
    storeEarned();
    drawProgress();
    drawTrophyList();
  }).catch(() => {
    document.getElementById('listMeta').textContent = 'That file could not be imported — it is not a progress export from this guide.';
  });
}

function bindControls() {
  const search = document.getElementById('search');
  search.value = tracker.query;
  search.addEventListener('input', () => {
    tracker.query = search.value;
    drawTrophyList();
  });
  const grade = document.getElementById('grade');
  grade.value = tracker.grade;
  grade.addEventListener('change', () => {
    tracker.grade = grade.value;
    drawTrophyList();
  });
  const hideEarned = document.getElementById('hideEarned');
  hideEarned.addEventListener('change', () => {
    tracker.hideEarned = hideEarned.checked;
    drawTrophyList();
  });
  const spoiler = document.getElementById('spoilerToggle');
  spoiler.checked = tracker.hideSpoilers;
  spoiler.addEventListener('change', () => {
    tracker.hideSpoilers = spoiler.checked;
    drawTrophyList();
  });
  document.getElementById('export').addEventListener('click', downloadProgress);
  document.getElementById('import').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) loadProgressFile(file);
  });
}

drawKindChips();
drawRoadmap();
drawMissableBanner();
drawProgress();
drawTrophyList();
drawSources();
bindControls();
