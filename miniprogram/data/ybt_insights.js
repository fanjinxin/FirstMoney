/**
 * YBT 病娇测试解读 - 移植自 src/data/ybt_insights.ts
 */
const YBT_PROFILES = {
  gentle: { title: '温和型', summary: '你在占有欲、控制欲、依赖度与极端倾向四个维度上均处于较低水平，恋爱观较为健康、边界清晰。', advice: '保持当前的平衡感，适度表达需求。' },
  possessive: { title: '占有型', summary: '你的占有欲最为突出，希望成为伴侣心中唯一重要的人，对伴侣与异性的互动较为敏感。', advice: '尝试区分「适度在意」与「过度占有」，给伴侣一定的社交空间。' },
  controlling: { title: '控制型', summary: '你的控制欲较高，希望了解伴侣的行踪、参与其决策。', advice: '学会区分「关心」与「控制」，尊重伴侣的私人空间。' },
  dependent: { title: '依赖型', summary: '你对伴侣的情感依赖较强，伴侣在你生活中的权重很高。', advice: '培养自己的兴趣与社交圈，保持一定程度的情绪独立。' },
  extreme_risk: { title: '潜在病娇倾向', summary: '你在占有欲、控制欲或极端倾向中至少两项偏高。', advice: '建议关注情绪管理与边界意识，若困扰可寻求专业咨询。' },
  extreme_only: { title: '警觉型', summary: '你的极端倾向得分较高，但占有与控制维度相对较低。', advice: '关注情绪管理，学习用理性与沟通应对冲突。' },
  balanced: { title: '均衡型', summary: '四个维度得分较为均衡，处于适中区间。', advice: '保持觉察，根据实际关系动态灵活调整。' },
};

const YBT_DIMENSION_INSIGHTS = {
  possess: '占有欲反映你希望独享伴侣的倾向。适度的占有是爱的表现；过高可能让伴侣感到被束缚。',
  control: '控制欲反映你想了解、参与甚至主导伴侣生活的倾向。适度关心能增进亲密；过高可能侵犯对方隐私。',
  depend: '依赖度反映你对伴侣的情感依恋程度。适度依赖有助于亲密感；过高可能导致失去自我、过度焦虑。',
  extreme: '极端倾向反映在关系受挫时出现激烈想法或行为的可能性。高分者需关注情绪调节。',
};

function getYBTProfileKey(scores) {
  const byId = {};
  scores.forEach(d => { byId[d.id] = d; });
  const possess = byId.possess;
  const control = byId.control;
  const depend = byId.depend;
  const extreme = byId.extreme;

  const highCount = scores.filter(d => d.level === 'high').length;
  const lowCount = scores.filter(d => d.level === 'low').length;

  if (lowCount >= 3 && highCount === 0) return 'gentle';
  if (extreme?.level === 'high' && (possess?.level === 'high' || control?.level === 'high')) return 'extreme_risk';
  const highDanger = [possess, control, extreme].filter(d => d?.level === 'high').length;
  if (highDanger >= 2) return 'extreme_risk';
  if (extreme?.level === 'high' && possess?.level !== 'high' && control?.level !== 'high') return 'extreme_only';

  const sorted = [...scores].sort((a, b) => b.percent - a.percent);
  const top = sorted[0];
  if (!top) return 'balanced';
  if (top.level === 'high') {
    if (top.id === 'possess') return 'possessive';
    if (top.id === 'control') return 'controlling';
    if (top.id === 'depend') return 'dependent';
  }
  return 'balanced';
}

module.exports = { YBT_PROFILES, YBT_DIMENSION_INSIGHTS, getYBTProfileKey };
