import { fftQuestions, FFT_DIMENSIONS, type FFTDimensionId } from '../data/fft'

export interface FFTDimensionScore {
  id: FFTDimensionId
  name: string
  rawScore: number
  maxScore: number
  percent: number
}

export interface FFTResult {
  dimensionScores: FFTDimensionScore[]
  primaryFruit: FFTDimensionScore
}

function getDimensionScore(dimId: FFTDimensionId, answers: Record<string, number>): FFTDimensionScore {
  const dim = FFT_DIMENSIONS.find(d => d.id === dimId)
  if (!dim) throw new Error(`Unknown dimension: ${dimId}`)

  let raw = 0
  for (const q of fftQuestions) {
    if (q.id < dim.qStart || q.id > dim.qEnd) continue
    const ans = answers[String(q.id)]
    if (ans === undefined || ans < 0 || ans > 2) continue
    if (q.scores[ans] === dimId) raw += 1
  }

  const maxScore = dim.qEnd - dim.qStart + 1
  const percent = maxScore > 0 ? Math.round((raw / maxScore) * 100) : 0

  return { id: dimId, name: dim.name, rawScore: raw, maxScore, percent: Math.min(100, percent) }
}

export function calculateFFTResult(answers: Record<string, number>): FFTResult {
  const dimensionScores = FFT_DIMENSIONS.map(d => getDimensionScore(d.id, answers))
  const primaryFruit = [...dimensionScores].sort((a, b) => b.rawScore - a.rawScore)[0]
  return { dimensionScores, primaryFruit }
}
