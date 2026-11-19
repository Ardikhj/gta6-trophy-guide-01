// Roadmap, missables and sources: the planning pages, built from the official
// descriptions and the cited launch guides. Times and difficulty are PowerPyx's.
export const ROADMAP_STEPS = [
  {
    title: 'Step 1 — Play the story, scan and study as you go',
    time: '60–80 hours',
    points: [
      'Finish Chapters 1–5 and the final mission. Story trophies (12 chapter and mission trophies plus the gold for the final mission) unlock by themselves.',
      'Do the Chapter 1 meditation at Jason\u2019s house — the only possibly missable trophy. See the Missables tab before Chapter 1 ends.',
      'Scan every new vehicle with the WAiNK app and study animals with binoculars; progress already counts toward the 100% checklist.',
      'Do optional missions as they appear. They introduce fences, the Key Cloner and bank vaults, and you need any 100 for the checklist.',
      'Keep a manual save at the start and end of each chapter. There is no mission replay.',
    ],
  },
  {
    title: 'Step 2 — The 100% Completion Checklist',
    time: 'About 100 hours',
    points: [
      'The checklist unlocks after the story under Progress, Stats, 100% Completion. It is lenient — roughly 60% true completion.',
      'Finish any 100 optional missions, scan 200 of 277 base-model vehicles, study 100 of 255 animals, complete 300 stunts and any 70 of 80 challenges.',
      'The only tasks that need everything are robberies, underwater discoveries, shooting ranges, drone races and Bret\u2019s quests.',
      'This step earns A Long Road (gold) and most of the activity, collectible and robbery trophies along the way.',
    ],
  },
  {
    title: 'Step 3 — Strangers & Freaks and miscellaneous cleanup',
    time: 'About 10 hours',
    points: [
      'Finish 8 stranger strands — Kirk, Kyle, Yago and Pilot Pete are confirmed to count. Strangers are not needed for 100%, so they may still be open.',
      'Mop up the remaining one-offs: the Vice City plane theft, the Rhino tank, the jewelry store stealth robbery and the Ocean Beach cocktail.',
      'Check the tracker for anything left, then earn the last trophies in any order — the Platinum pops with the 54th.',
    ],
  },
];

export const GUIDE_SOURCES = [
  {
    name: 'Exophase — Grand Theft Auto VI Trophies (PS5)',
    url: 'https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/',
    note: 'The official trophy list: every name, description and grade, with PSN rarity. Cross-checked against PSNProfiles; the two agree on all 55.',
  },
  {
    name: 'PSNProfiles — Grand Theft Auto VI trophies',
    url: 'https://psnprofiles.com/trophies/43531-grand-theft-auto-vi',
    note: 'PSN progress targets (counts) for the trophies that track one, such as the 500 Criminal Profile actions.',
  },
  {
    name: 'PowerPyx — GTA 6 Trophy Guide & Roadmap',
    url: 'https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/',
    note: 'Launch-era guide (18 November 2026): difficulty 4/10, about 200 hours, the Chapter 1 meditation warning, questlines, counts and locations. Our guides are written in our own words from it and never copy its text.',
  },
  {
    name: 'OutputLag — GTA 6 Trophy List',
    url: 'https://outputlag.com/guides/gta-6-trophy-list/',
    note: 'Corroborates the missable meditation, the time-sensitive Yago race and the manual-save advice.',
  },
  {
    name: 'CryptoGames — GTA 6 Trophies and Achievements: Full List and Hard Ones',
    url: 'https://cryptogames.gg/gta-6-trophies-achievements-full-list/',
    note: 'Corroborates the 55-trophy split (27 visible, 28 hidden) and that Positive Mental Attitude is the only trophy reported as possibly missable.',
  },
];

export function renderRoadmap(container) {
  container.replaceChildren();
  for (const step of ROADMAP_STEPS) {
    const card = document.createElement('article');
    card.className = 'step';
    const time = document.createElement('p');
    time.className = 'step-time';
    time.textContent = step.time;
    const heading = document.createElement('h3');
    heading.textContent = step.title;
    const list = document.createElement('ul');
    for (const point of step.points) {
      const item = document.createElement('li');
      item.textContent = point;
      list.append(item);
    }
    card.append(time, heading, list);
    container.append(card);
  }
}

export function renderMissables(container, trophies) {
  container.replaceChildren();
  const missable = trophies.filter((trophy) => trophy.missable);
  for (const trophy of missable) {
    const card = document.createElement('article');
    card.className = 'step';
    const flag = document.createElement('p');
    flag.className = 'step-time';
    flag.textContent = 'Potentially missable — ' + trophy.grade;
    const heading = document.createElement('h3');
    heading.textContent = trophy.name + ' — ' + trophy.description;
    const guide = document.createElement('p');
    guide.className = 'guide-text';
    guide.textContent = trophy.guide;
    card.append(flag, heading, guide);
    container.append(card);
  }
  if (missable.length === 0) {
    const none = document.createElement('p');
    none.textContent = 'No trophy in this list is flagged missable.';
    container.append(none);
  }
}

export function renderSources(container) {
  container.replaceChildren();
  for (const source of GUIDE_SOURCES) {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = source.url;
    link.textContent = source.name;
    link.rel = 'noopener';
    const note = document.createElement('span');
    note.textContent = ' — ' + source.note;
    item.append(link, note);
    container.append(item);
  }
}
