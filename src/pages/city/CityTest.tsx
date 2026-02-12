import StandardTest from '../../components/StandardTest'
import { cityQuestions, CITY_TEST_ID } from '../../data/city'
import { loadAnswers, saveAnswers, clearAnswers } from '../../utils/storage'

export default function CityTest() {
  return (
    <StandardTest
      config={{
        testId: CITY_TEST_ID,
        title: '你最宜居的城市测试',
        subtitle: '发现适合你的城市类型',
        description: '从气候、生活节奏、文化氛围、成本、社交需求五个维度，了解你理想城市的特征，为择城提供参考。',
        instructions: ['请根据真实偏好作答。', '每题五选一。', '选择最符合自己的选项。'],
        questions: cityQuestions.map(q => ({ id: q.id, text: q.text, dimension: q.dimension })),
        options: ['完全不符合', '不太符合', '一般', '比较符合', '完全符合'],
        resultPath: '/city/result',
      }}
      loadAnswers={loadAnswers}
      saveAnswers={saveAnswers}
      clearAnswers={clearAnswers}
    />
  )
}
