import { saveAnswers } from './storage'

/**
 * 测试阶段：为指定测评填充示例答案，便于直接跳转结果页查看报告
 */
function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function fillSampleAnswers(testId: 'scl90' | 'rpi' | 'sri'): void {
  if (testId === 'scl90') {
    const answers: Record<string, number> = {}
    for (let i = 1; i <= 90; i++) {
      answers[`s${i}`] = randomBetween(1, 4)
    }
    saveAnswers('scl90', answers)
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
    return
  }

  if (testId === 'sri') {
    const answers: Record<string, number> = {}
    for (let i = 1; i <= 48; i++) {
      answers[`sri-${i}`] = randomBetween(1, 5)
    }
    saveAnswers('sri', answers)
    return
  }
}
