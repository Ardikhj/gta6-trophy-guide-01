// Leonida Platinum boot: load the trophy data, render the checklist with its
// guide pane, and wire the tracker controls, tabs and save handling.
import { loadProgress, saveProgress, exportProgress, importProgressFile } from './store.js';
import { kindLabel, isSpoilerHidden, filterTrophies, gradeCounts } from './filters.js';
import { renderRoadmap, renderMissables, renderSources } from './roadmap.js';

const listEl = document.getElementById('trophyList');
const detailEl = document.getElementById('detailPane');
const searchEl = document.getElementById('search');
const kindEl = document.getElementById('kindFilter');
const gradeEl = document.getElementById('gradeFilter');
const onlyMissingEl = document.getElementById('onlyMissing');
const spoilerEl = document.getElementById('spoilerToggle');
const metaEl = document.getElementById('listMeta');

const response = await fetch('data/trophies.json');
const doc = await response.json();
const trophies = doc.trophies;
const earned = loadProgress();
let selectedName = null;

document.getElementById('missableCount').textContent = String(
  trophies.filter((trophy) => trophy.missable).length,
);
renderRoadmap(document.getElementById('roadmapSteps'));
renderMissables(document.getElementById('missableList'), trophies);
renderSources(document.getElementById('sourceList'));

function targetLabel(trophy) {
  if (trophy.target == null) return null;
  if (trophy.name === 'Dime on the Dollar') return 'Target: $250,000';
  if (trophy.name === 'Treat Yo Self') return 'Target: $100,000';
  return 'Target: ' + trophy.target;
}

function displayName(trophy) {
  return isSpoilerHidden(trophy, spoilerEl.checked, earned)
    ? 'Hidden story trophy'
    : trophy.name;
}

function displayDescription(trophy) {
  return isSpoilerHidden(trophy, spoilerEl.checked, earned)
    ? 'A story trophy — its name and description stay hidden until you earn it. Tick it off when it pops.'
    : trophy.description;
}

function renderProgress() {
  document.getElementById('earnedCount').textContent = String(earned.size);
  document.getElementById('progressFill').style.width = (earned.size / trophies.length * 100) + '%';
  const counts = gradeCounts(trophies, earned);
  document.getElementById('gradeCounts').textContent =
    counts.platinum + ' platinum · ' + counts.gold + ' gold · ' +
    counts.silver + ' silver · ' + counts.bronze + ' bronze';
}

function renderDetail(trophy) {
  detailEl.replaceChildren();
  if (!trophy) {
    const empty = document.createElement('p');
    empty.className = 'detail-empty';
    empty.textContent = 'Select a trophy to read its full guide, sources and missable warning.';
    detailEl.append(empty);
    return;
  }
  const heading = document.createElement('h2');
  heading.textContent = displayName(trophy);
  const official = document.createElement('div');
  official.className = 'official';
  const officialTitle = document.createElement('p');
  officialTitle.innerHTML = '<strong>Official:</strong> ';
  const officialText = document.createElement('span');
  officialText.textContent = displayDescription(trophy) + ' — ' + trophy.grade;
  officialTitle.append(officialText);
  official.append(officialTitle);
  detailEl.append(heading, official);
  if (trophy.missable) {
    const warn = document.createElement('p');
    warn.className = 'warn';
    warn.textContent = '⚠ Potentially missable — read the guide before you pass the point of no return.';
    detailEl.append(warn);
  }
  const guideHeading = document.createElement('h3');
  guideHeading.textContent = 'Guide';
  const guide = document.createElement('p');
  guide.className = 'guide-text';
  guide.textContent = isSpoilerHidden(trophy, spoilerEl.checked, earned)
    ? 'This is a story trophy. Its guide stays hidden with its name until you earn it — tick it off when it pops to reveal the guide.'
    : trophy.guide;
  detailEl.append(guideHeading, guide);
  if (!isSpoilerHidden(trophy, spoilerEl.checked, earned) && trophy.sources) {
    const sourcesHeading = document.createElement('h3');
    sourcesHeading.textContent = 'Sources';
    const sources = document.createElement('ul');
    sources.className = 'sources';
    for (const source of trophy.sources) {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = source.url;
      link.textContent = source.name;
      link.rel = 'noopener';
      item.append(link);
      sources.append(item);
    }
    detailEl.append(sourcesHeading, sources);
  }
  const target = targetLabel(trophy);
  if (target) {
    const targetNote = document.createElement('p');
    targetNote.className = 'list-meta';
    targetNote.textContent = target;
    detailEl.append(targetNote);
  }
}

