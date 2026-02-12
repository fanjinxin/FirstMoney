import StandardTest from '../../components/StandardTest'
import { ybtQuestions, YBT_TEST_ID } from '../../data/ybt'
import { loadAnswers, saveAnswers, clearAnswers } from '../../utils/storage'

export default function YBTTest() {
  return (
    <StandardTest
      config={{
        testId: YBT_TEST_ID,
        title: 'YBT 病娇测试',
        subtitle: '了解你的恋爱占有倾向',
        description: '从占有欲、控制欲、依赖度、极端倾向四个维度，探索你在亲密关系中的倾向。本测验仅供娱乐与自我觉察，不用于诊断。',
        instructions: ['请根据真实感受作答。', '每题五选一。', '不必揣测正确答案。'],
        questions: ybtQuestions.map(q => ({ id: q.id, text: q.text, dimension: q.dimension })),
        options: ['完全不符合', '不太符合', '一般', '比较符合', '完全符合'],
        resultPath: '/ybt/result',
      }}
      loadAnswers={loadAnswers}
      saveAnswers={saveAnswers}
      clearAnswers={clearAnswers}
    />
  )
}
