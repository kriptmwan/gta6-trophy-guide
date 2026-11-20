// Leonida Trophy Guide — tracker, filters, roadmap and planner.
// Loads app/data/trophies.json, keeps earned trophies in localStorage,
// and never makes a network request of its own: the data file is local.

const DATA_URL = "data/trophies.json";
const STORE_KEY = "leonida-trophy-guide-v1";

const listEl = document.getElementById("trophyList");
const detailEl = document.getElementById("detail");
const countsEl = document.getElementById("counts");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const searchEl = document.getElementById("search");
const gradeEl = document.getElementById("gradeFilter");
const kindEl = document.getElementById("kindFilter");
const spoilerEl = document.getElementById("spoilerToggle");
const earnedOnlyEl = document.getElementById("earnedOnly");

let trophies = [];
let earned = new Set(loadEarned());
let selected = null;

function loadEarned() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed.earned) ? parsed.earned : [];
  } catch (err) {
    return [];
  }
}

function saveEarned() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify({ earned: [...earned].sort() }));
  } catch (err) {
    // Storage full or blocked: the checklist still works for this visit.
  }
}

function gradeLabel(grade) {
  return grade.charAt(0).toUpperCase() + grade.slice(1);
}

function kindLabel(kind) {
  const labels = {
    story: "Story", side: "Side strands", collectibles: "Collectibles",
    activities: "Activities", crime: "Crime", exploration: "Exploration",
    completion: "Completion", misc: "Everything else", platinum: "Platinum",
  };
  return labels[kind] || kind;
}

function spoilerHidden(trophy) {
  return spoilerEl.checked && trophy.hidden && !earned.has(trophy.name);
}

function visibleTrophies() {
  const q = searchEl.value.trim().toLowerCase();
  return trophies.filter((t) => {
    if (gradeEl.value && t.grade !== gradeEl.value) return false;
    if (kindEl.value && t.kind !== kindEl.value) return false;
    if (earnedOnlyEl.checked && !earned.has(t.name)) return false;
    if (q && !(t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))) return false;
    return true;
  });
}

function renderCounts() {
  const byGrade = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  let hidden = 0;
  for (const t of trophies) {
    byGrade[t.grade] += 1;
    if (t.hidden) hidden += 1;
  }
  countsEl.innerHTML = "";
  const bits = [
    `${trophies.length} trophies`,
    `${byGrade.platinum} Platinum`,
    `${byGrade.gold} Gold`,
    `${byGrade.silver} Silver`,
    `${byGrade.bronze} Bronze`,
    `${hidden} hidden`,
    `1 missable`,
  ];
  for (const bit of bits) {
    const span = document.createElement("span");
    span.textContent = bit;
    countsEl.appendChild(span);
  }
}

function renderProgress() {
  const n = earned.size;
  const total = trophies.length || 55;
  progressFill.style.width = `${Math.round((n / total) * 100)}%`;
  progressText.textContent = `${n} of ${total} earned — ${total - n} to go`;
}

