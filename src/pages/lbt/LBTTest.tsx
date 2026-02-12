import StandardTest from '../../components/StandardTest'
import { lbtQuestions, LBT_TEST_ID } from '../../data/lbt'
import { loadAnswers, saveAnswers, clearAnswers } from '../../utils/storage'

export default function LBTTest() {
  return (
    <StandardTest
      config={{
        testId: LBT_TEST_ID,
        title: 'LBT 恋爱脑测试',
        subtitle: '了解你在恋爱中的投入程度',
        description: '恋爱脑指在恋爱中过度投入、易失去自我的倾向。通过 20 道题目，了解你在感情中的投入程度与平衡能力。',
        instructions: ['请根据真实感受作答。', '每题五选一。', '选择最符合自己的选项。'],
        questions: lbtQuestions.map(q => ({ id: q.id, text: q.text })),
        options: ['完全不符合', '不太符合', '一般', '比较符合', '完全符合'],
        resultPath: '/lbt/result',
      }}
      loadAnswers={loadAnswers}
      saveAnswers={saveAnswers}
      clearAnswers={clearAnswers}
    />
  )
}
