// Leonida Platinum — offline GTA VI trophy guide & tracker.
// Loads app/data/trophies.json (same origin, no network), keeps progress in
// localStorage, and renders the tracker, roadmap, missable and sources views.
const STORAGE_KEY = 'leonida-platinum-v1';
const KIND_FILTERS = [
  ['all', 'All trophies'],
  ['story', 'Story'],
  ['missable', 'Missable'],
  ['collectible', 'Collectibles'],
  ['activity', 'Activities'],
  ['robbery', 'Robberies'],
  ['exploration', 'Exploration'],
  ['side', 'Side quests'],
  ['money', 'Money'],
  ['online', 'Online'],
];
const GRADE_LABELS = { platinum: 'Platinum', gold: 'Gold', silver: 'Silver', bronze: 'Bronze' };
const KIND_LABELS = {
  platinum: 'Platinum', completion: '100% completion', story: 'Story', activity: 'Activity',
  side: 'Side quest', collectible: 'Collectible', robbery: 'Robbery',
  exploration: 'Exploration', money: 'Money', misc: 'One-off',
};

const params = new URLSearchParams(location.search);
const demoCount = Number(params.get('demo') ?? '');
const demoMode = Number.isFinite(demoCount) && demoCount > 0;

const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;
const byName = new Map(trophies.map((t) => [t.name, t]));
const byId = new Map(trophies.map((t) => [t.id, t]));

let earned = new Set();
let spoilers = true;
try {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
  if (saved && Array.isArray(saved.earned)) earned = new Set(saved.earned.filter((n) => byName.has(n)));
  if (saved && typeof saved.spoilers === 'boolean') spoilers = saved.spoilers;
} catch {
  earned = new Set();
}
if (demoMode) {
  earned = new Set(trophies.slice(0, Math.min(demoCount, trophies.length)).map((t) => t.name));
}
if (params.get('spoilers') === 'off') spoilers = false;
if (params.get('spoilers') === 'on') spoilers = true;

let view = params.get('view') ?? 'tracker';
let kindFilter = params.get('filter') ?? 'all';
let gradeFilter = 'all';
let query = params.get('q') ?? '';
let hideEarned = false;
let selectedId = Number(params.get('trophy') ?? '') || 28;

const $ = (id) => document.getElementById(id);
const listEl = $('trophyList');
const detailEl = $('detailPane');

function saveProgress() {
  if (demoMode) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ earned: [...earned], spoilers }));
  } catch {
    // Private mode or full storage: progress still works for this session.
  }
}

function isHiddenBySpoilers(trophy) {
  return spoilers && trophy.kind === 'story' && !earned.has(trophy.name);
}

function trophyMatches(trophy) {
  if (kindFilter === 'missable' && !trophy.missable) return false;
  if (kindFilter === 'online') return false;
  if (kindFilter !== 'all' && kindFilter !== 'missable' && trophy.kind !== kindFilter) return false;
  if (gradeFilter !== 'all' && trophy.grade !== gradeFilter) return false;
  if (hideEarned && earned.has(trophy.name)) return false;
  if (query) {
    const hay = `${trophy.name} ${trophy.description} ${trophy.guide} ${trophy.kind}`.toLowerCase();
    if (!hay.includes(query.toLowerCase())) return false;
  }
  return true;
}

function gradeTag(trophy) {
  return GRADE_LABELS[trophy.grade];
}

function renderProgress() {
  const total = trophies.length;
  const pct = Math.round((earned.size / total) * 100);
  $('earnedCount').textContent = String(earned.size);
  $('progressLabel').textContent = `${pct}% to the platinum`;
  $('progressFill').style.width = `${pct}%`;
  $('progressBar').setAttribute('aria-valuenow', String(earned.size));
  const parts = ['platinum', 'gold', 'silver', 'bronze'].map((g) => {
    const got = trophies.filter((t) => t.grade === g && earned.has(t.name)).length;
    const all = trophies.filter((t) => t.grade === g).length;
    return `${gradeTag({ grade: g })} ${got}/${all}`;
  });
  $('gradeCounts').textContent = parts.join(' · ');
  $('platinumNote').textContent = earned.size === total
    ? 'Platinum earned — you are a Leonida Legend!'
    : `Earn the other ${total - earned.size} to unlock Vice Got a Price!`;
}