function renderList() {
  listEl.innerHTML = "";
  const shown = visibleTrophies();
  if (shown.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No trophies match those filters.";
    listEl.appendChild(li);
    return;
  }
  for (const t of shown) {
    const li = document.createElement("li");
    li.className = "trophy" + (earned.has(t.name) ? " earned" : "") + (selected === t.name ? " selected" : "");
    li.dataset.name = t.name;

    const row = document.createElement("div");
    row.className = "trophy-row";

    const box = document.createElement("input");
    box.type = "checkbox";
    box.checked = earned.has(t.name);
    box.setAttribute("aria-label", `Mark ${t.name} as earned`);
    box.addEventListener("click", (event) => {
      event.stopPropagation();
      if (box.checked) earned.add(t.name);
      else earned.delete(t.name);
      saveEarned();
      renderProgress();
      renderList();
      if (selected === t.name) renderDetail(t);
      renderNextUp();
    });

    const body = document.createElement("div");
    const name = document.createElement("div");
    name.className = "trophy-name";
    name.textContent = spoilerHidden(t) ? "Hidden trophy" : t.name;
    const desc = document.createElement("div");
    desc.className = "trophy-desc";
    desc.textContent = spoilerHidden(t) ? "Hidden until earned — turn the spoiler setting off to reveal it." : t.description;

    const badges = document.createElement("div");
    badges.className = "badges";
    const grade = document.createElement("span");
    grade.className = `badge ${t.grade}`;
    grade.textContent = gradeLabel(t.grade);
    badges.appendChild(grade);
    const kind = document.createElement("span");
    kind.className = "badge";
    kind.textContent = kindLabel(t.kind);
    badges.appendChild(kind);
    if (t.hidden) {
      const h = document.createElement("span");
      h.className = "badge hidden";
      h.textContent = "Hidden";
      badges.appendChild(h);
    }
    if (t.missable) {
      const m = document.createElement("span");
      m.className = "badge missable";
      m.textContent = "MISSABLE";
      badges.appendChild(m);
    }
    if (t.target_label) {
      const tg = document.createElement("span");
      tg.className = "badge target";
      tg.textContent = t.target_label;
      badges.appendChild(tg);
    }

    body.appendChild(name);
    body.appendChild(desc);
    body.appendChild(badges);
    row.appendChild(box);
    row.appendChild(body);
    li.appendChild(row);
    li.addEventListener("click", () => {
      selected = t.name;
      renderList();
      renderDetail(t);
    });
    listEl.appendChild(li);
  }
}

function renderDetail(t) {
  detailEl.innerHTML = "";
  const title = document.createElement("h3");
  title.textContent = spoilerHidden(t) ? "Hidden trophy" : t.name;
  detailEl.appendChild(title);

  const desc = document.createElement("p");
  desc.className = "trophy-desc";
  desc.textContent = spoilerHidden(t)
    ? "Hidden until earned — turn the spoiler setting off to reveal it."
    : t.description;
  detailEl.appendChild(desc);

  const badges = document.createElement("div");
  badges.className = "badges";
  for (const [cls, text] of [
    [t.grade, gradeLabel(t.grade)],
    ["", kindLabel(t.kind)],
    ...(t.hidden ? [["hidden", "Hidden"]] : []),
    ...(t.missable ? [["missable", "MISSABLE — do this before Chapter 1 ends"]] : []),
    ...(t.target_label ? [["target", t.target_label]] : []),
  ]) {
    const b = document.createElement("span");
    b.className = `badge ${cls}`.trim();
    b.textContent = text;
    badges.appendChild(b);
  }
  detailEl.appendChild(badges);

  const guideHead = document.createElement("h4");
  guideHead.textContent = "Guide";
  detailEl.appendChild(guideHead);
  const guide = document.createElement("p");
  guide.textContent = t.guide;
  detailEl.appendChild(guide);

  const srcHead = document.createElement("h4");
  srcHead.textContent = "Sources";
  detailEl.appendChild(srcHead);
  const srcList = document.createElement("ul");
  for (const s of t.sources || []) {
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = s.url;
    link.textContent = s.name;
    link.target = "_blank";
    link.rel = "noopener";
    item.appendChild(link);
    srcList.appendChild(item);
  }
  detailEl.appendChild(srcList);

  const state = document.createElement("p");
  state.textContent = earned.has(t.name)
    ? "Earned — ticked off in your checklist."
    : "Not earned yet — tick the box in the list when it pops.";
  detailEl.appendChild(state);
}

