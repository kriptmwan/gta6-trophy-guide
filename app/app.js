// Leonida Trophy Guide — offline checklist, filters, spoiler setting, export/import.
// No network requests besides the local trophies.json fetch; progress lives in localStorage.
(function () {
  'use strict';

  var STORE_KEY = 'gta6-trophy-guide-earned-v1';
  var params = new URLSearchParams(location.search);

  var trophies = [];
  var sourceIndex = {};
  var earned = new Set(loadEarned());
  var spoilerOn = params.get('spoiler') !== 'off';
  var currentView = params.get('view') || 'checklist';
  var openId = params.get('trophy') || null;

  var listEl = document.getElementById('trophyList');
  var detailEl = document.getElementById('detail');
  var emptyNote = document.getElementById('emptyNote');
  var searchEl = document.getElementById('search');
  var kindEl = document.getElementById('kindFilter');
  var gradeEl = document.getElementById('gradeFilter');
  var hideEl = document.getElementById('hideEarned');
  var spoilerEl = document.getElementById('spoilerToggle');

  function loadEarned() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter(function (x) { return typeof x === 'string'; }) : [];
    } catch (e) { return []; }
  }

  function saveEarned() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(Array.from(earned).sort())); } catch (e) { /* storage full or blocked */ }
  }

  function seedIfRequested() {
    var seed = parseInt(params.get('seed') || '0', 10);
    if (!seed || seed <= 0) return;
    if (earned.size > 0) return; // never overwrite a real save
    trophies.slice(0, seed).forEach(function (t) { earned.add(t.id); });
    saveEarned();
  }

  function gradeLabel(g) {
    return g.charAt(0).toUpperCase() + g.slice(1);
  }

  function kindLabel(k) {
    var labels = {
      story: 'Story', stranger: 'Strangers & Freaks', collectible: 'Collectible',
      activity: 'Activity', robbery: 'Robbery', combat: 'Combat',
      exploration: 'Exploration', platinum: 'Platinum', online: 'Online'
    };
    return labels[k] || k;
  }

  function isSpoilered(t) {
    return spoilerOn && t.kind === 'story' && !earned.has(t.id);
  }

  function displayName(t) {
    return isSpoilered(t) ? 'Hidden story trophy' : t.name;
  }

  function displayDesc(t) {
    return isSpoilered(t) ? 'A story trophy — its name and description stay hidden until you earn it.' : t.description;
  }

  function sourceLinks(t) {
    return (t.sources || []).map(function (key) {
      var s = sourceIndex[key];
      if (!s) return '';
      return '<a href="' + s.url + '" target="_blank" rel="noopener">' + escapeHtml(s.name) + '</a>';
    }).join('');
  }

  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function rowHtml(t) {
    var isEarned = earned.has(t.id);
    var flags = '';
    if (t.missable) flags += '<span class="flag">Missable</span>';
    if (t.hidden) flags += '<span class="flag hidden-flag">Hidden</span>';
    return '<li class="row' + (isEarned ? ' earned' : '') + '" data-id="' + t.id + '">' +
      '<input type="checkbox" ' + (isEarned ? 'checked' : '') + ' aria-label="Earned: ' + escapeHtml(displayName(t)) + '">' +
      '<div><div class="name">' + escapeHtml(displayName(t)) + flags + '</div>' +
      '<div class="desc">' + escapeHtml(displayDesc(t)) + '</div>' +
      '<div class="meta">' + escapeHtml(t.target || '') + '</div></div>' +
      '<div class="grade grade-' + t.grade + '"><span class="dot"></span>' + gradeLabel(t.grade) +
      '<span class="kind">' + kindLabel(t.kind) + '</span></div></li>';
  }

  function filtered() {
    var q = (searchEl.value || '').trim().toLowerCase();
    var kind = kindEl.value;
    var grade = gradeEl.value;
    return trophies.filter(function (t) {
      if (kind === 'online') return false; // GTA VI has no online trophies
      if (kind !== 'all' && t.kind !== kind) return false;
      if (grade !== 'all' && t.grade !== grade) return false;
      if (hideEl.checked && earned.has(t.id)) return false;
      if (q && (t.name + ' ' + t.description + ' ' + (t.guide || '')).toLowerCase().indexOf(q) === -1) return false;
      return true;
    });
  }

  function renderList() {
    var rows = filtered();
    listEl.innerHTML = rows.map(rowHtml).join('');
    emptyNote.hidden = rows.length > 0;
  }

  function renderProgress() {
    var total = trophies.length;
    var n = earned.size;
    document.getElementById('earnedCount').textContent = String(n);
    document.getElementById('progressFill').style.width = (total ? (n / total * 100) : 0) + '%';
    document.getElementById('progressBar').setAttribute('aria-valuenow', String(n));
    var byGrade = {};
    trophies.forEach(function (t) {
      byGrade[t.grade] = byGrade[t.grade] || { got: 0, all: 0 };
      byGrade[t.grade].all += 1;
      if (earned.has(t.id)) byGrade[t.grade].got += 1;
    });
    document.getElementById('gradeCounts').textContent =
      ['platinum', 'gold', 'silver', 'bronze'].map(function (g) {
        var b = byGrade[g] || { got: 0, all: 0 };
        return gradeLabel(g) + ' ' + b.got + '/' + b.all;
      }).join(' · ') + ' · Hidden ' +
      trophies.filter(function (t) { return t.hidden && earned.has(t.id); }).length + '/' +
      trophies.filter(function (t) { return t.hidden; }).length + ' revealed';
    var next = trophies.find(function (t) { return !earned.has(t.id) && t.kind !== 'platinum'; });
    document.getElementById('nextUp').innerHTML = next
      ? 'Next up: <strong>' + escapeHtml(displayName(next)) + '</strong> — ' + escapeHtml(next.target || '')
      : 'All done — the platinum is yours.';
  }

  function renderMissables() {
    var box = document.getElementById('missableList');
    var miss = trophies.filter(function (t) { return t.missable; });
    document.getElementById('missableBadge').textContent = String(miss.length);
    box.innerHTML = miss.map(function (t) {
      return '<article class="detail" style="margin-top:12px"><h2>' + escapeHtml(t.name) + '</h2>' +
        '<p class="dmeta">' + gradeLabel(t.grade) + ' · ' + escapeHtml(t.target || '') + '</p>' +
        '<p class="warn"><strong>Possibly missable.</strong> Do this in Chapter 1 — it cannot be repeated later.</p>' +
        '<p>' + escapeHtml(t.guide) + '</p>' +
        '<p class="src">Sources: ' + sourceLinks(t) + '</p></article>';
    }).join('');
  }

  function openDetail(id) {
    var t = trophies.find(function (x) { return x.id === id; });
    if (!t) { detailEl.hidden = true; detailEl.innerHTML = ''; return; }
    openId = id;
    if (isSpoilered(t)) {
      detailEl.innerHTML = '<h2>Hidden story trophy</h2>' +
        '<p class="dmeta">' + gradeLabel(t.grade) + ' · Story</p>' +
        '<p>This story trophy is hidden by your spoiler setting. Earn it in the game (or turn spoilers off) to read its guide.</p>' +
        '<button type="button" class="close">Close</button>';
    } else {
      detailEl.innerHTML = '<h2>' + escapeHtml(t.name) + '</h2>' +
        '<p class="dmeta">' + gradeLabel(t.grade) + ' · ' + kindLabel(t.kind) +
        (t.hidden ? ' · Hidden on PlayStation until earned' : '') + ' · ' + escapeHtml(t.target || '') + '</p>' +
        (t.missable ? '<p class="warn"><strong>Possibly missable.</strong> See the guide — do the Chapter 1 step before the chapter ends.</p>' : '') +
        '<p>' + escapeHtml(t.guide) + '</p>' +
        '<p class="src">Sources: ' + sourceLinks(t) + '</p>' +
        '<button type="button" class="close">Close</button>';
    }
    detailEl.hidden = false;
    detailEl.querySelector('.close').addEventListener('click', function () {
      detailEl.hidden = true; detailEl.innerHTML = ''; openId = null;
    });
    // The detail pane sits directly below the (possibly filtered) list.
  }

  function showView(name) {
    currentView = name;
    document.querySelectorAll('.tab').forEach(function (b) {
      var active = b.getAttribute('data-view') === name;
      b.classList.toggle('active', active);
      if (active) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
    });
    document.getElementById('view-checklist').hidden = name !== 'checklist';
    document.getElementById('view-roadmap').hidden = name !== 'roadmap';
    document.getElementById('view-missables').hidden = name !== 'missables';
    if (name === 'missables') renderMissables();
  }

  function refresh() {
    renderList();
    renderProgress();
    if (openId) openDetail(openId);
  }

  function exportProgress() {
    var blob = new Blob([JSON.stringify({ game: 'Grand Theft Auto VI', earned: Array.from(earned).sort() }, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'gta6-trophy-progress.json';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  function importProgress(file) {
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var data = JSON.parse(String(reader.result));
        var ids = Array.isArray(data) ? data : data.earned;
        if (!Array.isArray(ids)) throw new Error('no earned list');
        var known = new Set(trophies.map(function (t) { return t.id; }));
        earned = new Set(ids.filter(function (id) { return known.has(id); }));
        saveEarned();
        refresh();
      } catch (e) {
        alert('That file does not look like exported trophy progress.');
      }
    };
    reader.readAsText(file);
  }

  // events
  listEl.addEventListener('click', function (ev) {
    var row = ev.target.closest('.row');
    if (!row) return;
    var id = row.getAttribute('data-id');
    if (ev.target.tagName === 'INPUT') {
      if (ev.target.checked) earned.add(id); else earned.delete(id);
      saveEarned();
      refresh();
      return;
    }
    openDetail(id);
  });
  [searchEl, kindEl, gradeEl, hideEl].forEach(function (el) {
    el.addEventListener('input', renderList);
  });
  spoilerEl.addEventListener('change', function () {
    spoilerOn = spoilerEl.checked;
    refresh();
  });
  document.querySelectorAll('.tab').forEach(function (b) {
    b.addEventListener('click', function () { showView(b.getAttribute('data-view')); });
  });
  document.getElementById('exportBtn').addEventListener('click', exportProgress);
  document.getElementById('importBtn').addEventListener('click', function () {
    document.getElementById('importFile').click();
  });
  document.getElementById('importFile').addEventListener('change', function (ev) {
    if (ev.target.files && ev.target.files[0]) importProgress(ev.target.files[0]);
    ev.target.value = '';
  });

  // boot
  spoilerEl.checked = spoilerOn;
  var presetQ = params.get('q');
  if (presetQ) searchEl.value = presetQ;
  fetch('data/trophies.json')
    .then(function (r) { if (!r.ok) throw new Error('trophies.json failed to load'); return r.json(); })
    .then(function (data) {
      sourceIndex = data.sources || {};
      trophies = data.trophies || [];
      seedIfRequested();
      showView(currentView);
      refresh();
      if (openId) openDetail(openId);
    })
    .catch(function () {
      listEl.innerHTML = '<li class="row"><div><div class="name">Could not load the trophy list</div><div class="desc">trophies.json failed to load. Check the files are served together and reload.</div></div></li>';
    });
})();