function renderFilters() {
  const wrap = $('kindFilters');
  wrap.replaceChildren();
  for (const [key, label] of KIND_FILTERS) {
    const count = key === 'all' ? trophies.length
      : key === 'missable' ? trophies.filter((t) => t.missable).length
      : key === 'online' ? 0
      : trophies.filter((t) => t.kind === key).length;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `filter-btn${kindFilter === key ? ' active' : ''}`;
    btn.textContent = `${label} `;
    const n = document.createElement('span');
    n.className = 'count';
    n.textContent = `(${count})`;
    btn.append(n);
    btn.addEventListener('click', () => { kindFilter = key; renderFilters(); renderList(); });
    wrap.append(btn);
  }
}

function targetChip(trophy) {
  if (trophy.target == null) return '';
  const unit = trophy.id === 48 ? 'actions' : trophy.id === 52 || trophy.id === 53 ? '$' : '';
  const label = unit === '$' ? `$${trophy.target.toLocaleString('en-US')}` : `${trophy.target.toLocaleString('en-US')} ${unit}`.trim();
  return label;
}

function renderList() {
  const visible = trophies.filter(trophyMatches);
  $('listMeta').textContent = kindFilter === 'online'
    ? 'Online trophies: none. All 55 trophies are single-player and offline — nothing here to track.'
    : `Showing ${visible.length} of ${trophies.length} trophies — ${earned.size} earned. Click a trophy to read its guide.`;
  listEl.replaceChildren();
  if (visible.length === 0) {
    const note = document.createElement('p');
    note.className = 'empty-note';
    note.textContent = kindFilter === 'online'
      ? 'No online trophies exist for GTA VI: every trophy is earned in single-player, offline. The full list is under All trophies.'
      : 'No trophies match these filters. Clear the search or pick another kind.';
    listEl.append(note);
  }
  for (const trophy of visible) {
    const row = document.createElement('button');
    row.type = 'button';
    row.className = `trophy-row${earned.has(trophy.name) ? ' earned' : ''}${selectedId === trophy.id ? ' selected' : ''}`;
    row.setAttribute('role', 'listitem');
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(trophy.name);
    box.setAttribute('aria-label', `Earned: ${trophy.name}`);
    box.addEventListener('click', (event) => event.stopPropagation());
    box.addEventListener('change', () => {
      if (box.checked) earned.add(trophy.name);
      else earned.delete(trophy.name);
      saveProgress();
      renderProgress();
      renderList();
    });
    const main = document.createElement('div');
    main.className = 'trophy-main';
    const name = document.createElement('div');
    name.className = 'trophy-name';
    name.textContent = isHiddenBySpoilers(trophy) ? 'Hidden story trophy' : trophy.name;
    const desc = document.createElement('div');
    desc.className = 'trophy-desc';
    desc.textContent = isHiddenBySpoilers(trophy)
      ? 'Hidden until earned — turn the spoiler setting off to reveal it.'
      : trophy.description;
    const tags = document.createElement('div');
    tags.className = 'trophy-tags';
    const grade = document.createElement('span');
    grade.className = `tag grade-${trophy.grade}`;
    grade.textContent = gradeTag(trophy);
    tags.append(grade);
    const kind = document.createElement('span');
    kind.className = `tag kind-${trophy.kind}`;
    kind.textContent = KIND_LABELS[trophy.kind] ?? trophy.kind;
    if (kind.textContent !== gradeTag(trophy)) tags.append(kind);
    if (trophy.missable) {
      const miss = document.createElement('span');
      miss.className = 'tag missable';
      miss.textContent = '⚠ Missable';
      tags.append(miss);
    }
    const chip = targetChip(trophy);
    if (chip) {
      const target = document.createElement('span');
      target.className = 'tag target';
      target.textContent = chip;
      tags.append(target);
    }
    main.append(name, desc, tags);
    row.append(box, main);
    row.addEventListener('click', () => { selectedId = trophy.id; renderList(); renderDetail(); });
    listEl.append(row);
  }
  if (!visible.some((t) => t.id === selectedId) && visible.length > 0) selectedId = visible[0].id;
  renderDetail();
}

function sourceLinks() {
  return (doc.sources ?? []).map((s) => {
    const url = s.slice(s.lastIndexOf('https://'));
    const label = s.slice(0, s.lastIndexOf('https://')).replace(/ — $/, '').trim();
    return { label, url };
  });
}

