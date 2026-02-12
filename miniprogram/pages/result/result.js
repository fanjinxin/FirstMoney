const { loadAnswers, clearAnswers } = require('../../utils/storage');
const { calculateResult, calculateRpiScores } = require('../../utils/scoring');
const { sriTest } = require('../../data/sri');
const { THEMES, getThemeStyle } = require('../../data/themes');

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
    animalReport: null,
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
      this.setData({ testId, result, themeStyle: getThemeStyle(theme) || '', rpiReport, chartColors: buildChartColors(theme) });
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
      sriReport = {
        formatDate: formatDate(),
        chartData,
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

    this.setData({ testId, result, themeStyle: getThemeStyle(theme) || '', scl90Report, sriReport, rpiReport, animalReport, chartColors: buildChartColors(theme) });
  },
  onThemeChange(e) {
    const { themeStyle, theme } = e.detail || {};
    this.setData({ themeStyle: themeStyle || '', chartColors: theme ? buildChartColors(theme) : this.data.chartColors });
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
