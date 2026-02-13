/**
 * VBT 易被欺负计分 - 移植自 src/utils/vbt_scoring.ts
 * vulnerabilityIndex = 50 - protectAvg/2 + sensitive/2，0-100 越高越易被欺负
 */
const { vbtQuestions, VBT_DIMENSIONS } = require('../data/vbt');

function getLevel(dimId, percent) {
  if (dimId === 'sensitive') {
    if (percent <= 45) return 'low';
    if (percent >= 70) return 'high';
    return 'moderate';
  }
  if (percent <= 45) return 'low';
  if (percent >= 70) return 'high';
  return 'moderate';
}

function getDimensionScore(dimId, answers) {
  const dim = VBT_DIMENSIONS.find(d => d.id === dimId);
  if (!dim) return null;

  let raw = 0;
  for (let q = dim.qStart; q <= dim.qEnd; q++) {
    const ans = answers[String(q)];
    if (ans === undefined || ans < 1 || ans > 5) continue;
    const qData = vbtQuestions.find(x => x.id === q);
    raw += qData && qData.reverse ? 6 - ans : ans;
  }

  const maxScore = (dim.qEnd - dim.qStart + 1) * 5;
  const percent = maxScore > 0 ? Math.round((raw / maxScore) * 100) : 0;
  const cappedPercent = Math.min(100, percent);
  return {
    id: dimId,
    name: dim.name,
    rawScore: raw,
    maxScore,
    percent: cappedPercent,
    level: getLevel(dimId, cappedPercent),
  };
}

function getVulnerabilityZone(index) {
  if (index <= 20) return 'low';
  if (index <= 40) return 'low_mid';
  if (index <= 60) return 'mid';
  if (index <= 80) return 'mid_high';
  return 'high';
}

function getProfileKey(dimensionScores, vulnerabilityIndex) {
  const b = dimensionScores.find(d => d.id === 'boundary');
  const a = dimensionScores.find(d => d.id === 'assertive');
  const c = dimensionScores.find(d => d.id === 'cope');
  const s = dimensionScores.find(d => d.id === 'sensitive');
  if (!b || !a || !c || !s) return 'robust';

  const protectLow = (p) => p < 50;
  const protectVeryLow = (p) => p < 40;
  const sensitiveHigh = s.percent >= 65;

  const weakCount = [b, a, c].filter(d => protectLow(d.percent)).length;
  if (weakCount >= 2 && vulnerabilityIndex >= 60) return 'risk_high';
  if (weakCount >= 2) return 'combo_weak';
  if (protectVeryLow(b.percent) && (protectLow(a.percent) || protectLow(c.percent))) return 'boundary_weak';
  if (protectVeryLow(b.percent)) return 'boundary_weak';
  if (protectVeryLow(a.percent)) return 'assertive_weak';
  if (protectVeryLow(c.percent)) return 'cope_weak';
  if (sensitiveHigh && (protectLow(b.percent) || protectLow(a.percent) || protectLow(c.percent))) return 'sensitive_high';
  if (sensitiveHigh && vulnerabilityIndex >= 55) return 'sensitive_high';
  if (b.percent >= 60 && a.percent >= 60 && c.percent >= 60 && s.percent <= 55) return 'robust';
  return 'robust';
}

function calculateVBTResult(answers) {
  const dimensionScores = VBT_DIMENSIONS.map(d => getDimensionScore(d.id, answers)).filter(Boolean);
  const b = dimensionScores.find(d => d.id === 'boundary')?.percent ?? 0;
  const a = dimensionScores.find(d => d.id === 'assertive')?.percent ?? 0;
  const c = dimensionScores.find(d => d.id === 'cope')?.percent ?? 0;
  const protectAvg = Math.round((b + a + c) / 3);
  const sensitive = dimensionScores.find(d => d.id === 'sensitive')?.percent ?? 0;
  const vulnerabilityIndex = Math.round(50 - protectAvg / 2 + sensitive / 2);
  const clamped = Math.min(100, Math.max(0, vulnerabilityIndex));

  const protectDims = dimensionScores.filter(d => d.id !== 'sensitive');
  const weakest = [...dimensionScores].sort((x, y) => {
    if (x.id === 'sensitive') return 1;
    if (y.id === 'sensitive') return -1;
    return x.percent - y.percent;
  })[0] ?? null;
  const strongestProtect = protectDims.length > 0 ? protectDims.reduce((best, d) => (d.percent > best.percent ? d : best)) : null;

  return {
    dimensionScores,
    vulnerabilityIndex: clamped,
    vulnerabilityZone: getVulnerabilityZone(clamped),
    protectAvg,
    profileKey: getProfileKey(dimensionScores, clamped),
    weakestDimension: weakest,
    strongestProtectDimension: strongestProtect,
  };
}

module.exports = { calculateVBTResult };
