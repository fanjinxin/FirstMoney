import StandardTest from '../../components/StandardTest'
import { rvtQuestions, RVT_TEST_ID } from '../../data/rvt'
import { loadAnswers, saveAnswers, clearAnswers } from '../../utils/storage'

export default function RVTTest() {
  return (
    <StandardTest
      config={{
        testId: RVT_TEST_ID,
        title: 'RVT 恋爱观测试',
        subtitle: '探索你的爱情观',
        description: '基于 Lee 六种爱情风格（Eros 浪漫情欲 / Ludus 游戏 / Storge 友谊 / Mania 占有 / Pragma 现实 / Agape 奉献），了解你对爱情的信念与期待，帮助你更清晰自己的恋爱观。',
        instructions: ['请根据真实感受作答。', '每题五选一。', '选择最符合自己的选项。'],
        questions: rvtQuestions.map(q => ({ id: q.id, text: q.text, dimension: q.dimension })),
        options: ['完全不同意', '不太同意', '一般', '比较同意', '完全同意'],
        resultPath: '/rvt/result',
      }}
      loadAnswers={loadAnswers}
      saveAnswers={saveAnswers}
      clearAnswers={clearAnswers}
    />
  )
}
