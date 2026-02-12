import { useMemo } from 'react'
import { calculateCityResult } from '../../utils/city_scoring'
import { loadAnswers } from '../../utils/storage'
import { CITY_TEST_ID } from '../../data/city'
import { CITY_DIMENSION_INSIGHTS } from '../../data/city_insights'
import StandardResult from '../../components/StandardResult'

export default function CityResult() {
  const answers = useMemo(() => loadAnswers(CITY_TEST_ID) ?? {}, [])
  const result = useMemo(() => calculateCityResult(answers), [answers])

  return (
    <StandardResult
      totalQuestions={45}
      answeredCount={Object.keys(answers).length}
      backPath="/city"
      backLabel="宜居城市测试"
      title="你最宜居的城市测试"
      subtitle={`推荐类型：${result.suggestedType}`}
      dimensionScores={result.dimensionScores.map(d => ({ id: d.id, name: d.name, percent: d.percent }))}
      insights={CITY_DIMENSION_INSIGHTS}
    />
  )
}