function renderList() {
  const visible = filterTrophies(trophies, {
    query: searchEl.value,
    kind: kindEl.value,
    grade: gradeEl.value,
    onlyMissing: onlyMissingEl.checked,
  }, earned);
  metaEl.textContent = 'Showing ' + visible.length + ' of ' + trophies.length +
    ' trophies · ' + earned.size + ' earned · ' +
    (spoilerEl.checked ? 'spoilers hidden' : 'spoilers shown');
  listEl.replaceChildren();
  if (visible.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'empty';
    empty.textContent = 'No trophies match these filters.';
    listEl.append(empty);
    return;
  }
  for (const trophy of visible) {
    const item = document.createElement('li');
    item.className = 'trophy-card' + (earned.has(trophy.name) ? ' earned' : '') +
      (selectedName === trophy.name ? ' selected' : '');
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(trophy.name);
    box.setAttribute('aria-label', 'Earned: ' + displayName(trophy));
    box.addEventListener('click', (event) => event.stopPropagation());
    box.addEventListener('change', () => {
      if (box.checked) earned.add(trophy.name);
      else earned.delete(trophy.name);
      saveProgress(earned);
      renderProgress();
      renderList();
      renderDetail(trophy);
    });
    const body = document.createElement('div');
    const name = document.createElement('p');
    name.className = 'trophy-name';
    name.textContent = displayName(trophy);
    if (isSpoilerHidden(trophy, spoilerEl.checked, earned)) {
      const tag = document.createElement('span');
      tag.className = 'spoiler-tag';
      tag.textContent = ' · hidden';
      name.append(tag);
    }
    const desc = document.createElement('p');
    desc.className = 'trophy-desc';
    desc.textContent = displayDescription(trophy);
    const meta = document.createElement('div');
    meta.className = 'trophy-meta';
    const gradeBadge = document.createElement('span');
    gradeBadge.className = 'badge ' + trophy.grade;
    gradeBadge.textContent = trophy.grade;
    meta.append(gradeBadge);
    const kindBadge = document.createElement('span');
    kindBadge.className = 'badge kind';
    kindBadge.textContent = kindLabel(trophy.kind);
    meta.append(kindBadge);
    if (trophy.missable) {
      const missableBadge = document.createElement('span');
      missableBadge.className = 'badge missable';
      missableBadge.textContent = 'Missable';
      meta.append(missableBadge);
    }
    const target = targetLabel(trophy);
    if (target) {
      const targetBadge = document.createElement('span');
      targetBadge.className = 'badge target';
      targetBadge.textContent = target;
      meta.append(targetBadge);
    }
    const preview = document.createElement('p');
    preview.className = 'trophy-guide-preview';
    preview.textContent = isSpoilerHidden(trophy, spoilerEl.checked, earned)
      ? 'Guide hidden until earned.'
      : trophy.guide.slice(0, 180) + (trophy.guide.length > 180 ? '…' : '');
    body.append(name, desc, meta, preview);
    const checkCell = document.createElement('div');
    checkCell.append(box);
    item.append(checkCell, body);
    item.addEventListener('click', () => {
      selectedName = trophy.name;
      renderList();
      renderDetail(trophy);
    });
    listEl.append(item);
  }
}

function refresh() {
  renderProgress();
  renderList();
  const selected = trophies.find((trophy) => trophy.name === selectedName) ?? null;
  renderDetail(selected);
}

for (const control of [searchEl, kindEl, gradeEl, onlyMissingEl, spoilerEl]) {
  control.addEventListener('input', renderList);
  control.addEventListener('change', renderList);
}
spoilerEl.addEventListener('change', () => {
  renderList();
  refresh();
});

document.getElementById('exportBtn').addEventListener('click', () => exportProgress(earned));
document.getElementById('importFile').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const imported = await importProgressFile(file, trophies.map((trophy) => trophy.name));
    earned.clear();
    for (const name of imported) earned.add(name);
    saveProgress(earned);
    refresh();
  } catch (error) {
    window.alert('Could not import that file: ' + error.message);
  }
  event.target.value = '';
});
document.getElementById('resetBtn').addEventListener('click', () => {
  if (window.confirm('Clear all earned trophies?')) {
    earned.clear();
    saveProgress(earned);
    refresh();
  }
});

document.getElementById('tabs').addEventListener('click', (event) => {
  const button = event.target.closest('.tab');
  if (!button) return;
  for (const tab of document.querySelectorAll('.tab')) {
    tab.classList.toggle('active', tab === button);
  }
  for (const view of document.querySelectorAll('.view')) {
    view.classList.toggle('active', view.id === 'view-' + button.dataset.view);
  }
});

refresh();
