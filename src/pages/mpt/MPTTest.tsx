import StandardTest from '../../components/StandardTest'
import { mptQuestions, MPT_TEST_ID } from '../../data/mpt'
import { loadAnswers, saveAnswers, clearAnswers } from '../../utils/storage'

export default function MPTTest() {
  return (
    <StandardTest
      config={{
        testId: MPT_TEST_ID,
        title: 'MPT 麋鹿性偏好测试',
        subtitle: '探索亲密关系偏好',
        description: '从亲密偏好、激情偏好、浪漫偏好、探索偏好四个维度，了解你在亲密关系中的倾向。本测验仅供成年人自我觉察，不用于诊断。',
        instructions: ['请根据真实感受作答。', '每题五选一。', '选择最符合自己的选项。'],
        questions: mptQuestions.map(q => ({ id: q.id, text: q.text, dimension: q.dimension })),
        options: ['完全不符合', '不太符合', '一般', '比较符合', '完全符合'],
        resultPath: '/mpt/result',
      }}
      loadAnswers={loadAnswers}
      saveAnswers={saveAnswers}
      clearAnswers={clearAnswers}
    />
  )
}
