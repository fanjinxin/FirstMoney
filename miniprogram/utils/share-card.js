/**
 * 结果页分享卡片 - 根据 testId 与 result 生成核心结论卡完整数据
 * 用于 Canvas 绘制分享图时真实呈现首卡内容
 */
const { RESULT_PAGE_TITLES } = require('../data/tests');

/**
 * 获取分享卡简化文案（向后兼容）
 */
function getShareCardContent(testId, result, reports) {
  const card = getShareCardData(testId, result, reports);
  return {
    title: card.title || RESULT_PAGE_TITLES[testId] || '测评结果',
    summary: card.summary || card.mainValue || card.mainLabel || '查看完整报告',
  };
}

/**
 * 获取核心结论卡的完整结构化数据，供 Canvas 绘制分享图使用
 * @param {string} testId 测评 id
 * @param {object} result 测评结果
 * @param {object} reports 各测评的 report 对象 { scl90Report, rpiReport, lbtReport, sriReport, animalReport, mbtiReport, aatReport, psychAgeReport, cityReport, ... }
 * @returns {{ layout, title, [key]: any }}
 */
function getShareCardData(testId, result, reports = {}) {
  const title = RESULT_PAGE_TITLES[testId] || '测评结果';

  switch (testId) {
    case 'scl90': {
      const r = reports.scl90Report;
      const basic = result?.basic || {};
      return {
        layout: 'scl90',
        title,
        cardTitle: '心理健康画像',
        mainValue: basic.totalLevel || '',
        desc: r?.portraitDesc || '',
        coreLabel: '核心结论',
        coreValue: basic.totalLevel || '',
      };
    }

    case 'rpi': {
      const r = reports.rpiReport;
      const desc = r?.hasSelf && r?.hasPartner
        ? '双视角已完成，可对比彼此在控制、嫉妒、依赖与安全感上的差异。'
        : r?.hasSelf
          ? '已完成自我视角，继续完成伴侣视角可生成更完整对比。'
          : '已完成伴侣视角，继续完成自我视角可生成更完整对比。';
      return {
        layout: 'rpi',
        title,
        cardSub: '核心结论卡',
        cardTitle: '关系占有欲画像',
        desc,
        tags: [
          `人格类型：${r?.personaLabel || '待完成'}`,
          `核心结论：${r?.coreLabel || '待完成'}`,
        ],
      };
    }

    case 'sri': {
      const r = reports.sriReport;
      const topDim = r?.topDim;
      const coreDesc = `当前性压抑指数为 ${result?.totalIndex ?? '-'} 分，主要影响集中在${topDim?.name || '核心维度'}。`;
      return {
        layout: 'sri',
        title,
        cardSub: '核心结论卡',
        cardTitle: `综合结论：${result?.levelLabel || '待完成'}`,
        desc: coreDesc,
        tags: [
          `人格类型：${result?.levelLabel || '-'}型`,
          `核心结论：${topDim?.name || '待完成'}`,
        ],
      };
    }

    case 'lbt': {
      const r = reports.lbtReport;
      const profile = r?.profile || {};
      return {
        layout: 'lbt',
        title,
        meta: 'LBT 恋爱脑测试 · 投入与平衡',
        mainTitle: profile.title ? `你是${profile.title}` : '恋爱脑测试',
        badgeLabel: '整体',
        badgeValue: r?.levelLabel || '',
        badgePct: r?.percent != null ? `${r.percent}%` : '',
        threeTypeTitle: '三维得分',
        threeType: (r?.threeTypeGrid || []).map(t => ({
          name: t.nameShort || t.name,
          percent: t.percent != null ? t.percent : 0,
          isHighest: !!t.isHighest,
        })),
      };
    }

    case 'mbti': {
      const ti = result?.typeInfo || {};
      return {
        layout: 'mbti',
        title,
        cardSub: '你的人格类型',
        typeCode: result?.type || '',
        typeName: ti.name || '',
        typeNameEn: ti.nameEn || '',
        slogan: ti.slogan ? `「${ti.slogan}」` : '',
        desc: ti.description || '',
        strengths: ti.strengths || [],
      };
    }

    case 'animal': {
      const r = reports.animalReport;
      const main = r?.mainAnimal || {};
      const sec = r?.secondaryAnimal;
      return {
        layout: 'animal',
        title,
        cardSub: '您的精神动物是',
        mainName: main.name || '',
        mainDesc: main.description || '',
        mainEmoji: main.emoji || '',
        traits: main.traits || [],
        weaknesses: main.weaknesses || [],
        secondaryName: sec?.name || '',
      };
    }

    case 'aat': {
      const r = reports.aatReport;
      const tl = r?.totalLevel || {};
      return {
        layout: 'aat',
        title,
        cardSub: 'AAT 学习适应性测验',
        cardTitle: '综合适应指数',
        totalPercent: result?.totalPercent ?? 0,
        levelLabel: tl.label || '',
        levelDesc: tl.desc || '',
        meta: `已完成 ${result?.answeredCount ?? 0}/${result?.totalQuestions ?? 0} 题`,
        stats: [
          { label: '优势因子', value: String(r?.goodCount ?? 0), hint: '表现较好' },
          { label: '待改进', value: String(r?.poorCount ?? 0), hint: '需关注' },
          { label: '优先改进', value: r?.bottom3?.[0] ? `${r.bottom3[0].name} ${r.bottom3[0].percent}%` : '-', hint: '建议从该因子着手' },
        ],
      };
    }

    case 'psych-age': {
      const r = reports.psychAgeReport;
      return {
        layout: 'psych-age',
        title,
        cardSub: '心理年龄测验',
        mainValue: result?.psychAgeRange || '',
        mainLabel: `总分 ${result?.totalScore ?? 0}/${result?.maxTotalScore ?? 0}`,
        desc: '根据七维度综合评估，你的心理特征倾向于此年龄区间的特质。',
        youngestDim: r?.youngestDim?.name || '',
        oldestDim: r?.oldestDim?.name || '',
      };
    }

    case 'city': {
      const r = reports.cityReport;
      const profile = r?.profile || {};
      return {
        layout: 'city',
        title,
        cardSub: profile.typeLabel || '城市偏好',
        mainTitle: profile.title || '',
        mainDesc: profile.description || '',
        focus: profile.focus || '',
        typicalCities: profile.typicalCities || '',
      };
    }

    case 'fft':
    case 'ybt':
    case 'rvt':
    case 'mpt':
    case 'vbt':
    case 'dth':
    case 'tla':
    case 'hit':
    case 'apt': {
      const reportKey = `${testId}Report`;
      const r = reports[reportKey] || {};
      const mainValue = result?.mainFruit || result?.level || result?.levelLabel || result?.type || result?.psychAgeRange || '';
      const profile = r.profile || {};
      return {
        layout: 'generic',
        title,
        mainValue: profile.title || profile.label || mainValue,
        desc: profile.description || profile.summary || profile.desc || '',
      };
    }

    default:
      return {
        layout: 'generic',
        title,
        summary: result?.level || result?.levelLabel || '查看完整报告',
      };
  }
}

module.exports = { getShareCardContent, getShareCardData };