function renderDetail() {
  const trophy = byId.get(selectedId) ?? trophies[0];
  if (!trophy) return;
  detailEl.replaceChildren();
  if (isHiddenBySpoilers(trophy)) {
    const h = document.createElement('h2');
    h.textContent = 'Hidden story trophy';
    const p = document.createElement('p');
    p.className = 'detail-empty';
    p.textContent = 'This is a story trophy, hidden until you earn it. Turn the spoiler setting off (above the list) to reveal its name, description and guide — or tick it off once you have earned it in the game.';
    detailEl.append(h, p);
    return;
  }
  const h = document.createElement('h2');
  h.textContent = trophy.name;
  const desc = document.createElement('p');
  desc.className = 'detail-desc';
  desc.textContent = `Official description: ${trophy.description}`;
  const tags = document.createElement('div');
  tags.className = 'trophy-tags';
  const kindLabel = KIND_LABELS[trophy.kind] ?? trophy.kind;
  for (const [text, cls] of [
    [gradeTag(trophy), `tag grade-${trophy.grade}`],
    ...(kindLabel !== gradeTag(trophy) ? [[kindLabel, 'tag']] : []),
    ...(trophy.missable ? [['⚠ Missable — see the Missable tab', 'tag missable']] : []),
    ...(targetChip(trophy) ? [[`Target: ${targetChip(trophy)}`, 'tag target']] : []),
  ]) {
    const span = document.createElement('span');
    span.className = cls;
    span.textContent = text;
    tags.append(span);
  }
  if (trophy.missable) {
    const banner = document.createElement('p');
    banner.className = 'missable-banner';
    banner.textContent = 'Potentially missable — read the Chapter 1 warning in this guide before the chapter ends.';
    detailEl.append(h, desc, tags, banner);
  } else {
    detailEl.append(h, desc, tags);
  }
  const guide = document.createElement('p');
  guide.className = 'detail-guide';
  const sourcesMarker = ' Sources: ';
  const idx = trophy.guide.lastIndexOf(sourcesMarker);
  guide.textContent = idx === -1 ? trophy.guide : trophy.guide.slice(0, idx);
  detailEl.append(guide);
  const sourcesBox = document.createElement('div');
  sourcesBox.className = 'detail-sources';
  const sourcesTitle = document.createElement('h4');
  sourcesTitle.textContent = 'Sources for this guide';
  sourcesBox.append(sourcesTitle);
  const list = document.createElement('ul');
  const guideSources = idx === -1 ? '' : trophy.guide.slice(idx + sourcesMarker.length);
  const links = sourceLinks();
  let matched = false;
  for (const { label, url } of links) {
    const key = label.split(' — ')[0].split(' ')[0];
    if (guideSources.includes(key) || guideSources.includes(label)) {
      matched = true;
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = label;
      li.append(a);
      list.append(li);
    }
  }
  if (!matched) {
    const li = document.createElement('li');
    li.textContent = 'Official list on Exophase (name, description, grade).';
    list.append(li);
  }
  const note = document.createElement('li');
  note.textContent = 'Guide text is original to this entry — sources are cited, never copied.';
  list.append(note);
  sourcesBox.append(list);
  detailEl.append(sourcesBox);
}

function renderRoadmapFacts() {
  const facts = [
    ['~200 h', 'to the platinum (PowerPyx)'],
    ['4 / 10', 'difficulty — long, not hard'],
    ['1', 'playthrough needed'],
    ['0', 'online trophies'],
    ['5', 'chapters, 60–80 h of story'],
    ['15', 'manual save slots — no mission replay'],
  ];
  const strip = $('factStrip');
  strip.replaceChildren();
  for (const [value, label] of facts) {
    const div = document.createElement('div');
    div.className = 'fact';
    const b = document.createElement('b');
    b.textContent = value;
    const span = document.createElement('span');
    span.textContent = label;
    div.append(b, span);
    strip.append(div);
  }
  const rows = [
    ['Stunts', '250 for the trophy · 300 for 100% · 397 total'],
    ['Shooting Range', '42 gold medals · 12 locations'],
    ['Top Fun drone races', '1 win at each of 14 locations · 42 races'],
    ['Races', '20 different wins · 40 unique locations'],
    ['Meditation spots', '18 spots · 10 locations · 15 for 100%'],
    ['WAiNK scans', '100 locations · 31 landmarks, 35 curiosities, 23 sculptures'],
    ['Vehicles', '100 discovered · 200 of 277 base models for 100%'],
    ['Animals', '100 of 255 studied with binoculars (for 100%)'],
    ['Challenges', '50 for the trophy · 70 of 80 for 100%'],
    ['Bank vaults', '5 for the trophy · all 8 for 100%'],
    ['Gang operations', '1 per gang (9) for the trophy · all 39 for 100%'],
    ['Collectible card sets', '3 sets for the trophy · 18 sets exist'],
    ['Garages', '8 purchasable · $160,000 total'],
    ['Marked bills', '$250,000 laundered through fences'],
    ['Criminal Profile actions', '500 actions'],
  ];
  const table = $('countsTable');
  table.replaceChildren();
  const head = document.createElement('tr');
  for (const text of ['What', 'The number to hit']) {
    const th = document.createElement('th');
    th.textContent = text;
    head.append(th);
  }
  table.append(head);
  for (const [what, number] of rows) {
    const tr = document.createElement('tr');
    const a = document.createElement('td');
    a.textContent = what;
    const b = document.createElement('td');
    b.textContent = number;
    tr.append(a, b);
    table.append(tr);
  }
}

