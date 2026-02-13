/**
 * 计分逻辑 - 从 src/utils 移植
 */
const { scl90Test } = require('../data/scl90');
const { lbtQuestions, LBT_DIMENSIONS } = require('../data/lbt');
const { mbtiQuestions, mbtiTypeInfos } = require('../data/mbti');
const { rpiTest } = require('../data/rpi');
const { sriTest, sriReverseScoreIds } = require('../data/sri');
const { calculateAATResult } = require('./aat_scoring');
const { calculatePsychAgeResult } = require('./psych_age_scoring');
const { calculateAPTResult } = require('./apt_scoring');
const { calculateHITResult } = require('./hit_scoring');
const { calculateDTHResult } = require('./dth_scoring');
const { calculateTLAResult } = require('./tla_scoring');
const { calculateFFTResult } = require('./fft_scoring');
const { calculateYBTResult } = require('./ybt_scoring');
const { calculateRVTResult } = require('./rvt_scoring');
const { calculateMPTResult } = require('./mpt_scoring');
const { calculateVBTResult } = require('./vbt_scoring');
const { calculateCityResult } = require('./city_scoring');

/* ========== SCL90 ========== - 完整移植自 src/utils/scoring.ts */
const scl90FactorConfig = [
  { id: 'somatization', name: '躯体化', ids: [1, 4, 12, 27, 40, 42, 48, 49, 52, 53, 56, 58], description: '身体不适、心慌、胸闷、肠胃不适等', detail: '近期可能出现头痛、心慌、肠胃不适、肌肉紧张、呼吸不畅等身体反应，多与压力和情绪相关。' },
  { id: 'obsession', name: '强迫症状', ids: [3, 9, 10, 28, 38, 45, 46, 51, 55, 65], description: '反复思考、反复检查、控制不住', detail: '存在反复思考、反复检查、追求完美、难以控制的思维或行为倾向。' },
  { id: 'interpersonal', name: '人际关系敏感', ids: [6, 21, 34, 36, 37, 41, 61, 69, 73], description: '自卑、敏感、在意他人评价', detail: '在社交中易自卑、敏感、在意评价、不自在、感觉不被理解。' },
  { id: 'depression', name: '抑郁', ids: [5, 14, 15, 20, 22, 26, 29, 30, 31, 32, 54, 71, 79], description: '情绪低落、兴趣下降、无望感', detail: '情绪偏低落，兴趣下降、精力不足、无助、自责、消极想法增多。' },
  { id: 'anxiety', name: '焦虑', ids: [2, 17, 23, 33, 39, 57, 72, 78, 80, 85], description: '紧张、担心、坐立不安、恐惧', detail: '明显紧张不安、过度担心、心慌、坐立不安、容易恐惧。' },
  { id: 'hostility', name: '敌对', ids: [11, 24, 63, 67, 74, 81], description: '易怒、烦躁、冲动', detail: '情绪易激惹，烦躁、易怒，有冲动或攻击性想法。' },
  { id: 'phobic', name: '恐怖', ids: [13, 25, 47, 50, 70, 75, 82], description: '怕场所、怕人多、怕单独出门', detail: '对场所、人群、外出等存在明显恐惧与回避。' },
  { id: 'paranoid', name: '偏执', ids: [8, 18, 43, 68, 76, 83], description: '多疑、不信任、感觉被针对', detail: '偏多疑、不信任他人、感觉被议论、被针对。' },
  { id: 'psychotic', name: '精神病性', ids: [7, 16, 35, 62, 77, 84, 88, 90], description: '思维异常、不真实感、疏远感', detail: '存在思维不真实、疏远感、怪异想法等体验。' },
  { id: 'sleep', name: '其他（睡眠饮食）', ids: [19, 44, 59, 60, 64, 66], description: '失眠、早醒、食欲问题', detail: '存在睡眠紊乱、食欲异常、早醒、死亡想法等。' }
];

function getAnswerByNumber(answers, number) {
  const v = answers['s' + number];
  return typeof v === 'number' ? v : 1;
}

