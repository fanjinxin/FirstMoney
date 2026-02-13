/**
 * MPT 亲密关系偏好 - 综合结论、维度解读
 * 移植自 src/data/mpt_insights.ts（精简版）
 */
const MPT_LEVEL_LABELS = { low: '偏低', moderate: '适中', high: '偏高' };

const MPT_PROFILES = {
  intimacy: {
    title: '亲密型',
    summary: '你最重视情感深度与心灵联结，看重信任、理解与长久承诺。你更在意心灵的契合而非外在吸引，倾向于慢慢建立亲密感，情感安全是关系的基础。',
    dominantNote: '你适合与愿意投入时间建立深层联结、重视沟通与承诺的伴侣相处。',
    advice: '在重视深度的同时，可适度表达激情与浪漫，避免让伴侣感到情感表达不足。',
  },
  passion: {
    title: '激情型',
    summary: '你最重视强烈的情感与身体体验，追求心动、新鲜感与张力。你容易被强烈的吸引所打动，激情的消退会令你不安，身体的默契与强度对你很重要。',
    dominantNote: '你适合与能持续带来吸引力、善于表达热情的伴侣相处。',
    advice: '激情会随时间自然消退，可逐步培养亲密与浪漫，为长期关系注入持久动力。',
  },
  romance: {
    title: '浪漫型',
    summary: '你最重视仪式感与心意表达，享受被追求、被宠爱的感觉。浪漫的细节、纪念日与惊喜对你很重要，你向往被捧在手心的感觉，浪漫是维持关系的润滑剂。',
    dominantNote: '你适合与愿意花心思营造浪漫、注重表达的伴侣相处。',
    advice: '在享受浪漫的同时，可关注情感深度与沟通，避免仅停留在表面浪漫。',
  },
  explore: {
    title: '探索型',
    summary: '你对新体验持开放态度，乐于在安全范围内沟通需求、尝试不同方式。你重视关系中的成长与变化，坦诚沟通偏好很重要，探索可以增进亲密感。',
    dominantNote: '你适合与愿意坦诚交流、共同探索的伴侣相处。',
    advice: '在探索的同时，注意与伴侣的节奏同步，尊重边界与共识。',
  },
  intimacy_romance: {
    title: '亲密浪漫型',
    summary: '你同时重视情感深度与浪漫表达，既看重心灵契合与长久承诺，也享受仪式感与心意。你适合既能建立深层联结、又愿意花心思营造氛围的关系。',
    dominantNote: '亲密与浪漫结合，往往对关系有较高期待，需与伴侣沟通彼此的期待。',
    advice: '在亲密与浪漫之间保持平衡，避免过度理想化或忽视实际沟通。',
  },
  passion_explore: {
    title: '激情探索型',
    summary: '你同时重视强烈体验与开放探索，追求心动、新鲜感与坦诚沟通。你乐于尝试不同方式、主动表达需求，适合充满活力与成长空间的关系。',
    dominantNote: '激情与探索结合，需留意与伴侣的节奏与边界是否一致。',
    advice: '在追求新鲜的同时，可培养稳定感与深度联结，避免关系流于表面。',
  },
  balanced: {
    title: '均衡型',
    summary: '四个维度得分较为均衡，你兼具多种亲密关系偏好，能在不同情境下灵活调整。多数人有一定程度的混合。',
    dominantNote: '你能够根据关系阶段与伴侣特点灵活表达。',
    advice: '保持觉察，根据实际关系动态与伴侣沟通彼此的偏好与边界。',
  },
};

