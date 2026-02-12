import { useMemo } from 'react'
import { calculateMPTResult } from '../../utils/mpt_scoring'
import { loadAnswers } from '../../utils/storage'
import { MPT_TEST_ID } from '../../data/mpt'
import { MPT_DIMENSION_INSIGHTS } from '../../data/mpt_insights'
import StandardResult from '../../components/StandardResult'

export default function MPTResult() {
  const answers = useMemo(() => loadAnswers(MPT_TEST_ID) ?? {}, [])
  const result = useMemo(() => calculateMPTResult(answers), [answers])

  return (
    <StandardResult
      totalQuestions={68}
      answeredCount={Object.keys(answers).length}
      backPath="/mpt"
      backLabel="麋鹿性偏好测试"
      title="MPT 麋鹿性偏好测试"
      subtitle="亲密关系偏好分析"
      dimensionScores={result.dimensionScores.map(d => ({ id: d.id, name: d.name, percent: d.percent }))}
      insights={MPT_DIMENSION_INSIGHTS}
    />
  )
}
