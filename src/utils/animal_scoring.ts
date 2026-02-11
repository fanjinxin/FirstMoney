
import { AnimalDimension, AnimalQuestion, AnimalArchetype, animalQuestions, animalArchetypes } from '../data/animal_sculpture';

export interface AnimalResultData {
  scores: Record<AnimalDimension, number>; // 0-10 scale
  mainAnimal: AnimalArchetype;
  secondaryAnimal: AnimalArchetype;
  radarData: { subject: string; A: number; fullMark: number }[];
  compoundDimensions: {
    socialEnergy: number; // E + A
    resilience: number;   // C + (10-N)
    drive: number;        // E + C
    adaptability: number; // O + A
  };
}

export function calculateAnimalResult(answers: Record<string | number, number>): AnimalResultData {
  const rawScores: Record<AnimalDimension, number> = { E: 0, A: 0, C: 0, N: 0, O: 0 };
  const maxScores: Record<AnimalDimension, number> = { E: 0, A: 0, C: 0, N: 0, O: 0 };

  // 1. Calculate Raw Scores and Max Possible Scores
  animalQuestions.forEach((q) => {
    // Max possible for this question
    const maxOptionScores: Record<AnimalDimension, number> = { E: 0, A: 0, C: 0, N: 0, O: 0 };
    q.options.forEach(opt => {
      (Object.keys(opt.score) as AnimalDimension[]).forEach(dim => {
        if (opt.score[dim]! > maxOptionScores[dim]) {
          maxOptionScores[dim] = opt.score[dim]!;
        }
      });
    });
    
    // Add to total max
    (Object.keys(maxScores) as AnimalDimension[]).forEach(dim => {
      maxScores[dim] += maxOptionScores[dim];
    });

    // User score
    const selectedIndex = answers[q.id];
    if (selectedIndex !== undefined && q.options[selectedIndex]) {
      const selectedScore = q.options[selectedIndex].score;
      (Object.keys(selectedScore) as AnimalDimension[]).forEach(dim => {
        rawScores[dim] += selectedScore[dim]!;
      });
    }
  });

  // 2. Normalize to 0-10
  const normalizedScores: Record<AnimalDimension, number> = { E: 0, A: 0, C: 0, N: 0, O: 0 };
  (Object.keys(rawScores) as AnimalDimension[]).forEach(dim => {
    // Avoid division by zero if a dimension is never used (unlikely)
    normalizedScores[dim] = maxScores[dim] > 0 ? (rawScores[dim] / maxScores[dim]) * 10 : 0;
  });

  // 3. Find Closest Archetypes (Euclidean Distance)
  const distances = animalArchetypes.map(animal => {
    let sumSq = 0;
    (Object.keys(normalizedScores) as AnimalDimension[]).forEach(dim => {
      const diff = normalizedScores[dim] - animal.dimensions[dim];
      sumSq += diff * diff;
    });
    return { animal, distance: Math.sqrt(sumSq) };
  });

  distances.sort((a, b) => a.distance - b.distance);

  const mainAnimal = distances[0].animal;
  const secondaryAnimal = distances[1].animal;

  // 4. Prepare Radar Data
  const dimensionLabels: Record<AnimalDimension, string> = {
    E: '外向性 (E)',
    A: '亲和性 (A)',
    C: '尽责性 (C)',
    N: '敏感性 (N)',
    O: '开放性 (O)'
  };

  const radarData = (Object.keys(normalizedScores) as AnimalDimension[]).map(dim => ({
    subject: dimensionLabels[dim],
    A: parseFloat(normalizedScores[dim].toFixed(2)),
    fullMark: 10
  }));

  // 5. Calculate Compound Dimensions
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
    compoundDimensions
  };
}