function renderMissable() {
  const t = trophies.find((x) => x.missable);
  const card = $('missableCard');
  card.replaceChildren();
  const h = document.createElement('h3');
  h.textContent = `⚠ ${t.name} — the only potentially missable trophy`;
  const p1 = document.createElement('p');
  p1.textContent = 'Meditate at every spot across Leonida (18 spots, 10 locations). One meditation can only be done in Chapter 1: after the mission Down to Earth, talk to Lucia in the kitchen in the morning, follow her to the balcony and choose Accept. It is gone once Chapter 1 ends, and it is still unconfirmed whether it is required — PowerPyx earned the trophy after doing it, so do it to be safe.';
  const p2 = document.createElement('p');
  p2.textContent = 'Everything else on this page is safe: the other 54 trophies can all be earned after the story in free-roam. Keep a manual save at the start of Chapter 1 as insurance, and never use cheats on a trophy save.';
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'filter-btn';
  btn.textContent = 'Open its full guide in the tracker';
  btn.addEventListener('click', () => {
    selectedId = t.id;
    spoilers = false;
    $('spoilerToggle').checked = false;
    saveProgress();
    showView('tracker');
    kindFilter = 'all';
    renderFilters();
    renderList();
  });
  card.append(h, p1, p2, btn);
}

function renderSources() {
  const list = $('sourceList');
  list.replaceChildren();
  for (const { label, url } of sourceLinks()) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = label;
    li.append(a);
    list.append(li);
  }
}

function showView(next) {
  view = next;
  for (const section of ['tracker', 'roadmap', 'missable', 'sources']) {
    $(`view${section[0].toUpperCase()}${section.slice(1)}`).classList.toggle('hidden', section !== next);
    $(`tab${section[0].toUpperCase()}${section.slice(1)}`).classList.toggle('active', section === next);
  }
  $('controls').style.display = next === 'tracker' ? '' : 'none';
}

for (const section of ['tracker', 'roadmap', 'missable', 'sources']) {
  $(`tab${section[0].toUpperCase()}${section.slice(1)}`).addEventListener('click', () => showView(section));
}
$('search').value = query;
$('search').addEventListener('input', (e) => { query = e.target.value; renderList(); });
$('gradeFilter').addEventListener('change', (e) => { gradeFilter = e.target.value; renderList(); });
$('hideEarned').addEventListener('change', (e) => { hideEarned = e.target.checked; renderList(); });
$('spoilerToggle').checked = spoilers;
$('spoilerToggle').addEventListener('change', (e) => {
  spoilers = e.target.checked;
  saveProgress();
  renderList();
});
$('exportBtn').addEventListener('click', () => {
  const payload = { game: 'Grand Theft Auto VI', exportedAt: new Date().toISOString(), earned: [...earned] };
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
  a.download = 'leonida-platinum-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
  $('saveNote').textContent = `Exported ${earned.size} earned trophies.`;
});
$('importFile').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const names = Array.isArray(data) ? data : data.earned;
    if (!Array.isArray(names)) throw new Error('no earned list');
    const valid = names.filter((n) => byName.has(n));
    earned = new Set(valid);
    saveProgress();
    renderProgress();
    renderList();
    $('saveNote').textContent = `Imported ${valid.length} earned trophies (${names.length - valid.length} unknown names ignored).`;
  } catch {
    $('saveNote').textContent = 'Import failed: that file is not a Leonida Platinum progress export.';
  }
  e.target.value = '';
});
$('resetBtn').addEventListener('click', () => {
  if (!window.confirm('Clear all earned trophies? This cannot be undone.')) return;
  earned = new Set();
  saveProgress();
  renderProgress();
  renderList();
  $('saveNote').textContent = 'Progress reset.';
});

renderProgress();
renderFilters();
renderRoadmapFacts();
renderMissable();
renderSources();
if (kindFilter !== 'all' && !KIND_FILTERS.some(([k]) => k === kindFilter)) kindFilter = 'all';
showView(['tracker', 'roadmap', 'missable', 'sources'].includes(view) ? view : 'tracker');
renderList();
