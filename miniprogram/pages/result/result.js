const { loadAnswers, clearAnswers } = require('../../utils/storage');
const { calculateResult, calculateRpiScores, MBTI_POLE_LABELS } = require('../../utils/scoring');
const { sriTest } = require('../../data/sri');
const { THEMES, getThemeStyle } = require('../../data/themes');
const { drawRadar, drawBar, drawPie, drawRpiBar, drawSriBar, drawYBTBar, drawRVTBar, drawLBTBar, drawMPTBar, drawVBTBar, drawCityBar, drawFFTBar, drawHollandHexagon } = require('../../utils/chart-helper');

function hexToRgb(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [0, 0, 0];
}

function buildChartColors(theme) {
  if (!theme?.colors) return null;
  const c = theme.colors;
  const [sR, sG, sB] = hexToRgb(c.sky);
  const [dR, dG, dB] = hexToRgb(c.deep);
  return {
    levelNormal: c.sky, levelMild: c.aqua, levelModerate: c.teal, levelSevere: c.deep,
    palette: [c.sky, c.aqua, c.mint, c.teal, c.deep],
    gridRgba: `rgba(${dR},${dG},${dB},0.15)`,
    fillRgba: `rgba(${sR},${sG},${sB},0.25)`,
    strokeRgba: `rgba(${dR},${dG},${dB},0.3)`,
    textColor: c.deep,
    dividerRgba: `rgba(${dR},${dG},${dB},0.2)`,
  };
}

function formatDate() {
  const now = new Date();
  return `${now.getFullYear()} 年 ${String(now.getMonth() + 1).padStart(2, '0')} 月 ${String(now.getDate()).padStart(2, '0')} 日`;
}

