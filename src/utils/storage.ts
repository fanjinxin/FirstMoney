const prefix = 'psych-tests'

export function saveAnswers(testId: string, answers: Record<string, number>) {
  localStorage.setItem(`${prefix}:${testId}:answers`, JSON.stringify(answers))
}

export function loadAnswers(testId: string): Record<string, number> | null {
  const raw = localStorage.getItem(`${prefix}:${testId}:answers`)
  if (!raw) return null
  try {
    return JSON.parse(raw) as Record<string, number>
  } catch {
    return null
  }
}

export function clearAnswers(testId: string) {
  localStorage.removeItem(`${prefix}:${testId}:answers`)
}