const ROADMAP = [
  {
    stage: "Stage 1 — Play the story",
    text: "Finish Gone Fishing, Chapters 1–4 and the final mission. That earns 13 trophies: the five chapter trophies, the gold for the final mission, and the six named mission trophies (Breakfast Run, The Cartel Heist, Child's Play, Headliners, VCIA Takedown, Operation Savage Glory).",
    names: ["Just Like Paradise", "Paradise Lost", "T**s Ass Drug Money", "Vice City, Baby!", "Top of the World, Ma", "You Gotta Know When to Get Off", "Trust", "Break the Bank", "Family Matters", "DWNFALL", "Hi-Jacked", "Snow Storm"],
  },
  {
    stage: "Stage 2 — Do the missable first",
    text: "During Chapter 1, meditate at Lucia's balcony spot. It is the only missable trophy in the list: the spot disappears after Chapter 1 ends. Then keep meditating at the other 17 spots as you find them.",
    names: ["Positive Mental Attitude"],
  },
  {
    stage: "Stage 3 — Side strands",
    text: "Finish the stranger strands: Andy (Lucia only, from Chapter 3), Kenton, Billy, Randy and Tyrone, plus three more strands to reach eight. Each strand's trophy pops at its final mission.",
    names: ["Road to Rehabilitation", "This Was No Boat Accident", "The Lone Rider", "Supply & Demand", "Spin on This!", "Strangers & Freaks", "Fair Game"],
  },
  {
    stage: "Stage 4 — Activities and crime",
    text: "Clear the activity trophies (shooting range golds, drone races, races, fishing, arcade, stunts) and the crime set (bank vaults, armored truck, jewelry store, shops, illegal operations, marked bills). Do these with your partner where the trophy asks for it.",
    names: ["The Shootist", "Top Fun", "Earn Cash, Not Kudos", "Baited My Tackle", "Stick Fiddler", "Cunning Stunts", "Master of None", "Maximum Withdrawal", "A Classic Blitz Play", "Sneakthief", "Hot Together", "Retail Therapy", "Gunslinger", "Catch Me if You Can", "Challenging Tank"],
  },
  {
    stage: "Stage 5 — Collectibles, exploration and 100%",
    text: "Sweep the long grinds last: WAiNK scans, card sets, vehicles, garages, meditations, challenges and full exploration of Leonida. The 100% checklist (gold) and the platinum follow once the last grind is done.",
    names: ["You WAiNKer!", "Don't Touch My Deck", "Whip It Good", "Little Boxes", "On the Spot", "One Last Thing", "The Goodtime State", "Pest Control", "Dime on the Dollar", "Treat Yo Self", "In the Beginning...", "Capital Offense", "Let's Go Bowling", "Personal Best", "Actions Speak Louder", "Bad Luck, I Guess", "The Truth Is Out There", "Ten Pin", "A Long Road", "Vice Got a Price!"],
  },
];

function renderRoadmap() {
  const list = document.getElementById("roadmapList");
  list.innerHTML = "";
  for (const stage of ROADMAP) {
    const li = document.createElement("li");
    const h = document.createElement("h3");
    h.textContent = stage.stage;
    li.appendChild(h);
    const p = document.createElement("p");
    p.textContent = stage.text;
    li.appendChild(p);
    const done = stage.names.filter((n) => earned.has(n)).length;
    const meta = document.createElement("p");
    meta.textContent = `${done} of ${stage.names.length} earned in this stage.`;
    li.appendChild(meta);
    list.appendChild(li);
  }
}

function renderMissables() {
  const box = document.getElementById("missableList");
  box.innerHTML = "";
  const missable = trophies.filter((t) => t.missable);
  for (const t of missable) {
    const card = document.createElement("div");
    card.className = "missable-card";
    const h = document.createElement("h3");
    h.textContent = `${t.name} — ${t.description}`;
    card.appendChild(h);
    const p = document.createElement("p");
    p.textContent = t.guide;
    card.appendChild(p);
    const state = document.createElement("p");
    state.textContent = earned.has(t.name)
      ? "Safe — you already earned it."
      : "Not earned yet. Do it during Chapter 1, before the story moves on.";
    card.appendChild(state);
    box.appendChild(card);
  }
  const note = document.createElement("p");
  note.textContent = "Every other trophy can be earned after the story in free roam. Nothing else in the list is missable.";
  box.appendChild(note);
}