Page({
  data: {
    testId: '',
    result: null,
    themeStyle: '',
    scl90Report: null,
    sriReport: null,
    rpiReport: null,
    lbtReport: null,
    animalReport: null,
    mbtiInsight: null,
    mbtiPoleLabels: null,
    mbtiReport: null,
    mbtiAvatarSrc: '',
    aatReport: null,
    psychAgeReport: null,
    aptReport: null,
    hitReport: null,
    dthReport: null,
    tlaReport: null,
    fftReport: null,
    ybtReport: null,
    rvtReport: null,
    mptReport: null,
    vbtReport: null,
    cityReport: null,
    chartColors: null,
  },
  onLoad(options) {
    const testId = options.testId || '';
    const saved = wx.getStorageSync('app-theme-id') || 'summer-mint';
    const theme = THEMES.find(t => t.id === saved) || THEMES.find(t => t.id === 'summer-mint');

    if (testId === 'rpi') {
      const answersSelf = loadAnswers('rpi-self') || {};
      const answersPartner = loadAnswers('rpi-partner') || {};
      const result = calculateRpiScores(answersSelf, answersPartner);
      const hasSelf = !!(result.self && result.self.answered >= 20);
      const hasPartner = !!(result.partner && result.partner.answered >= 20);
      const hasAny = hasSelf || hasPartner;
      if (!hasAny) {
        this.setData({ result: null, testId, themeStyle: getThemeStyle(theme) || '', chartColors: buildChartColors(theme) });
        return;
      }
      const dimensionBase = result.self?.dimensionScores || result.partner?.dimensionScores || [];
      const chartData = dimensionBase.map(d => ({
        name: d.name,
        self: result.self?.dimensionScores?.find(x => x.id === d.id)?.scoreSum ?? 0,
        partner: result.partner?.dimensionScores?.find(x => x.id === d.id)?.scoreSum ?? 0,
      }));
      const selfTop = result.self ? [...result.self.dimensionScores].sort((a, b) => b.scoreSum - a.scoreSum)[0] : null;
      const partnerTop = result.partner ? [...result.partner.dimensionScores].sort((a, b) => b.scoreSum - a.scoreSum)[0] : null;
      const maxDiff = result.comparison ? result.comparison.dimensionDiffs.reduce((acc, d) => Math.abs(d.diff) > Math.abs(acc.diff) ? d : acc, result.comparison.dimensionDiffs[0]) : null;
      const personaLabel = hasSelf && hasPartner ? `${result.self.levelLabel} / ${result.partner.levelLabel}` : result.self?.levelLabel ?? result.partner?.levelLabel ?? '待完成';
      const coreLabel = hasSelf && hasPartner ? `${maxDiff?.name ?? '差异维度'}差异${maxDiff ? ` ${maxDiff.diff > 0 ? `+${maxDiff.diff}` : maxDiff.diff}` : ''}` : `${(hasSelf ? selfTop : partnerTop)?.name ?? '暂无'}突出`;
      const selfLevelClass = result.self?.levelLabel?.includes('低') ? 'low' : result.self?.levelLabel?.includes('适中') ? 'mod' : result.self?.levelLabel?.includes('偏高') ? 'high' : 'very';
      const partnerLevelClass = result.partner?.levelLabel?.includes('低') ? 'low' : result.partner?.levelLabel?.includes('适中') ? 'mod' : result.partner?.levelLabel?.includes('偏高') ? 'high' : 'very';
      const rpiReport = {
        hasSelf, hasPartner,
        formatDate: formatDate(),
        chartData,
        personaLabel, coreLabel,
        selfAnswered: result.self?.answered ?? 0, partnerAnswered: result.partner?.answered ?? 0,
        selfTop, partnerTop, maxDiff,
        view: hasSelf && hasPartner ? 'both' : hasSelf ? 'self' : 'partner',
        selfLevelClass, partnerLevelClass,
      };
      this.setData({ testId, result, themeStyle: getThemeStyle(theme) || '', rpiReport, chartColors: buildChartColors(theme) }, () => {
        this.scheduleChartsDraw();
      });
      return;
    }

    let answers = loadAnswers(testId);
    let rpiReport = null;
    if (testId === 'animal') {
      answers = loadAnswers('animal-sculpture') || answers;
    }
    if (!answers || Object.keys(answers).length === 0) {
      this.setData({ result: null, testId, themeStyle: getThemeStyle(theme) || '', chartColors: buildChartColors(theme) });
      return;
    }
    if (testId === 'apt' && Object.keys(answers).length < 60) {
      this.setData({ result: null, testId, themeStyle: getThemeStyle(theme) || '', chartColors: buildChartColors(theme) });
      return;
    }
    if (testId === 'hit' && Object.keys(answers).length < 90) {
      this.setData({ result: null, testId, themeStyle: getThemeStyle(theme) || '', chartColors: buildChartColors(theme) });
      return;
    }
    if (testId === 'dth' && Object.keys(answers).length < 70) {
      this.setData({ result: null, testId, themeStyle: getThemeStyle(theme) || '', chartColors: buildChartColors(theme) });
      return;
    }
    if (testId === 'tla' && Object.keys(answers).length < 52) {
      this.setData({ result: null, testId, themeStyle: getThemeStyle(theme) || '', chartColors: buildChartColors(theme) });
      return;
    }
    if (testId === 'fft' && Object.keys(answers).length < 54) {
      this.setData({ result: null, testId, themeStyle: getThemeStyle(theme) || '', chartColors: buildChartColors(theme) });
      return;
    }
    if (testId === 'ybt' && Object.keys(answers).length < 40) {
      this.setData({ result: null, testId, themeStyle: getThemeStyle(theme) || '', chartColors: buildChartColors(theme) });
      return;
    }
    if (testId === 'rvt' && Object.keys(answers).length < 36) {
      this.setData({ result: null, testId, themeStyle: getThemeStyle(theme) || '', chartColors: buildChartColors(theme) });
      return;
    }
    if (testId === 'mpt' && Object.keys(answers).length < 68) {
      this.setData({ result: null, testId, themeStyle: getThemeStyle(theme) || '', chartColors: buildChartColors(theme) });
      return;
    }
    if (testId === 'vbt' && Object.keys(answers).length < 40) {
      this.setData({ result: null, testId, themeStyle: getThemeStyle(theme) || '', chartColors: buildChartColors(theme) });
      return;
    }
    if (testId === 'city' && Object.keys(answers).length < 45) {
      this.setData({ result: null, testId, themeStyle: getThemeStyle(theme) || '', chartColors: buildChartColors(theme) });
      return;
    }
    if (testId === 'lbt' && Object.keys(answers).length < 20) {
      this.setData({ result: null, testId, themeStyle: getThemeStyle(theme) || '', chartColors: buildChartColors(theme) });
      return;
    }
    let result;
    if (testId === 'animal') {
      const { calculateAnimalResult } = require('../../utils/animal_scoring');
      result = calculateAnimalResult(answers);
    } else {
      result = calculateResult(testId, answers);
    }
    if (testId === 'scl90' && result) {
      result.basic.avgTotalStr = (result.basic.avgTotal || 0).toFixed(2);
      result.basic.positiveAvgStr = (result.basic.positiveAvg || 0).toFixed(2);
      (result.factors || []).forEach(f => { f.scoreStr = (f.score || 0).toFixed(2); });
      (result.top3Factors || []).forEach(f => { f.scoreStr = (f.score || 0).toFixed(1); f.scoreStr2 = (f.score || 0).toFixed(2); });
    }
    let scl90Report = null;
    if (testId === 'scl90' && result) {
      const factors = result.factors || [];
      const top3 = result.top3Factors || [];
      const severityRanks = { normal: 0, mild: 1, moderate: 2, severe: 3 };
      const maxSeverity = factors.length ? Math.max(...factors.map(f => severityRanks[f.level] || 0)) : 0;
      const suggestionLevel = maxSeverity >= 3 || result.basic.totalLevel === '重度困扰' ? 'severe'
        : maxSeverity >= 2 || result.basic.totalLevel === '中度困扰' ? 'moderate'
        : maxSeverity >= 1 || result.basic.totalLevel === '轻度困扰' ? 'mild' : 'normal';
      const radarData = factors.map(f => ({ name: f.name, score: Number(f.score.toFixed(2)), line2: 2, line3: 3 }));
      const barChartData = [...factors].sort((a, b) => b.score - a.score).map(f => ({
        id: f.id, name: f.name, score: f.score, hint: f.description, level: f.level
      }));
      const positiveRatio = ((result.basic.positiveCount / 90) * 100).toFixed(1);
      const top3Names = (top3 || []).map(f => f.name).join('、');
      const conclusionDesc = result.basic.totalLevel === '正常'
        ? '近期整体心理健康状态基本平稳，未见明显异常。'
        : `近期存在${result.basic.totalLevel}，其中${top3Names}维度的不适较为突出，建议重点关注。`;
      const portraitDesc = result.basic.totalLevel === '正常'
        ? '您的心理健康状况良好，各项指标均在正常范围内。建议继续保持当前的生活方式，维持良好的心理状态，定期进行自我觉察。'
        : `测试结果显示您当前处于「${result.basic.totalLevel}」状态。其中，${top3Names}等维度的困扰较为明显。建议结合下方详细解读，关注自身情绪变化，必要时寻求专业帮助。`;
      const conclusionClass = result.basic.totalLevel === '正常' ? 'normal' : result.basic.totalLevel === '轻度困扰' ? 'mild' : result.basic.totalLevel === '中度困扰' ? 'moderate' : 'severe';
      scl90Report = {
        radarData,
        barChartData,
        symptomDist: result.symptomDist || [],
        positiveRatio,
        formatDate: formatDate(),
        suggestionLevel,
        top3Names,
        conclusionDesc,
        portraitDesc,
        conclusionClass,
        professionalHelp: suggestionLevel === 'severe'
          ? '当前评估结果提示存在较重心理困扰，强烈建议尽快前往医院心理科或精神科进行专业评估与干预。'
          : suggestionLevel === 'moderate'
            ? '当前评估结果提示存在中度心理困扰，建议寻求专业心理咨询师的帮助，进行系统的心理评估和疏导。'
            : '如困扰持续或加重，建议及时咨询专业心理咨询师或心理科医生。',
      };
    }

    let lbtReport = null;
    if (testId === 'lbt' && result && result.dimensionScores) {
      const {
        LBT_PROFILES,
        LBT_LEVEL_LABELS,
        LBT_DIMENSION_BY_LEVEL,
        LBT_DIMENSION_INSIGHTS,
        LBT_RELATIONSHIP_TIPS,
        getLBTProfileKey,
      } = require('../../data/lbt_insights');
      const SUBJECT_SHORT = { depend: '情感依赖', prioritize: '优先倾斜', balance: '理性平衡' };
      const DIM_ICONS = { depend: '/assets/icons/heart-filled.svg', prioritize: '/assets/icons/heart.svg', balance: '/assets/icons/compass.svg' };
      const profileKey = getLBTProfileKey(result.levelKey || 'moderate', result.dimensionScores);
      const profile = LBT_PROFILES[profileKey] || LBT_PROFILES.balanced;
      const dependPriMax = Math.max(...(result.dimensionScores || []).filter(x => x.id !== 'balance').map(x => x.percent), 0);
      const radarData = (result.dimensionScores || []).map(d => ({ name: SUBJECT_SHORT[d.id] || d.name, score: d.percent }));
      const barChartData = (result.dimensionScores || []).map(d => ({
        id: d.id,
        name: d.name,
        score: d.percent,
        level: LBT_LEVEL_LABELS[d.level],
      }));
      const threeTypeGrid = (result.dimensionScores || []).map(d => ({
        id: d.id,
        nameShort: SUBJECT_SHORT[d.id] || d.name,
        percent: d.percent,
        icon: DIM_ICONS[d.id],
        isHighest: d.id !== 'balance' && d.percent === dependPriMax,
      }));
      const dimensionList = (result.dimensionScores || []).map(d => ({
        ...d,
        levelLabel: LBT_LEVEL_LABELS[d.level] || '',
        levelConclusion: LBT_DIMENSION_BY_LEVEL[d.id]?.[d.level] || '',
        dimInsight: LBT_DIMENSION_INSIGHTS[d.id] || '',
        barColorTeal: d.id === 'balance' && d.level === 'high',
        dimIcon: DIM_ICONS[d.id],
      }));
      lbtReport = {
        formatDate: formatDate(),
        profile,
        percent: result.percent,
        levelLabel: result.level,
        totalScore: result.totalScore,
        maxTotalScore: result.maxTotalScore,
        threeTypeGrid,
        radarData,
        barChartData,
        dimensionList,
        relationshipTips: LBT_RELATIONSHIP_TIPS[profileKey] || [],
      };
    }

    let sriReport = null;
    if (testId === 'sri' && result && result.answered >= sriTest.questions.length) {
      const topDim = result.top3Dimensions[0];
      const chartData = (result.dimensionScores || []).map(d => ({
        name: d.name,
        score: Number((d.score || 0).toFixed(2)),
        index: Math.round(((d.score - 1) / 4) * 100),
        level: d.level,
      }));
      const conflictDim = result.dimensionScores.find(d => d.id === 'conflict');
      const expressionDim = result.dimensionScores.find(d => d.id === 'expression');
      const anxietyDim = result.dimensionScores.find(d => d.id === 'anxiety');
      const inhibitionDim = result.dimensionScores.find(d => d.id === 'inhibition');
      const conflictHigh = conflictDim?.level === 'high' || conflictDim?.level === 'veryHigh';
      const expressionHigh = (expressionDim?.score ?? 0) >= 3;
      const anxietyInhibitionHigh = (anxietyDim?.score ?? 0) >= 3 || (inhibitionDim?.score ?? 0) >= 3;
      const getTotalLevelStyle = (label) => {
        if (label && label.includes('很低')) return 'sri-level-veryLow';
        if (label && label.includes('偏低')) return 'sri-level-low';
        if (label && label.includes('中等')) return 'sri-level-mid';
        if (label && label.includes('偏高')) return 'sri-level-high';
        if (label && label.includes('很高')) return 'sri-level-veryHigh';
        return 'sri-level-mid';
      };
      const dimScoresForView = (result.dimensionScores || []).map(d => ({
        ...d,
        scoreStr: (d.score || 0).toFixed(2),
        index: Math.round(((d.score - 1) / 4) * 100),
        pct: ((d.score || 0) / 5) * 100,
      }));
      const sriRadarData = (result.dimensionScores || []).map(d => ({
        name: d.name,
        score: Math.round(((d.score - 1) / 4) * 100),
      }));
      sriReport = {
        formatDate: formatDate(),
        chartData,
        radarData: sriRadarData,
        topDim,
        topDimHint: topDim ? `均分 ${topDim.score.toFixed(2)} · ${topDim.levelLabel}` : '',
        answeredCount: result.answered,
        dimScoresForView,
        conflictHigh,
        expressionHigh,
        anxietyInhibitionHigh,
        totalLevelClass: getTotalLevelStyle(result.levelLabel),
        conflictExpressionText: conflictHigh && expressionHigh
          ? '您在「观念冲突」与「欲望表达」上均存在一定压力：内心对欲望的评判与对表达的顾虑可能相互强化。建议从接纳「有欲望是正常的」开始，在安全关系中尝试小步表达，减少自我批判。'
          : conflictHigh
            ? '「观念冲突」较突出，可能伴随自责或「不该想」的念头。可尝试将道德、价值观与身体感受分开看待，在安全前提下探讨自己的真实态度。'
            : expressionHigh
              ? '「欲望表达」方面存在保留或回避。可逐步在可信赖的关系中练习用「我需要/我不需要」表达界限，减少因怕被评判而沉默。'
              : '观念与表达维度相对均衡，可继续维护在安全情境下的开放沟通。',
        anxietyInhibitionText: anxietyInhibitionHigh
          ? '「情绪紧张」和/或「行为抑制」较明显：在亲密话题或情境下容易焦虑、羞耻或回避。建议从情绪觉察开始（如区分「紧张」与「不愿意」），在安全、自愿的前提下小步增加表达或接触，必要时可借助伴侣沟通或专业支持。'
          : '情绪与行为维度显示紧张与抑制程度在可接受范围内，可继续关注舒适区与边界的一致性。',
        summaryText: result.totalIndex >= 60
          ? '整体性压抑指数偏高，建议优先在安全关系中增加自我接纳与表达练习，必要时考虑伴侣沟通或心理咨询以系统探讨观念、情绪与行为。'
          : result.totalIndex >= 40
            ? '整体处于中等水平，部分维度可能仍有提升空间。可针对得分较高的维度做针对性觉察与沟通。'
            : '整体压抑程度较低，在自愿与安全的前提下，表达与行为较一致。可继续维护边界清晰与沟通开放。',
      };
    }

    let mbtiInsight = null;
    let mbtiPoleLabels = null;
    let mbtiReport = null;
    if (testId === 'mbti' && result && result.type) {
      const { mbtiTypeInsights } = require('../../data/mbti_insights');
      mbtiInsight = mbtiTypeInsights[result.type] || null;
      mbtiPoleLabels = MBTI_POLE_LABELS;
      const mbtiRadarData = (result.radarData || []).map(d => ({ name: d.subject || '', score: d.A }));
      const dimensionDescs = {
        EI: { title: '能量来源 · E/I', content: '外向(E)者从与人互动中获得能量，内向(I)者从独处与内省中充电。两者无优劣之分，关键在于了解自己的节奏。' },
        SN: { title: '信息获取 · S/N', content: '实感(S)者关注具体事实与细节，直觉(N)者关注整体模式与可能性。二者在学习和决策中各有优势。' },
        TF: { title: '决策方式 · T/F', content: '思考(T)者侧重逻辑与公平，情感(F)者侧重感受与和谐。理想的决策往往需要两者的平衡。' },
        JP: { title: '生活节奏 · J/P', content: '判断(J)者偏好计划与条理，知觉(P)者偏好灵活与开放。了解自己的节奏有助于提高效率与幸福感。' }
      };
      const dimensionCards = (result.dimensionScores || []).map(ds => {
        const info = dimensionDescs[ds.dimension];
        return { title: info ? info.title : ds.label, content: info ? info.content : '', dominantLabel: ds.dominantLabel, percentage: ds.percentage };
      });
      const radarLegendItems = (result.radarData || []).map((rd, i) => {
        const ds = (result.dimensionScores || [])[i];
        const val = typeof rd.A === 'number' ? rd.A : 5;
        return { subject: rd.subject, value: typeof rd.A === 'number' ? rd.A.toFixed(1) : String(rd.A), pct: (val / 10) * 100, dominantLabel: ds ? ds.dominantLabel : '' };
      });
      mbtiReport = { formatDate: formatDate(), radarData: mbtiRadarData, dimensionCards, radarMaxValue: 10, radarLegendItems };
    }

    let aatReport = null;
    if (testId === 'aat' && result && result.factorScores) {
      const { AAT_TOTAL_LEVELS, AAT_FACTOR_IMPROVE, AAT_FACTOR_INSIGHTS } = require('../../data/aat_insights');
      const AAT_GROUPS = [
        { id: 'drive', name: '学习动力', factors: ['enthusiasm', 'planning'], hint: '学习热情与计划能力' },
        { id: 'method', name: '学习方法', factors: ['listening', 'reading', 'technique', 'exam'], hint: '听课、读书、技术、应试' },
        { id: 'environment', name: '环境因素', factors: ['family', 'school', 'friends'], hint: '家庭、学校、朋友关系' },
        { id: 'trait', name: '个人特质', factors: ['independence', 'perseverance', 'health'], hint: '独立性、毅力、心身健康' },
      ];
      const getTotalLevel = (p) => p >= 75 ? AAT_TOTAL_LEVELS.excellent : p >= 60 ? AAT_TOTAL_LEVELS.good : p >= 45 ? AAT_TOTAL_LEVELS.fair : p >= 30 ? AAT_TOTAL_LEVELS.poor : AAT_TOTAL_LEVELS.veryPoor;
      const totalLevel = getTotalLevel(result.totalPercent);
      const goodCount = result.factorScores.filter(f => f.level === 'good').length;
      const poorCount = result.factorScores.filter(f => f.level === 'poor' || f.level === 'veryPoor').length;
      const top3 = [...result.factorScores].sort((a, b) => b.percent - a.percent).slice(0, 3);
      const bottom3 = [...result.factorScores].sort((a, b) => a.percent - b.percent).slice(0, 3);
      const groupScores = AAT_GROUPS.map(g => {
        const items = result.factorScores.filter(f => g.factors.includes(f.id));
        const avg = items.length ? Math.round(items.reduce((s, x) => s + x.percent, 0) / items.length) : 0;
        return { ...g, avg, items };
      });
      const radarData = result.factorScores.map(f => ({ name: f.name, score: f.percent }));
      const barChartData = [...result.factorScores].sort((a, b) => b.percent - a.percent).map(f => ({
        id: f.id, name: f.name, score: f.percent, hint: f.levelLabel, level: f.level === 'good' ? 'normal' : f.level === 'fair' ? 'mild' : f.level === 'poor' ? 'moderate' : 'severe'
      }));
      aatReport = {
        formatDate: formatDate(),
        totalLevel,
        totalLevelClass: totalLevel.label === '优秀' ? 'excellent' : totalLevel.label === '较好' ? 'good' : totalLevel.label === '中等' ? 'fair' : totalLevel.label === '较差' ? 'poor' : 'veryPoor',
        goodCount,
        poorCount,
        top3,
        bottom3,
        groupScores,
        radarData,
        barChartData,
        factorInsights: AAT_FACTOR_INSIGHTS,
        factorImprove: AAT_FACTOR_IMPROVE,
      };
    }

    let psychAgeReport = null;
    if (testId === 'psych-age' && result && result.dimensionScores) {
      const { PSYCH_AGE_RANGE_INSIGHTS, PSYCH_AGE_DIMENSION_INSIGHTS, PSYCH_AGE_PROFESSIONAL_GUIDANCE } = require('../../data/psych_age_insights');
      const radarData = (result.dimensionScores || []).map(d => ({ name: d.name, score: d.percent }));
      const barChartData = [...(result.dimensionScores || [])].sort((a, b) => b.percent - a.percent).map(d => ({
        id: d.id, name: d.name, score: d.percent, level: d.trend === 'young' ? 'normal' : d.trend === 'balanced' ? 'mild' : 'moderate'
      }));
      const youngestDim = [...(result.dimensionScores || [])].sort((a, b) => a.percent - b.percent)[0];
      const oldestDim = [...(result.dimensionScores || [])].sort((a, b) => b.percent - a.percent)[0];
      const r = result.psychAgeRange || '';
      const ageImagePath = /70|岁以上/.test(r) ? '/assets/age-test/audit60-100.jpg' : /60|69/.test(r) ? '/assets/age-test/audit60-100.jpg' : /50|59/.test(r) ? '/assets/age-test/audit40-50.jpg' : /40|49/.test(r) ? '/assets/age-test/audit40-50.jpg' : /30|39/.test(r) ? '/assets/age-test/audit30-40.jpg' : '/assets/age-test/audit20-30.jpg';
      const ringProgress = result.maxTotalScore > 0 ? Math.min(1, result.totalScore / result.maxTotalScore) : 0;
      psychAgeReport = {
        formatDate: formatDate(),
        rangeInsight: PSYCH_AGE_RANGE_INSIGHTS[result.psychAgeRange] || '暂无解读',
        dimInsights: PSYCH_AGE_DIMENSION_INSIGHTS,
        radarData,
        barChartData,
        youngestDim,
        oldestDim,
        ageImagePath,
        ringProgress: Math.round(ringProgress * 360),
        professionalGuidance: PSYCH_AGE_PROFESSIONAL_GUIDANCE,
      };
    }

    let aptReport = null;
    if (testId === 'apt' && result && result.dimensionScores) {
      const { APT_LEVEL_LABELS, APT_LEVEL_DESC, APT_CAREER_SUGGESTIONS, APT_IMPROVE_TIPS, APT_DIMENSION_INSIGHTS, APT_SUMMARY, getCareerSuggestionKey } = require('../../data/apt_insights');
      const levelKey = result.totalLevel;
      const levelLabel = APT_LEVEL_LABELS[levelKey] || '中等';
      const radarData = (result.dimensionScores || []).map(d => ({ name: d.name, score: d.percent }));
      const barChartData = [...(result.dimensionScores || [])].sort((a, b) => b.percent - a.percent).map(d => ({
        id: d.id, name: d.name, score: d.percent, level: d.level === 'excellent' ? 'normal' : d.level === 'good' ? 'mild' : d.level === 'fair' ? 'moderate' : 'severe'
      }));
      const careerKey = getCareerSuggestionKey(result.topDimensions);
      const careerSuggestion = APT_CAREER_SUGGESTIONS[careerKey] || `你的优势组合为「${(result.topDimensions[0]?.name || '')}+${(result.topDimensions[1]?.name || '')}」，可根据兴趣探索分析、创意、人际或管理类方向。`;
      const weakIds = (result.weakDimensions || []).map(w => w.id);
      const dimensionList = (result.dimensionScores || []).map(d => ({
        ...d,
        isWeak: weakIds.indexOf(d.id) >= 0,
        improveTip: APT_IMPROVE_TIPS[d.id],
      }));
      const topDim = result.topDimensions && result.topDimensions[0];
      const weakDim = result.weakDimensions && result.weakDimensions[0];
      const aptRingProgress = Math.round((result.totalPercent / 100) * 360);
      aptReport = {
        formatDate: formatDate(),
        levelKey,
        levelLabel,
        levelDesc: APT_LEVEL_DESC[levelKey] || APT_LEVEL_DESC.fair,
        radarData,
        barChartData,
        careerSuggestion,
        dimInsights: APT_DIMENSION_INSIGHTS,
        improveTips: APT_IMPROVE_TIPS,
        dimensionList,
        summary: APT_SUMMARY,
        ringProgress: aptRingProgress,
        topDim: topDim ? { name: topDim.name, level: topDim.level } : null,
        weakDim: weakDim ? { name: weakDim.name, level: weakDim.level } : null,
      };
    }

    let hitReport = null;
    if (testId === 'hit' && result && result.dimensionScores) {
      const { getCodeConsistency, HIT_DIMENSION_INSIGHTS, HIT_DIMENSION_SHORT, HOLLAND_CODE_EXAMPLES, HOLLAND_CODE_INTRO } = require('../../data/hit_insights');
      const radarData = (result.dimensionScores || []).map(d => ({ name: d.name, score: d.percent }));
      const barChartData = [...(result.dimensionScores || [])].sort((a, b) => b.rawScore - a.rawScore).map(d => ({
        id: d.id, name: `${d.name}(${d.id})`, score: d.rawScore, level: result.topThree.some(t => t.id === d.id) ? 'normal' : 'mild'
      }));
      const codeExamples = HOLLAND_CODE_EXAMPLES[result.hollandCode] || '可根据前三型自行探索适合职业';
      const consistency = getCodeConsistency(result.topThree);
      const topThreeIds = (result.topThree || []).map(t => t.id);
      const dimensionList = (result.dimensionScores || []).map(d => {
        const topIdx = (result.topThree || []).findIndex(t => t.id === d.id);
        return {
          ...d,
          isTop: topIdx >= 0,
          topIdx,
          roleLabel: topIdx === 0 ? '主导' : topIdx >= 1 ? '辅助' : '',
          dimShort: HIT_DIMENSION_SHORT[d.id] || '',
        };
      });
      hitReport = {
        formatDate: formatDate(),
        radarData,
        barChartData,
        codeExamples,
        consistency,
        dimInsights: HIT_DIMENSION_INSIGHTS,
        dimensionList,
        codeIntro: HOLLAND_CODE_INTRO,
        topThreeDisplay: (result.topThree || []).map(t => `${t.name}(${t.id})`).join(' > '),
        topThreeIds,
      };
    }

    let dthReport = null;
    if (testId === 'dth' && result && result.dimensionScores) {
      const { DTH_LEVEL_LABELS, DTH_OVERALL_CONCLUSIONS, DTH_PROFILE_HINTS, DTH_DIMENSION_INSIGHTS, DTH_DIMENSION_BY_LEVEL, DTH_DISCLAIMER, getDTHOverallLevel, getDTHDominantDimension } = require('../../data/dth_insights');
      const avgPercent = result.dimensionScores.length ? Math.round(result.dimensionScores.reduce((s, d) => s + d.percent, 0) / result.dimensionScores.length) : 0;
      const overallLevel = getDTHOverallLevel(avgPercent);
      const dominantId = getDTHDominantDimension(result.dimensionScores);
      const conclusion = DTH_OVERALL_CONCLUSIONS[overallLevel];
      const profileHint = DTH_PROFILE_HINTS[dominantId];
      const radarData = (result.dimensionScores || []).map(d => ({ name: d.name, score: d.percent }));
      const barChartData = (result.dimensionScores || []).map(d => ({
        id: d.id, name: d.name, score: d.percent, level: d.level === 'high' ? 'moderate' : d.level === 'low' ? 'normal' : 'mild',
      }));
      const dimensionList = (result.dimensionScores || []).map(d => ({
        ...d,
        levelLabel: DTH_LEVEL_LABELS[d.level],
        levelConclusion: DTH_DIMENSION_BY_LEVEL[d.id]?.[d.level] || '',
      }));
      dthReport = {
        formatDate: formatDate(),
        overallLevel,
        avgPercent,
        conclusion,
        profileHint,
        radarData,
        barChartData,
        dimInsights: DTH_DIMENSION_INSIGHTS,
        dimensionList,
        disclaimer: DTH_DISCLAIMER,
      };
    }

    let tlaReport = null;
    if (testId === 'tla' && result && result.dimensionScores) {
      const { TLA_DIMENSION_CUTE, TLA_PROFILE_SHORT, getTLAProfileKey, TLA_DIMENSION_INSIGHTS, TLA_TIP } = require('../../data/tla_insights');
      const topTwo = [...(result.dimensionScores || [])].sort((a, b) => b.percent - a.percent).slice(0, 2);
      const profileKey = getTLAProfileKey(topTwo);
      const profileDesc = TLA_PROFILE_SHORT[profileKey] || TLA_PROFILE_SHORT.default;
      const radarData = (result.dimensionScores || []).map(d => ({ name: d.name, score: d.percent }));
      const barChartData = [...(result.dimensionScores || [])].sort((a, b) => b.percent - a.percent).map(d => ({
        id: d.id, name: (TLA_DIMENSION_CUTE[d.id] || {}).label || d.name, score: d.percent, level: topTwo.some(t => t.id === d.id) ? 'normal' : 'mild'
      }));
      const dimensionList = (result.dimensionScores || []).map(d => {
        const cute = TLA_DIMENSION_CUTE[d.id] || { label: d.name, emoji: '❤️', icon: '/assets/icons/heart-filled.svg' };
        return { ...d, cuteLabel: cute.label, emoji: cute.emoji, icon: cute.icon, isTop: topTwo.some(t => t.id === d.id) };
      });
      tlaReport = {
        formatDate: formatDate(),
        profileDesc,
        topTwo: topTwo.map(d => ({ ...d, cute: TLA_DIMENSION_CUTE[d.id] || { label: d.name, emoji: '❤️', icon: '/assets/icons/heart-filled.svg' } })),
        radarData,
        barChartData,
        dimInsights: TLA_DIMENSION_INSIGHTS,
        dimensionList,
        tip: TLA_TIP,
      };
    }

    let fftReport = null;
    if (testId === 'fft' && result && result.primaryFruit) {
      const { FFT_FRUIT_EMOJI, FFT_FRUIT_INSIGHTS, FFT_FRUIT_COLORS } = require('../../data/fft_insights');
      const primary = result.primaryFruit;
      const sorted = [...(result.dimensionScores || [])].sort((a, b) => b.percent - a.percent);
      const secondary = sorted[1] ? { ...sorted[1], emoji: FFT_FRUIT_EMOJI[sorted[1].id] || '' } : null;
      const tertiary = sorted[2] ? { ...sorted[2], emoji: FFT_FRUIT_EMOJI[sorted[2].id] || '' } : null;
      const radarData = (result.dimensionScores || []).map(d => ({
        name: d.name.replace('型', ''),
        score: d.percent,
        id: d.id,
      }));
      const barChartData = sorted.map(d => ({
        id: d.id,
        name: `${FFT_FRUIT_EMOJI[d.id] || ''} ${d.name}`,
        score: d.percent,
        color: FFT_FRUIT_COLORS[d.id] || '#2C6F7A',
      }));
      const dimensionList = (result.dimensionScores || []).map(d => ({
        ...d,
        emoji: FFT_FRUIT_EMOJI[d.id] || '',
        color: FFT_FRUIT_COLORS[d.id] || '#2C6F7A',
        isPrimary: d.id === primary.id,
        isSecondary: secondary && d.id === secondary.id,
      }));
      const scoreGrid = (result.dimensionScores || []).map(d => ({
        ...d,
        emoji: FFT_FRUIT_EMOJI[d.id] || '',
        nameShort: d.name.replace('型', ''),
        isPrimary: d.id === primary.id,
        isSecondary: secondary && d.id === secondary.id,
      }));
      fftReport = {
        formatDate: formatDate(),
        primary,
        secondary,
        tertiary,
        scoreGrid,
        radarData,
        barChartData,
        dimInsights: FFT_FRUIT_INSIGHTS,
        dimensionList,
        primaryEmoji: FFT_FRUIT_EMOJI[primary.id] || '',
      };
    }

    let ybtReport = null;
    if (testId === 'ybt' && result && result.dimensionScores) {
      const {
        YBT_PROFILES,
        YBT_LEVEL_LABELS,
        YBT_DIMENSION_INSIGHTS,
        YBT_DIMENSION_BY_LEVEL,
        YBT_RELATIONSHIP_TIPS,
        getYBTProfileKey,
      } = require('../../data/ybt_insights');
      const PROFILE_IMAGES = {
        gentle: '/assets/bingjiao/wenhe.jpg',
        possessive: '/assets/bingjiao/zhanyouxing.jpg',
        controlling: '/assets/bingjiao/kongzhixing.jpg',
        dependent: '/assets/bingjiao/yilaixing.jpg',
        extreme_risk: '/assets/bingjiao/qianzaibinjiaoqinxiao.jpg',
        extreme_only: '/assets/bingjiao/jingjuexing.jpg',
        balanced: '/assets/bingjiao/junhengxin.jpg',
      };
      const DIMENSION_IMAGES = {
        possess: '/assets/bingjiao/zhanyouyu.jpg',
        control: '/assets/bingjiao/kongzhiyu.jpg',
        depend: '/assets/bingjiao/yilaidu.jpg',
        extreme: '/assets/bingjiao/jiduanqinxiang.jpg',
      };
      const profileKey = getYBTProfileKey(result.dimensionScores);
      const profile = YBT_PROFILES[profileKey] || YBT_PROFILES.balanced;
      const sorted = [...(result.dimensionScores || [])].sort((a, b) => b.percent - a.percent);
      const dominant = sorted[0];
      const isRiskProfile = profileKey === 'extreme_risk' || profileKey === 'extreme_only';
      const radarData = (result.dimensionScores || []).map(d => ({ name: d.name, score: d.percent }));
      const barChartData = sorted.map(d => ({
        id: d.id,
        name: d.name,
        score: d.percent,
        level: YBT_LEVEL_LABELS[d.level],
      }));
      const dimensionList = (result.dimensionScores || []).map(d => ({
        ...d,
        levelLabel: YBT_LEVEL_LABELS[d.level] || '',
        levelConclusion: (YBT_DIMENSION_BY_LEVEL[d.id] || {})[d.level] || '',
        isDominant: dominant && d.id === dominant.id,
        dimImage: DIMENSION_IMAGES[d.id],
      }));
      ybtReport = {
        formatDate: formatDate(),
        profile,
        profileImage: PROFILE_IMAGES[profileKey] || PROFILE_IMAGES.balanced,
        isRiskProfile,
        avgPercent: result.avgPercent,
        totalScore: result.totalScore,
        maxTotalScore: result.maxTotalScore,
        radarData,
        barChartData,
        dimInsights: YBT_DIMENSION_INSIGHTS,
        dimByLevel: YBT_DIMENSION_BY_LEVEL,
        dimensionList,
        relationshipTips: YBT_RELATIONSHIP_TIPS[profileKey] || YBT_RELATIONSHIP_TIPS.balanced,
      };
    }

    let rvtReport = null;
    if (testId === 'rvt' && result && result.primaryType) {
      const {
        RVT_PROFILES,
        RVT_LEVEL_LABELS,
        RVT_DIMENSION_INSIGHTS,
        RVT_DIMENSION_BY_LEVEL,
        RVT_RELATIONSHIP_TIPS,
        RVT_SUBJECT_SHORT,
        RVT_DIMENSION_ICONS,
        getRVTProfileKey,
      } = require('../../data/rvt_insights');
      const profileKey = getRVTProfileKey(result.primaryType, result.secondaryType);
      const profile = RVT_PROFILES[profileKey] || RVT_PROFILES.balanced;
      const sorted = [...(result.dimensionScores || [])].sort((a, b) => b.percent - a.percent);
      const dominant = sorted[0];
      const radarData = (result.dimensionScores || []).map(d => ({ name: RVT_SUBJECT_SHORT[d.id] || d.name, score: d.percent }));
      const barChartData = sorted.map(d => ({
        id: d.id,
        name: d.name,
        score: d.percent,
        level: RVT_LEVEL_LABELS[d.level],
      }));
      const sixTypeGrid = (result.dimensionScores || []).map(d => ({
        id: d.id,
        nameShort: RVT_SUBJECT_SHORT[d.id] || d.name,
        percent: d.percent,
        icon: RVT_DIMENSION_ICONS[d.id],
        isPrimary: d.id === result.primaryType.id,
        isSecondary: result.secondaryType && d.id === result.secondaryType.id,
      }));
      const dimensionList = (result.dimensionScores || []).map(d => ({
        ...d,
        levelLabel: RVT_LEVEL_LABELS[d.level] || '',
        levelConclusion: RVT_DIMENSION_BY_LEVEL[d.id]?.[d.level] || '',
        dimInsight: RVT_DIMENSION_INSIGHTS[d.id] || '',
        isDominant: dominant && d.id === dominant.id,
        dimIcon: RVT_DIMENSION_ICONS[d.id],
      }));
      rvtReport = {
        formatDate: formatDate(),
        primaryType: result.primaryType,
        secondaryType: result.secondaryType,
        profileKey,
        profile,
        primaryIcon: RVT_DIMENSION_ICONS[result.primaryType.id],
        thirdName: sorted[2] ? sorted[2].name : null,
        sixTypeGrid,
        radarData,
        barChartData,
        dimensionList,
        relationshipTips: RVT_RELATIONSHIP_TIPS[profileKey] || [],
      };
    }

    let mptReport = null;
    if (testId === 'mpt' && result && result.primaryType) {
      const {
        MPT_PROFILES,
        MPT_LEVEL_LABELS,
        MPT_DIMENSION_BY_LEVEL,
        MPT_DIMENSION_BY_LEVEL_EXTENDED,
        MPT_SCORE_PATTERN_INSIGHTS,
        MPT_GROWTH_DIRECTIONS,
        MPT_CAUTIONS,
        MPT_PARTNER_MATCH,
        MPT_DIMENSION_INSIGHTS,
        MPT_RELATIONSHIP_TIPS,
        MPT_SUBJECT_SHORT,
        MPT_DIMENSION_ICONS,
        getMPTProfileKey,
        getComboInsight,
      } = require('../../data/mpt_insights');
      const profileKey = getMPTProfileKey(result.primaryType, result.secondaryType);
      const profile = MPT_PROFILES[profileKey] || MPT_PROFILES.balanced;
      const sorted = [...(result.dimensionScores || [])].sort((a, b) => b.percent - a.percent);
      const dominant = sorted[0];
      const radarData = (result.dimensionScores || []).map(d => ({ name: MPT_SUBJECT_SHORT[d.id] || d.name, score: d.percent }));
      const barChartData = sorted.map(d => ({
        id: d.id,
        name: d.name,
        score: d.percent,
        level: MPT_LEVEL_LABELS[d.level],
      }));
      const patternInfo = MPT_SCORE_PATTERN_INSIGHTS[result.scorePattern] || MPT_SCORE_PATTERN_INSIGHTS.distinct;
      const fourTypeGrid = (result.dimensionScores || []).map(d => ({
        id: d.id,
        nameShort: MPT_SUBJECT_SHORT[d.id] || d.name,
        percent: d.percent,
        icon: MPT_DIMENSION_ICONS[d.id],
        isPrimary: d.id === result.primaryType.id,
        isSecondary: result.secondaryType && d.id === result.secondaryType.id,
      }));
      const comboInsight = result.secondaryType ? getComboInsight(result.primaryType.id, result.secondaryType.id) : null;
      const primaryExtended = MPT_DIMENSION_BY_LEVEL_EXTENDED[result.primaryType.id]?.[result.primaryType.level] || null;
      const dimensionList = (result.dimensionScores || []).map(d => ({
        ...d,
        levelLabel: MPT_LEVEL_LABELS[d.level] || '',
        levelConclusion: MPT_DIMENSION_BY_LEVEL[d.id]?.[d.level] || '',
        dimInsight: MPT_DIMENSION_INSIGHTS[d.id] || '',
        extendedSuggestion: MPT_DIMENSION_BY_LEVEL_EXTENDED[d.id]?.[d.level]?.suggestion || null,
        dimIcon: MPT_DIMENSION_ICONS[d.id],
        isDominant: dominant && d.id === dominant.id,
      }));
      const growthInfo = MPT_GROWTH_DIRECTIONS[profileKey] || null;
      const cautionsInfo = MPT_CAUTIONS[profileKey] || null;
      const partnerMatchInfo = MPT_PARTNER_MATCH[profileKey] || null;
      mptReport = {
        formatDate: formatDate(),
        primaryType: result.primaryType,
        secondaryType: result.secondaryType,
        profileKey,
        profile,
        primaryIcon: MPT_DIMENSION_ICONS[result.primaryType.id],
        thirdName: sorted[2] ? sorted[2].name : null,
        fourTypeGrid,
        patternInfo,
        comboInsight,
        primaryExtended,
        radarData,
        barChartData,
        dimensionList,
        relationshipTips: MPT_RELATIONSHIP_TIPS[profileKey] || [],
        growthInfo,
        cautionsInfo,
        partnerMatchInfo,
      };
    }

    let vbtReport = null;
    if (testId === 'vbt' && result && result.profileKey) {
      const { VBT_PROFILES, VBT_LEVEL_LABELS, VBT_DIMENSION_BY_LEVEL, VBT_DIMENSION_EXTENDED, VBT_VULNERABILITY_ZONE_INSIGHTS, VBT_DIMENSION_INSIGHTS, VBT_SELF_PROTECTION_TIPS, VBT_GROWTH_DIRECTIONS, VBT_CAUTIONS, VBT_SUBJECT_SHORT, VBT_DIMENSION_ICONS, getLevelLabel } = require('../../data/vbt_insights');
      const profile = VBT_PROFILES[result.profileKey] || VBT_PROFILES.robust;
      const zoneInfo = VBT_VULNERABILITY_ZONE_INSIGHTS[result.vulnerabilityZone] || VBT_VULNERABILITY_ZONE_INSIGHTS.mid;
      const protectDims = (result.dimensionScores || []).filter(d => d.id !== 'sensitive');
      const radarData = (result.dimensionScores || []).map(d => ({ name: VBT_SUBJECT_SHORT[d.id] || d.name, score: d.percent }));
      const barChartData = protectDims.map(d => ({ name: d.name, score: d.percent, level: VBT_LEVEL_LABELS[d.level] }));
      const zoneColorMap = { low: 'vbt-zone-low', low_mid: 'vbt-zone-low-mid', mid: 'vbt-zone-mid', mid_high: 'vbt-zone-mid-high', high: 'vbt-zone-high' };
      const fourTypeGrid = (result.dimensionScores || []).map(d => {
        const isWeak = (d.id !== 'sensitive' && d.percent < 50) || (d.id === 'sensitive' && d.percent >= 65);
        const isStrong = d.id !== 'sensitive' && d.percent >= 70;
        return { id: d.id, nameShort: VBT_SUBJECT_SHORT[d.id] || d.name, percent: d.percent, icon: VBT_DIMENSION_ICONS[d.id], isStrong, isWeak };
      });
      const dimensionList = (result.dimensionScores || []).map(d => {
        const isProtectDim = d.id !== 'sensitive';
        const isWeak = isProtectDim ? d.percent < 50 : d.percent >= 65;
        const ext = VBT_DIMENSION_EXTENDED[d.id]?.[d.level];
        let barColorClass = 'vbt-bar-teal';
        if (isProtectDim) {
          barColorClass = d.percent >= 70 ? 'vbt-bar-teal' : d.percent < 50 ? 'vbt-bar-sky' : 'vbt-bar-aqua';
        } else {
          barColorClass = d.percent >= 65 ? 'vbt-bar-sky' : 'vbt-bar-teal';
        }
        return {
          ...d,
          levelLabel: getLevelLabel(d.id, d.level),
          levelConclusion: VBT_DIMENSION_BY_LEVEL[d.id]?.[d.level] || '',
          extendedSuggestion: ext?.suggestion || '',
          dimInsight: VBT_DIMENSION_INSIGHTS[d.id] || '',
          dimIcon: VBT_DIMENSION_ICONS[d.id],
          isWeak,
          isProtectDim,
          barColorClass,
        };
      });
      const tips = VBT_SELF_PROTECTION_TIPS[result.profileKey] || [];
      const growthInfo = VBT_GROWTH_DIRECTIONS[result.profileKey] || null;
      const cautionsInfo = VBT_CAUTIONS[result.profileKey] ? { points: VBT_CAUTIONS[result.profileKey] } : null;
      const weakestExt = result.weakestDimension && result.weakestDimension.id !== 'sensitive'
        ? VBT_DIMENSION_EXTENDED[result.weakestDimension.id]?.[result.weakestDimension.level]
        : null;
      vbtReport = {
        formatDate: formatDate(),
        profile,
        zoneInfo,
        zoneColorClass: zoneColorMap[result.vulnerabilityZone] || 'vbt-zone-mid',
        vulnerabilityIndex: result.vulnerabilityIndex,
        primaryIcon: '/assets/icons/shield.svg',
        radarData,
        barChartData,
        fourTypeGrid,
        dimensionList,
        tips,
        growthInfo,
        cautionsInfo,
        weakestDimension: result.weakestDimension,
        weakestExtended: weakestExt,
      };
    }

    let cityReport = null;
    if (testId === 'city' && result && result.topCities) {
      const { CITY_PROFILES, CITY_LEVEL_LABELS, CITY_DIMENSION_BY_LEVEL, CITY_DIMENSION_INSIGHTS, CITY_METHODOLOGY, CITY_SUBJECT_SHORT, CITY_DIMENSION_ICONS } = require('../../data/city_insights');
      const profile = CITY_PROFILES[result.profileKey] || CITY_PROFILES.balanced;
      const dimOrder = ['climate', 'pace', 'culture', 'cost', 'social'];
      const radarData = (result.dimensionScores || []).map(d => ({ name: CITY_SUBJECT_SHORT[d.id] || d.name, score: d.percent }));
      const sorted = [...(result.dimensionScores || [])].sort((a, b) => b.percent - a.percent);
      const barChartData = sorted.map(d => ({ name: d.name, score: d.percent, level: CITY_LEVEL_LABELS[d.level] }));
      const fourTypeGrid = (result.dimensionScores || []).map(d => ({
        id: d.id, nameShort: CITY_SUBJECT_SHORT[d.id] || d.name, percent: d.percent, icon: CITY_DIMENSION_ICONS[d.id],
      }));
      const dimensionList = (result.dimensionScores || []).map(d => ({
        ...d,
        levelLabel: CITY_LEVEL_LABELS[d.level] || '',
        levelConclusion: CITY_DIMENSION_BY_LEVEL[d.id]?.[d.level] || '',
        dimInsight: CITY_DIMENSION_INSIGHTS[d.id] || '',
        dimIcon: CITY_DIMENSION_ICONS[d.id],
      }));
      const topCities = (result.topCities || []).map(m => ({
        city: m.city,
        matchPercent: m.matchPercent,
        matchReason: m.matchReason,
        dimensionMatch: m.dimensionMatch || {},
        dimMatchList: dimOrder.map(id => ({ id, name: CITY_SUBJECT_SHORT[id], percent: Math.round(m.dimensionMatch?.[id] ?? 0) })),
      }));
      cityReport = {
        formatDate: formatDate(),
        profile,
        suggestedType: result.suggestedType,
        primaryIcon: '/assets/icons/mappin.svg',
        topCities,
        fourTypeGrid,
        methodology: CITY_METHODOLOGY,
        radarData,
        barChartData,
        dimensionList,
      };
    }

    let animalReport = null;
    const animalAnswered = testId === 'animal' && answers ? Object.keys(answers).length : 0;
    if (testId === 'animal' && result && result.mainAnimal && animalAnswered >= 30) {
      const getCompoundLabel = (key, value) => {
        if (key === 'socialEnergy') return value < 4 ? '独处充电' : value > 7 ? '社交充电' : '平衡型';
        if (key === 'resilience') return value < 4 ? '敏感细腻' : value > 7 ? '坚韧抗压' : '适应型';
        if (key === 'drive') return value < 4 ? '佛系随缘' : value > 7 ? '目标导向' : '稳健型';
        if (key === 'adaptability') return value < 4 ? '坚持自我' : value > 7 ? '灵活变通' : '折中型';
        return '';
      };
      const compoundConfigs = [
        { key: 'socialEnergy', label: '社交能量', color: 'sri-aqua' },
        { key: 'resilience', label: '抗压指数', color: 'sri-teal' },
        { key: 'drive', label: '进取心', color: 'sri-deep' },
        { key: 'adaptability', label: '适应力', color: 'sri-mint' },
      ];
      const radarData = (result.radarData || []).map(d => ({ name: d.subject || '', score: d.A }));
      const compoundRows = compoundConfigs.map(({ key, label }) => ({
        key,
        label,
        value: (result.compoundDimensions || {})[key] ?? 0,
        status: getCompoundLabel(key, (result.compoundDimensions || {})[key] ?? 0),
      }));
      const formatDateLocale = () => {
        const d = new Date();
        return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
      };
      const scores = result.scores || {};
      const analysisE = scores.E > 6
        ? '你是一个能量充沛的人，喜欢与人交往，在群体中能获得更多能量。'
        : scores.E < 4
          ? '你更享受独处的时光，内心世界丰富，在安静中能获得更多力量。'
          : '你在社交和独处之间保持着良好的平衡。';
      const analysisO = scores.O > 6
        ? '你充满想象力和创造力，喜欢探索新事物，思维跳跃且富有远见。'
        : scores.O < 4
          ? '你注重实际和传统，脚踏实地，更相信经验和被验证过的方法。'
          : '你既有务实的一面，也不乏创新的火花。';
      const analysisAC = scores.A > scores.C
        ? '在做决定时，你更看重他人的感受和人际关系的和谐。'
        : scores.C > scores.A
          ? '你更看重逻辑、规则和效率，能够客观冷静地做出理性判断。'
          : '你能够很好地平衡理性和感性。';
      const analysisN = scores.N > 6
        ? '你的感知力很强，容易察觉环境变化，虽然有时会焦虑，但也更细腻。'
        : scores.N < 4
          ? '你的情绪非常稳定，能够从容应对各种压力。'
          : '你拥有正常的情绪波动，在大多数情况下能够自我调节。';
      animalReport = {
        mainAnimal: result.mainAnimal,
        secondaryAnimal: result.secondaryAnimal,
        scores,
        radarData,
        compoundRows,
        formatDate: formatDateLocale(),
        analysisE,
        analysisO,
        analysisAC,
        analysisN,
      };
    }

    const mbtiAvatarSrc = (testId === 'mbti' && result?.type) ? `/assets/mbti/${result.type.toLowerCase()}.svg` : '';
    this.setData({ testId, result, mbtiAvatarSrc, themeStyle: getThemeStyle(theme) || '', scl90Report, sriReport, rpiReport, lbtReport, animalReport, mbtiInsight, mbtiPoleLabels, mbtiReport, aatReport, psychAgeReport, aptReport, hitReport, dthReport, tlaReport, fftReport, ybtReport, rvtReport, mptReport, vbtReport, cityReport, chartColors: buildChartColors(theme) }, () => {
      this.scheduleChartsDraw();
    });
  },
  scheduleChartsDraw() {
    const { testId, chartColors } = this.data;
    const page = this;
    if (testId === 'scl90' && this.data.scl90Report) {
      const r = this.data.scl90Report;
      drawRadar(page, 'result-radar', r.radarData, chartColors, 5);
      drawPie(page, 'result-pie', r.symptomDist, chartColors);
      drawBar(page, 'result-bar', r.barChartData, chartColors, 5);
    } else if (testId === 'aat' && this.data.aatReport) {
      const r = this.data.aatReport;
      drawRadar(page, 'result-radar', r.radarData, chartColors, 100);
      drawBar(page, 'result-bar', r.barChartData, chartColors, 100);
    } else if (testId === 'psych-age' && this.data.psychAgeReport) {
      const r = this.data.psychAgeReport;
      drawRadar(page, 'result-radar', r.radarData, chartColors, 100);
      drawBar(page, 'result-bar', r.barChartData, chartColors, 100);
    } else if (testId === 'apt' && this.data.aptReport) {
      const r = this.data.aptReport;
      drawRadar(page, 'result-radar', r.radarData, chartColors, 100);
      drawBar(page, 'result-bar', r.barChartData, chartColors, 100);
    } else if (testId === 'hit' && this.data.hitReport) {
      const r = this.data.hitReport;
      drawHollandHexagon(page, 'hit-hexagon', r.topThreeIds);
      drawRadar(page, 'result-radar', r.radarData, chartColors, 100);
      drawBar(page, 'result-bar', r.barChartData, chartColors, 15);
    } else if (testId === 'dth' && this.data.dthReport) {
      const r = this.data.dthReport;
      drawRadar(page, 'result-radar', r.radarData, chartColors, 100);
      drawBar(page, 'result-bar', r.barChartData, chartColors, 100);
    } else if (testId === 'tla' && this.data.tlaReport) {
      const r = this.data.tlaReport;
      drawRadar(page, 'result-radar', r.radarData, chartColors, 100);
      drawBar(page, 'result-bar', r.barChartData, chartColors, 100);
    } else if (testId === 'fft' && this.data.fftReport) {
      const r = this.data.fftReport;
      drawRadar(page, 'result-radar', r.radarData, chartColors, 100);
      drawFFTBar(page, 'result-bar', r.barChartData, 100);
    } else if (testId === 'ybt' && this.data.ybtReport) {
      const r = this.data.ybtReport;
      const ybtChartColors = {
        fillRgba: 'rgba(190, 18, 60, 0.25)',
        textColor: '#2C6F7A',
        strokeRgba: 'rgba(190, 18, 60, 0.5)',
      };
      drawRadar(page, 'result-radar', r.radarData, ybtChartColors, 100);
      drawYBTBar(page, 'ybt-bar', r.barChartData, 100);
    } else if (testId === 'rvt' && this.data.rvtReport) {
      const r = this.data.rvtReport;
      const rvtChartColors = {
        fillRgba: 'rgba(190, 18, 60, 0.25)',
        textColor: '#2C6F7A',
        strokeRgba: 'rgba(190, 18, 60, 0.5)',
      };
      drawRadar(page, 'result-radar', r.radarData, rvtChartColors, 100);
      drawRVTBar(page, 'result-bar', r.barChartData, 100);
    } else if (testId === 'mpt' && this.data.mptReport) {
      const r = this.data.mptReport;
      drawRadar(page, 'result-radar', r.radarData, chartColors, 100);
      drawMPTBar(page, 'mpt-bar', r.barChartData, 100);
    } else if (testId === 'vbt' && this.data.vbtReport) {
      const r = this.data.vbtReport;
      drawRadar(page, 'result-radar', r.radarData, chartColors, 100);
      drawVBTBar(page, 'vbt-bar', r.barChartData, 100);
    } else if (testId === 'city' && this.data.cityReport) {
      const r = this.data.cityReport;
      drawRadar(page, 'result-radar', r.radarData, chartColors, 100);
      drawCityBar(page, 'city-bar', r.barChartData, 100);
    } else if (testId === 'lbt' && this.data.lbtReport) {
      const r = this.data.lbtReport;
      const lbtChartColors = {
        fillRgba: 'rgba(219, 39, 119, 0.25)',
        textColor: '#2C6F7A',
        strokeRgba: 'rgba(219, 39, 119, 0.5)',
      };
      drawRadar(page, 'result-radar', r.radarData, lbtChartColors, 100);
      drawLBTBar(page, 'lbt-bar', r.barChartData, 100);
    } else if (testId === 'mbti' && this.data.mbtiReport) {
      const r = this.data.mbtiReport;
      drawRadar(page, 'result-radar', r.radarData, chartColors, r.radarMaxValue || 10);
    } else if (testId === 'rpi' && this.data.rpiReport) {
      drawRpiBar(page, 'result-rpi-bar', this.data.rpiReport.chartData, chartColors);
    } else if (testId === 'sri' && this.data.sriReport) {
      const r = this.data.sriReport;
      drawRadar(page, 'result-radar', r.radarData, chartColors, 100);
      drawSriBar(page, 'result-sri-bar', r.chartData);
    } else if (testId === 'animal' && this.data.animalReport) {
      const r = this.data.animalReport;
      drawRadar(page, 'result-radar', r.radarData, chartColors, 10);
    }
  },
  onThemeChange(e) {
    const { themeStyle, theme } = e.detail || {};
    this.setData({ themeStyle: themeStyle || '', chartColors: theme ? buildChartColors(theme) : this.data.chartColors }, () => {
      this.scheduleChartsDraw();
    });
  },
  onRpiViewChange(e) {
    const view = e.currentTarget.dataset.view;
    const rpi = this.data.rpiReport;
    if (!view || !rpi || view === rpi.view) return;
    this.setData({ rpiReport: { ...rpi, view } });
  },
  onRetake() {
    const testId = this.data.testId;
    wx.showModal({
      title: '确认',
      content: '确定要重新测试吗？',
      success: (res) => {
        if (res.confirm) {
          if (testId === 'rpi') {
            clearAnswers('rpi-self');
            clearAnswers('rpi-partner');
            wx.redirectTo({ url: '/pages/rpi-test/rpi-test' });
          } else if (testId === 'animal') {
            clearAnswers('animal-sculpture');
            wx.redirectTo({ url: '/pages/animal-test/animal-test' });
          } else {
            clearAnswers(testId);
            const url = testId === 'scl90' ? '/pages/scl90-test/scl90-test' : `/pages/test/test?testId=${testId}`;
            wx.redirectTo({ url });
          }
        }
      }
    });
  }
});