function calculateScl90Scores(answers) {
  const scores = [];
  for (let i = 1; i <= 90; i++) scores.push(getAnswerByNumber(answers, i));
  const totalScore = scores.reduce((s, v) => s + v, 0);
  const avgTotal = totalScore / 90;
  const positiveCount = scores.filter(v => v >= 2).length;
  const negativeCount = 90 - positiveCount;
  const positiveAvg = positiveCount > 0 ? (totalScore - negativeCount) / positiveCount : 0;

  const factors = scl90FactorConfig.map(item => {
    const factorScores = item.ids.map(id => scores[id - 1]);
    const factorAvg = factorScores.reduce((s, v) => s + v, 0) / factorScores.length;
    const level = factorAvg < 2 ? 'normal' : factorAvg < 3 ? 'mild' : factorAvg < 4 ? 'moderate' : 'severe';
    const levelLabel = level === 'normal' ? '正常' : level === 'mild' ? '轻度' : level === 'moderate' ? '中度' : '重度';
    return { id: item.id, name: item.name, score: factorAvg, level, levelLabel, count: item.ids.length, description: item.description, detail: item.detail };
  });

  const totalLevel = totalScore < 160 ? '正常' : totalScore < 250 ? '轻度困扰' : totalScore < 350 ? '中度困扰' : '重度困扰';
  const top3Factors = [...factors].sort((a, b) => b.score - a.score).slice(0, 3);
  const symptomDist = [
    { name: '正常', value: scores.filter(v => v === 1).length },
    { name: '轻度', value: scores.filter(v => v === 2).length },
    { name: '中度', value: scores.filter(v => v === 3).length },
    { name: '偏重', value: scores.filter(v => v === 4).length },
    { name: '严重', value: scores.filter(v => v === 5).length }
  ];
  return { basic: { totalScore, avgTotal, positiveCount, negativeCount, positiveAvg, totalLevel }, factors, top3Factors, symptomDist };
}

/* ========== LBT ========== */
function getLBTLevel(percent) {
  if (percent <= 40) return 'low';
  if (percent >= 65) return 'high';
  return 'moderate';
}

function calculateLBTResult(answers) {
  let raw = 0;
  for (const q of lbtQuestions) {
    const ans = answers[String(q.id)];
    if (ans === undefined || ans < 1 || ans > 5) continue;
    raw += q.reverse ? 6 - ans : ans;
  }
  const maxTotalScore = lbtQuestions.length * 5;
  const percent = Math.min(100, Math.round((raw / maxTotalScore) * 100));
  const level = getLBTLevel(percent);
  const dimensionScores = LBT_DIMENSIONS.map(dim => {
    let dimRaw = 0;
    for (const qId of dim.qIds) {
      const ans = answers[String(qId)];
      if (ans === undefined || ans < 1 || ans > 5) continue;
      const q = lbtQuestions.find(x => x.id === qId);
      dimRaw += q && q.reverse ? 6 - ans : ans;
    }
    const maxScore = dim.qIds.length * 5;
    const dimPercent = Math.min(100, Math.round((dimRaw / maxScore) * 100));
    return { id: dim.id, name: dim.name, rawScore: dimRaw, maxScore, percent: dimPercent, level: getLBTLevel(dimPercent) };
  });
  return { totalScore: raw, maxTotalScore, percent, levelKey: level, level: level === 'low' ? '低' : level === 'high' ? '高' : '适中', dimensionScores };
}

/* ========== MBTI ========== - 移植自 src/utils/mbti_scoring.ts */
const MBTI_DIMENSION_LABELS = {
  EI: '外向-内向 (E/I)',
  SN: '实感-直觉 (S/N)',
  TF: '思考-情感 (T/F)',
  JP: '判断-知觉 (J/P)'
};

const MBTI_POLE_LABELS = {
  E: '外向', I: '内向', S: '实感', N: '直觉',
  T: '思考', F: '情感', J: '判断', P: '知觉'
};

function getMBTIScoreContribution(value) {
  if (value === 0) return { forA: 2, forB: 0 };
  if (value === 1) return { forA: 1, forB: 0 };
  if (value === 2) return { forA: 0, forB: 0 };
  if (value === 3) return { forA: 0, forB: 1 };
  if (value === 4) return { forA: 0, forB: 2 };
  return { forA: 0, forB: 0 };
}

