import { useMemo } from 'react'
import { calculateVBTResult } from '../../utils/vbt_scoring'
import { loadAnswers } from '../../utils/storage'
import { VBT_TEST_ID } from '../../data/vbt'
import { VBT_DIMENSION_INSIGHTS } from '../../data/vbt_insights'
import StandardResult from '../../components/StandardResult'

export default function VBTResult() {
  const answers = useMemo(() => loadAnswers(VBT_TEST_ID) ?? {}, [])
  const result = useMemo(() => calculateVBTResult(answers), [answers])

  return (
    <StandardResult
      totalQuestions={40}
      answeredCount={Object.keys(answers).length}
      backPath="/vbt"
      backLabel="易被欺负测试"
      title="VBT 易被欺负测试"
      subtitle={`易被欺负指数：${result.vulnerabilityIndex}（越高越需注意边界与自我主张）`}
      dimensionScores={result.dimensionScores.map(d => ({ id: d.id, name: d.name, percent: d.percent }))}
      insights={VBT_DIMENSION_INSIGHTS}
    />
  )
}
