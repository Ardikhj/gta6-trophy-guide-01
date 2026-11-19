// Progress store: the earned set lives in localStorage and can be exported
// to a file or imported back. Nothing is sent anywhere.
export const STORAGE_KEY = 'gta6-trophy-guide-progress-v1';

export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((name) => typeof name === 'string'));
  } catch {
    return new Set();
  }
}

export function saveProgress(earned) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...earned].sort()));
}

export function exportProgress(earned) {
  const payload = {
    app: 'leonida-platinum-gta6-trophy-guide',
    version: 1,
    exportedAt: new Date().toISOString(),
    earned: [...earned].sort(),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'gta6-trophy-progress.json';
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

export async function importProgressFile(file, knownNames) {
  const text = await file.text();
  const parsed = JSON.parse(text);
  const names = Array.isArray(parsed) ? parsed : parsed.earned;
  if (!Array.isArray(names)) throw new Error('That file does not hold a list of trophy names.');
  const known = new Set(knownNames);
  const earned = new Set();
  for (const name of names) {
    if (typeof name === 'string' && known.has(name)) earned.add(name);
  }
  return earned;
}