function nextUp() {
  const byName = new Map(trophies.map((t) => [t.name, t]));
  const picks = [];
  for (const stage of ROADMAP) {
    for (const name of stage.names) {
      const t = byName.get(name);
      if (t && !earned.has(name)) picks.push({ trophy: t, why: stage.stage });
    }
  }
  return picks.slice(0, 10);
}

function renderNextUp() {
  const list = document.getElementById("nextUpList");
  if (!list) return;
  list.innerHTML = "";
  const picks = nextUp();
  if (picks.length === 0) {
    const li = document.createElement("li");
    li.textContent = "Everything is earned — the platinum is yours, Leonida Legend.";
    list.appendChild(li);
    return;
  }
  for (const { trophy, why } of picks) {
    const li = document.createElement("li");
    const name = document.createElement("strong");
    name.textContent = spoilerHidden(trophy) ? "Hidden trophy" : trophy.name;
    li.appendChild(name);
    const desc = document.createElement("div");
    desc.textContent = spoilerHidden(trophy) ? "Hidden until earned." : trophy.description;
    li.appendChild(desc);
    const reason = document.createElement("div");
    reason.className = "why";
    reason.textContent = `${why}${trophy.missable ? " — MISSABLE, do it first." : ""}`;
    li.appendChild(reason);
    list.appendChild(li);
  }
}

function setupTabs() {
  const tabs = document.querySelectorAll("#tabs button");
  for (const tab of tabs) {
    tab.addEventListener("click", () => {
      for (const other of tabs) other.classList.remove("active");
      tab.classList.add("active");
      for (const view of document.querySelectorAll(".view")) view.hidden = true;
      const view = document.getElementById(`view-${tab.dataset.view}`);
      if (view) view.hidden = false;
      if (tab.dataset.view === "roadmap") renderRoadmap();
      if (tab.dataset.view === "missables") renderMissables();
      if (tab.dataset.view === "nextup") renderNextUp();
    });
  }
}

function setupExportImport() {
  document.getElementById("exportBtn").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify({ earned: [...earned].sort() }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leonida-trophy-progress.json";
    a.click();
    URL.revokeObjectURL(url);
  });
  const fileInput = document.getElementById("importFile");
  document.getElementById("importBtn").addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", async () => {
    const file = fileInput.files && fileInput.files[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      const names = new Set(trophies.map((t) => t.name));
      earned = new Set((parsed.earned || []).filter((n) => names.has(n)));
      saveEarned();
      renderProgress();
      renderList();
      renderNextUp();
    } catch (err) {
      alert("That file is not a Leonida Trophy Guide progress export.");
    }
    fileInput.value = "";
  });
  document.getElementById("resetBtn").addEventListener("click", () => {
    if (!confirm("Clear all earned trophies?")) return;
    earned = new Set();
    saveEarned();
    renderProgress();
    renderList();
    renderNextUp();
  });
}

async function init() {
  const response = await fetch(DATA_URL);
  const data = await response.json();
  trophies = data.trophies;
  renderCounts();
  renderProgress();
  renderList();
  renderRoadmap();
  renderMissables();
  renderNextUp();
  setupTabs();
  setupExportImport();
  for (const el of [searchEl, gradeEl, kindEl, spoilerEl, earnedOnlyEl]) {
    el.addEventListener("input", renderList);
    el.addEventListener("change", renderList);
  }
  // Deep links: ?view=roadmap|missables|nextup and ?trophy=<exact name>
  // open a view or a trophy's guide directly, for shared links.
  const params = new URLSearchParams(location.search);
  const view = params.get("view");
  if (view) {
    const tab = document.querySelector(`#tabs button[data-view="${view}"]`);
    if (tab) tab.click();
  }
  const wanted = params.get("trophy");
  if (wanted) {
    const found = trophies.find((t) => t.name === wanted);
    if (found) {
      selected = found.name;
      renderList();
      renderDetail(found);
    }
  }
}

init();