function calculateMBTIResult(answers) {
  const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
  mbtiQuestions.forEach(q => {
    const v = answers[q.id];
    if (v !== undefined && v >= 0 && v <= 4) {
      const { forA, forB } = getMBTIScoreContribution(v);
      scores[q.optionA.pole] += forA;
      scores[q.optionB.pole] += forB;
    }
  });
  const dimensionPairs = [['EI', ['E', 'I']], ['SN', ['S', 'N']], ['TF', ['T', 'F']], ['JP', ['J', 'P']]];
  let type = '';
  const dimensionScores = [];
  const radarData = [];
  dimensionPairs.forEach(([dim, [poleA, poleB]]) => {
    const scoreA = scores[poleA];
    const scoreB = scores[poleB];
    const total = scoreA + scoreB;
    const dominant = scoreA >= scoreB ? poleA : poleB;
    const percentage = total > 0 ? Math.round((Math.max(scoreA, scoreB) / total) * 100) : 50;
    type += dominant;
    dimensionScores.push({
      dimension: dim,
      poleA,
      poleB,
      scoreA,
      scoreB,
      dominant,
      dominantLabel: MBTI_POLE_LABELS[dominant],
      poleALabel: MBTI_POLE_LABELS[poleA],
      poleBLabel: MBTI_POLE_LABELS[poleB],
      percentage,
      label: MBTI_DIMENSION_LABELS[dim]
    });
    const value = total > 0 ? 5 + (scoreA - scoreB) / total * 5 : 5;
    radarData.push({ subject: MBTI_DIMENSION_LABELS[dim], A: Math.max(0, Math.min(10, value)), fullMark: 10 });
  });
  const typeInfo = mbtiTypeInfos[type] || { type, name: type, nameEn: type, slogan: '独特的你', description: '基于你的作答，你呈现出的性格特质组合。', strengths: [], weaknesses: [], career: [], relationships: '', workStyle: '', stressCoping: '' };
  return { type, typeInfo, dimensionScores, radarData };
}

/* ========== RPI ========== - 与 Web src/utils/scoring.ts 一致 */
const RPI_DIMENSION_ORDER = ['control', 'jealousy', 'dependency', 'security'];
const RPI_LEVEL_LABELS = { low: '低', moderate: '适中', high: '偏高', veryHigh: '极高' };

function buildRpiPerspectiveSummary(questions, answers) {
  const buckets = {};
  RPI_DIMENSION_ORDER.forEach(id => { buckets[id] = []; });
  questions.forEach(q => {
    const v = answers[q.id];
    if (v === undefined) return;
    if (buckets[q.dimension]) buckets[q.dimension].push(v);
  });
  const answered = Object.values(buckets).flat().length;
  if (answered === 0) return null;
  const dimensionScores = RPI_DIMENSION_ORDER.map(dimId => {
    const list = buckets[dimId] || [];
    const dim = rpiTest.dimensions.find(d => d.id === dimId);
    const scoreSum = list.reduce((s, v) => s + v, 0);
    const scoreMean = list.length ? scoreSum / list.length : 0;
    const level = scoreSum <= 10 ? 'low' : scoreSum <= 15 ? 'moderate' : scoreSum <= 20 ? 'high' : 'veryHigh';
    const levelLabel = RPI_LEVEL_LABELS[level];
    const hint = scoreMean < 2.1 ? dim.lowHint : scoreMean < 3.1 ? dim.midHint : dim.highHint;
    return { id: dimId, name: dim.name, scoreSum, scoreMean, scoreMeanStr: scoreMean.toFixed(2), level, levelLabel, hint };
  });
  const total = dimensionScores.reduce((s, d) => s + d.scoreSum, 0);
  const levelLabel = total <= 25 ? '低占有欲' : total <= 50 ? '适中占有欲' : total <= 75 ? '偏高占有欲' : '极高占有欲';
  return { total, level: levelLabel, levelLabel, dimensionScores, answered };
}

/** RPI 双视角计分：answersSelf / answersPartner 分别对应 rpi-self / rpi-partner 存储 */
function calculateRpiScores(answersSelf, answersPartner) {
  const qSelf = rpiTest.questions.filter(q => q.id.startsWith('self-'));
  const qPartner = rpiTest.questions.filter(q => q.id.startsWith('partner-'));
  const self = buildRpiPerspectiveSummary(qSelf, answersSelf || {});
  const partner = buildRpiPerspectiveSummary(qPartner, answersPartner || {});
  let comparison = null;
  if (self && partner) {
    const dimensionDiffs = RPI_DIMENSION_ORDER.map(dimId => {
      const ds = self.dimensionScores.find(d => d.id === dimId);
      const dp = partner.dimensionScores.find(d => d.id === dimId);
      const selfSum = ds ? ds.scoreSum : 0;
      const partnerSum = dp ? dp.scoreSum : 0;
      return { id: dimId, name: (ds || dp).name, selfSum, partnerSum, diff: selfSum - partnerSum };
    });
    const maxDiff = dimensionDiffs.reduce((acc, d) => Math.abs(d.diff) > Math.abs(acc.diff) ? d : acc, dimensionDiffs[0]);
    const summary = maxDiff.diff === 0 ? '自我与伴侣视角在各维度上较为一致。'
      : maxDiff.diff > 0 ? `自我视角在「${maxDiff.name}」上高于伴侣视角，可结合沟通进一步澄清。`
      : `伴侣视角在「${maxDiff.name}」上高于自我视角，可结合沟通进一步澄清。`;
    comparison = { dimensionDiffs, summary };
  }
  return { self, partner, comparison };
}