const MPT_DIMENSION_BY_LEVEL = {
  intimacy: {
    low: '亲密偏好较低，更注重激情、浪漫或探索，情感深度联结不是首要需求。',
    moderate: '亲密偏好适中，重视情感联结，也能接纳其他维度的体验。',
    high: '亲密偏好较高，最看重心灵契合、信任与长久承诺，情感安全是基础。',
  },
  passion: {
    low: '激情偏好较低，更注重亲密、浪漫或稳定，强烈体验不是首要追求。',
    moderate: '激情偏好适中，能享受激情，也能接受激情随时间自然变化。',
    high: '激情偏好较高，追求心动、新鲜感与身体默契，激情消退会令你不安。',
  },
  romance: {
    low: '浪漫偏好较低，更注重实际或深度，仪式感与惊喜不是首要需求。',
    moderate: '浪漫偏好适中，能欣赏浪漫，也能接受日常平淡。',
    high: '浪漫偏好较高，重视仪式感、心意与被宠爱的感觉，浪漫是重要润滑剂。',
  },
  explore: {
    low: '探索偏好较低，更倾向稳定熟悉的方式，对新体验持保守态度。',
    moderate: '探索偏好适中，能在安全范围内尝试，也会尊重边界。',
    high: '探索偏好较高，乐于沟通需求、尝试新方式，重视关系中的成长与变化。',
  },
};

const MPT_SCORE_PATTERN_INSIGHTS = {
  balanced: {
    title: '均衡型分布',
    analysis: '四个维度得分较为接近，最高与最低的差距不超过 15%。这表明你的亲密关系偏好相对均衡，没有某一维度明显主导。',
    implication: '你在不同情境下能灵活表达，但也可能因「什么都有一点」而在特定关系中不够鲜明。建议根据伴侣特点和关系阶段，有意识地突出你最看重的 1–2 个维度。',
  },
  distinct: {
    title: '鲜明型分布',
    analysis: '主型得分明显高于其他维度，偏好特征清晰。你在亲密关系中有明确的主导诉求，伴侣较容易理解你的核心需求。',
    implication: '鲜明的偏好有助于高效匹配，但也可能在某些情境下显得「不够灵活」。建议在坚持主型的同时，适度发展次型，让关系更丰富。',
  },
  dual_high: {
    title: '双高型分布',
    analysis: '主型与次型得分都较高（≥60%），且两者差距不大。你同时重视两个维度的体验，关系需求较为多元。',
    implication: '双高型往往对关系有较高期待，需要伴侣能同时满足多个维度。建议与伴侣坦诚沟通你对这两个维度的具体期望，避免「我以为你懂」的落差。',
  },
  single_dominant: {
    title: '单高悬殊型分布',
    analysis: '某一维度得分显著高于其他，其余维度相对较低。你的亲密关系偏好非常集中，核心需求非常明确。',
    implication: '这种分布意味着你在关系中「最看重一件事」。若伴侣的偏好分布不同，可能产生需求不对等的张力。建议明确表达核心需求，同时了解伴侣的优先次序，寻找交集。',
  },
};

const MPT_DIMENSION_INSIGHTS = {
  intimacy: '亲密偏好反映你重视情感联结与深度沟通的程度。高得分者更看重心灵契合、信任与长久承诺。可与激情、浪漫结合，保持关系活力。',
  passion: '激情偏好反映你重视强烈情感与身体体验的程度。高得分者追求心动、新鲜感与张力。可与亲密、浪漫结合，为长期关系注入持久动力。',
  romance: '浪漫偏好反映你重视仪式感与心意表达的程度。高得分者享受被追求、被宠爱的感觉。可与亲密结合，避免仅停留在表面浪漫。',
  explore: '探索偏好反映你对新体验的开放态度与沟通意愿。高得分者乐于在安全范围内沟通需求、尝试不同方式。注意与伴侣节奏同步、尊重边界。',
};

function getMPTProfileKey(primary, secondary) {
  const pId = primary?.id;
  const sId = secondary?.id;

  if (pId === 'intimacy' && sId === 'romance') return 'intimacy_romance';
  if (pId === 'romance' && sId === 'intimacy') return 'intimacy_romance';
  if (pId === 'passion' && sId === 'explore') return 'passion_explore';
  if (pId === 'explore' && sId === 'passion') return 'passion_explore';

  if (pId === 'intimacy') return 'intimacy';
  if (pId === 'passion') return 'passion';
  if (pId === 'romance') return 'romance';
  if (pId === 'explore') return 'explore';

  return 'balanced';
}

module.exports = {
  MPT_LEVEL_LABELS,
  MPT_PROFILES,
  MPT_DIMENSION_BY_LEVEL,
  MPT_SCORE_PATTERN_INSIGHTS,
  MPT_DIMENSION_INSIGHTS,
  getMPTProfileKey,
};
