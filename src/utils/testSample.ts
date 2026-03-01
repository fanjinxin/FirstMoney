import { saveAnswers } from './storage'

const SAMPLE_FLAG_PREFIX = 'psych-tests:isSample:'

function setSampleFlag(testId: string): void {
  try {
    localStorage.setItem(SAMPLE_FLAG_PREFIX + testId, 'true')
  } catch {}
}

export function isSampleData(testId: string): boolean {
  try {
    return localStorage.getItem(SAMPLE_FLAG_PREFIX + testId) === 'true'
  } catch {
    return false
  }
}

export function clearSampleFlag(testId: string): void {
  try {
    localStorage.removeItem(SAMPLE_FLAG_PREFIX + testId)
  } catch {}
}

/**
 * 测试阶段：为指定测评填充示例答案，便于直接跳转结果页查看报告
 */
function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function fillSampleAnswers(testId: 'scl90' | 'rpi' | 'sri' | 'animal' | 'mbti' | 'aat' | 'psych-age' | 'apt' | 'hit' | 'dth' | 'tla' | 'fft' | 'ybt' | 'rvt' | 'lbt' | 'mpt' | 'vbt' | 'city'): void {
  if (testId === 'scl90') {
    const answers: Record<string, number> = {}
    for (let i = 1; i <= 90; i++) {
      answers[`s${i}`] = randomBetween(1, 4)
    }
    saveAnswers('scl90', answers)
    setSampleFlag(testId)
    return
  }

  if (testId === 'animal') {
    const answers: Record<number, number> = {}
    for (let i = 1; i <= 60; i++) {
      answers[i] = randomBetween(0, 2)
    }
    saveAnswers('animal-sculpture', answers)
    setSampleFlag(testId)
    return
  }

  if (testId === 'rpi') {
    const self: Record<string, number> = {}
    const partner: Record<string, number> = {}
    for (let i = 1; i <= 20; i++) {
      self[`self-${i}`] = randomBetween(1, 5)
      partner[`partner-${i}`] = randomBetween(1, 5)
    }
    saveAnswers('rpi-self', self)
    saveAnswers('rpi-partner', partner)
    setSampleFlag(testId)
    return
  }

  if (testId === 'sri') {
    const answers: Record<string, number> = {}
    for (let i = 1; i <= 48; i++) {
      answers[`sri-${i}`] = randomBetween(1, 5)
    }
    saveAnswers('sri', answers)
    setSampleFlag(testId)
    return
  }

  if (testId === 'mbti') {
    const answers: Record<string, number> = {}
    for (let i = 1; i <= 90; i++) {
      answers[`mbti-${i}`] = randomBetween(0, 4) // 5点量表
    }
    saveAnswers('mbti', answers)
    setSampleFlag(testId)
    return
  }

  if (testId === 'aat') {
    const answers: Record<string, number> = {}
    for (let i = 1; i <= 118; i++) {
      answers[String(i)] = randomBetween(0, 2) // 三选一
    }
    saveAnswers('aat', answers)
    setSampleFlag(testId)
    return
  }

  if (testId === 'psych-age') {
    const answers: Record<string, number> = {}
    for (let i = 1; i <= 30; i++) {
      answers[String(i)] = randomBetween(0, 2) // 是/吃不准/否
    }
    saveAnswers('psych-age', answers)
    setSampleFlag(testId)
    return
  }

  if (testId === 'apt') {
    const answers: Record<string, number> = {}
    for (let i = 1; i <= 60; i++) answers[String(i)] = randomBetween(1, 5)
    saveAnswers('apt', answers)
    setSampleFlag(testId)
    return
  }

  if (testId === 'hit') {
    const answers: Record<string, number> = {}
    for (let i = 1; i <= 90; i++) answers[String(i)] = randomBetween(0, 1) // 是/否
    saveAnswers('hit', answers)
    setSampleFlag(testId)
    return
  }

  if (testId === 'dth') {
    const answers: Record<string, number> = {}
    for (let i = 1; i <= 70; i++) answers[String(i)] = randomBetween(1, 5)
    saveAnswers('dth', answers)
    setSampleFlag(testId)
    return
  }

  if (testId === 'tla') {
    const answers: Record<string, number> = {}
    for (let i = 1; i <= 52; i++) answers[String(i)] = randomBetween(1, 5)
    saveAnswers('tla', answers)
    setSampleFlag(testId)
    return
  }

  if (testId === 'fft') {
    const answers: Record<string, number> = {}
    for (let i = 1; i <= 54; i++) answers[String(i)] = randomBetween(0, 2)
    saveAnswers('fft', answers)
    setSampleFlag(testId)
    return
  }

  if (testId === 'ybt') {
    const answers: Record<string, number> = {}
    for (let i = 1; i <= 40; i++) answers[String(i)] = randomBetween(1, 5)
    saveAnswers('ybt', answers)
    setSampleFlag(testId)
    return
  }

  if (testId === 'rvt') {
    const answers: Record<string, number> = {}
    for (let i = 1; i <= 36; i++) answers[String(i)] = randomBetween(1, 5)
    saveAnswers('rvt', answers)
    setSampleFlag(testId)
    return
  }

  if (testId === 'lbt') {
    const answers: Record<string, number> = {}
    for (let i = 1; i <= 20; i++) answers[String(i)] = randomBetween(1, 5)
    saveAnswers('lbt', answers)
    setSampleFlag(testId)
    return
  }

  if (testId === 'mpt') {
    const answers: Record<string, number> = {}
    for (let i = 1; i <= 68; i++) answers[String(i)] = randomBetween(1, 5)
    saveAnswers('mpt', answers)
    setSampleFlag(testId)
    return
  }

  if (testId === 'vbt') {
    const answers: Record<string, number> = {}
    for (let i = 1; i <= 40; i++) answers[String(i)] = randomBetween(1, 5)
    saveAnswers('vbt', answers)
    setSampleFlag(testId)
    return
  }

  if (testId === 'city') {
    const answers: Record<string, number> = {}
    for (let i = 1; i <= 45; i++) answers[String(i)] = randomBetween(1, 5)
    saveAnswers('city', answers)
    setSampleFlag(testId)
    return
  }
}
