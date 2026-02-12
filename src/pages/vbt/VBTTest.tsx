import StandardTest from '../../components/StandardTest'
import { vbtQuestions, VBT_TEST_ID } from '../../data/vbt'
import { loadAnswers, saveAnswers, clearAnswers } from '../../utils/storage'

export default function VBTTest() {
  return (
    <StandardTest
      config={{
        testId: VBT_TEST_ID,
        title: 'VBT 易被欺负测试',
        subtitle: '了解你的边界与应对方式',
        description: '从边界清晰度、自我主张、敏感度、应对方式四个维度，探索你在人际中是否容易受到不当对待，以及如何更好地保护自己。',
        instructions: ['请根据真实感受作答。', '每题五选一。', '选择最符合自己的选项。'],
        questions: vbtQuestions.map(q => ({ id: q.id, text: q.text, dimension: q.dimension })),
        options: ['完全不符合', '不太符合', '一般', '比较符合', '完全符合'],
        resultPath: '/vbt/result',
      }}
      loadAnswers={loadAnswers}
      saveAnswers={saveAnswers}
      clearAnswers={clearAnswers}
    />
  )
}
