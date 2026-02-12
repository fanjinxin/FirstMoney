import StandardTest from '../../components/StandardTest'
import { tlaQuestions, TLA_TEST_ID } from '../../data/tla'
import { loadAnswers, saveAnswers, clearAnswers } from '../../utils/storage'

const config = {
  testId: TLA_TEST_ID,
  title: 'TLA 年上年下恋爱测试',
  subtitle: '探索你的恋爱偏好',
  description:
    '从年上/年下倾向、照顾欲/被照顾欲四个维度，了解你在亲密关系中的偏好与角色倾向，帮助你更清晰地认识自己的恋爱风格。',
  instructions: [
    '请根据真实感受作答，不必揣测正确答案。',
    '每题五选一：完全不符合 → 完全符合。',
    '选择最符合自己实际状态的选项。',
  ],
  questions: tlaQuestions.map(q => ({ id: q.id, text: q.text, dimension: q.dimension })),
  options: ['完全不符合', '不太符合', '一般', '比较符合', '完全符合'],
  resultPath: '/tla/result',
}

export default function TLATest() {
  return (
    <StandardTest
      config={config}
      loadAnswers={loadAnswers}
      saveAnswers={saveAnswers}
      clearAnswers={clearAnswers}
    />
  )
}
