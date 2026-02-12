/**
 * 动物塑测试计分逻辑 - 移植自 src/utils/animal_scoring.ts
 */
const { animalQuestions, animalArchetypes } = require('../data/animal_sculpture');

const DIMS = ['E', 'A', 'C', 'N', 'O'];
const NEUTRAL = 5;

function optionProfile(score) {
  const profile = { E: NEUTRAL, A: NEUTRAL, C: NEUTRAL, N: NEUTRAL, O: NEUTRAL };
  DIMS.forEach(dim => {
    if (score[dim] != null) profile[dim] = score[dim];
  });
  return profile;
}

function euclidean(a, b) {
  let sumSq = 0;
  DIMS.forEach(dim => {
    const d = (a[dim] || 0) - (b[dim] || 0);
    sumSq += d * d;
  });
  return Math.sqrt(sumSq);
}

function similarity(distance) {
  return 1 / (1 + distance);
}

function optionWeight(profile) {
  const center = { E: 5, A: 5, C: 5, N: 5, O: 5 };
  const centerDist = euclidean(profile, center);
  return Math.min(1.5, 0.5 + centerDist / 5);
}

function calculateAnimalResult(answers) {
  const rawScores = { E: 0, A: 0, C: 0, N: 0, O: 0 };
  const maxScores = { E: 0, A: 0, C: 0, N: 0, O: 0 };
  const animalAffinity = {};
  animalArchetypes.forEach(a => { animalAffinity[a.id] = 0; });

  animalQuestions.forEach(q => {
    const maxOptionScores = { E: 0, A: 0, C: 0, N: 0, O: 0 };
    q.options.forEach(opt => {
      DIMS.forEach(dim => {
        const v = (opt.score && opt.score[dim]) || 0;
        if (v > maxOptionScores[dim]) maxOptionScores[dim] = v;
      });
    });
    DIMS.forEach(dim => { maxScores[dim] += maxOptionScores[dim]; });

    const idx = answers[q.id];
    if (idx == null || !q.options[idx]) return;

    const opt = q.options[idx];
    const score = opt.score || {};
    DIMS.forEach(dim => {
      if (score[dim] != null) rawScores[dim] += score[dim];
    });

    const profile = optionProfile(score);
    const weight = optionWeight(profile);
    animalArchetypes.forEach(animal => {
      const dist = euclidean(profile, animal.dimensions);
      animalAffinity[animal.id] += weight * similarity(dist);
    });
  });

  const normalizedScores = { E: 0, A: 0, C: 0, N: 0, O: 0 };
  DIMS.forEach(dim => {
    normalizedScores[dim] = maxScores[dim] > 0 ? (rawScores[dim] / maxScores[dim]) * 10 : NEUTRAL;
  });

  const byAffinity = animalArchetypes
    .map(a => ({ animal: a, affinity: animalAffinity[a.id] }))
    .sort((a, b) => b.affinity - a.affinity);

  const mainAnimal = byAffinity[0].animal;
  const secondaryAnimal = byAffinity[1].animal;

  const dimensionLabels = { E: '外向性 (E)', A: '亲和性 (A)', C: '尽责性 (C)', N: '敏感性 (N)', O: '开放性 (O)' };
  const radarData = DIMS.map(dim => ({
    subject: dimensionLabels[dim],
    A: parseFloat(normalizedScores[dim].toFixed(2)),
    fullMark: 10,
  }));

  const compoundDimensions = {
    socialEnergy: (normalizedScores.E + normalizedScores.A) / 2,
    resilience: (normalizedScores.C + (10 - normalizedScores.N)) / 2,
    drive: (normalizedScores.E + normalizedScores.C) / 2,
    adaptability: (normalizedScores.O + normalizedScores.A) / 2,
  };

  return {
    scores: normalizedScores,
    mainAnimal,
    secondaryAnimal,
    radarData,
    compoundDimensions,
  };
}

module.exports = { calculateAnimalResult };