/* ========== SRI 性压抑指数 - 移植自 src/utils/scoring.ts ========== */
const SRI_DIMENSION_ORDER = ['expression', 'conflict', 'anxiety', 'inhibition'];

function getSriIndexFromMean(mean) {
  if (mean <= 1) return 0;
  return Math.round(((mean - 1) / 4) * 100);
}

function getSriLevel(index) {
  if (index <= 20) return 'veryLow';
  if (index <= 40) return 'low';
  if (index <= 60) return 'mid';
  if (index <= 80) return 'high';
  return 'veryHigh';
}

function getSriLevelLabel(level) {
  const map = { veryLow: '很低', low: '偏低', mid: '中等', high: '偏高', veryHigh: '很高' };
  return map[level] || '';
}

function calculateSriScores(questions, dimensions, answers, reverseScoreIds) {
  const getEffective = (id, raw) => (reverseScoreIds.includes(id) ? 6 - raw : raw);

  const buckets = {};
  SRI_DIMENSION_ORDER.forEach(d => { buckets[d] = []; });

  questions.forEach(q => {
    const raw = answers[q.id];
    if (raw === undefined) return;
    const effective = getEffective(q.id, raw);
    if (buckets[q.dimension]) buckets[q.dimension].push(effective);
  });

  const dimensionMap = {};
  dimensions.forEach(d => { dimensionMap[d.id] = d; });

  const dimensionScores = SRI_DIMENSION_ORDER.map(dimId => {
    const list = buckets[dimId] || [];
    const dimension = dimensionMap[dimId];
    const score = list.length ? list.reduce((a, b) => a + b, 0) / list.length : 0;
    const index = getSriIndexFromMean(score);
    const level = getSriLevel(index);
    const levelLabel = getSriLevelLabel(level);
    const hint = score < 2.1 ? dimension.lowHint : score < 3.1 ? dimension.midHint : dimension.highHint;
    return { id: dimension.id, name: dimension.name, score, level, levelLabel, hint };
  });

  const allScores = SRI_DIMENSION_ORDER.flatMap(d => buckets[d] || []);
  const answered = allScores.length;
  const mean = answered ? allScores.reduce((a, b) => a + b, 0) / answered : 1;
  const totalIndex = getSriIndexFromMean(mean);
  const level = getSriLevel(totalIndex);
  const levelLabel = getSriLevelLabel(level);
  const top3Dimensions = [...dimensionScores].sort((a, b) => b.score - a.score).slice(0, 3);

  return { totalIndex, level, levelLabel, dimensionScores, answered, top3Dimensions };
}

/* ========== 统一入口 ========== */
function calculateResult(testId, answers) {
  switch (testId) {
    case 'scl90': return calculateScl90Scores(answers);
    case 'lbt': return calculateLBTResult(answers);
    case 'mbti': return calculateMBTIResult(answers);
    case 'rpi': return null; /* RPI 由 result 页单独调用 calculateRpiScores(answersSelf, answersPartner) */
    case 'sri': return calculateSriScores(sriTest.questions, sriTest.dimensions, answers, sriReverseScoreIds);
    case 'aat': return calculateAATResult(answers);
    case 'psych-age': return calculatePsychAgeResult(answers);
    case 'apt': return calculateAPTResult(answers);
    case 'hit': return calculateHITResult(answers);
    case 'dth': return calculateDTHResult(answers);
    case 'tla': return calculateTLAResult(answers);
    case 'fft': return calculateFFTResult(answers);
    case 'ybt': return calculateYBTResult(answers);
    case 'rvt': return calculateRVTResult(answers);
    case 'mpt': return calculateMPTResult(answers);
    case 'vbt': return calculateVBTResult(answers);
    case 'city': return calculateCityResult(answers);
    default: return null;
  }
}

module.exports = {
  calculateScl90Scores,
  calculateLBTResult,
  calculateMBTIResult,
  MBTI_POLE_LABELS,
  calculateRpiScores,
  calculateSriScores,
  calculateResult
};
