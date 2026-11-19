// Filtering and the spoiler rule: with spoilers hidden, story trophies show
// only a placeholder name and description until they are earned.
export const KIND_LABELS = {
  story: 'Story',
  missable: 'Missable',
  collectible: 'Collectibles',
  activity: 'Activities',
  side: 'Side quests',
  crime: 'Crime & robberies',
  exploration: 'Exploration',
  money: 'Money & property',
  platinum: 'Platinum & 100%',
};

export function kindLabel(kind) {
  return KIND_LABELS[kind] ?? kind;
}

export function isSpoilerHidden(trophy, spoilerOn, earned) {
  return spoilerOn && trophy.kind === 'story' && !earned.has(trophy.name);
}

export function filterTrophies(trophies, options, earned) {
  const query = options.query.trim().toLowerCase();
  return trophies.filter((trophy) => {
    if (options.kind !== 'all') {
      if (options.kind === 'missable') {
        if (!trophy.missable) return false;
      } else if (trophy.kind !== options.kind) {
        return false;
      }
    }
    if (options.grade !== 'all' && trophy.grade !== options.grade) return false;
    if (options.onlyMissing && earned.has(trophy.name)) return false;
    if (query) {
      const haystack = `${trophy.name} ${trophy.description} ${trophy.guide}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
}

export function gradeCounts(trophies, earned) {
  const counts = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  for (const trophy of trophies) {
    if (earned.has(trophy.name)) counts[trophy.grade] += 1;
  }
  return counts;
}
