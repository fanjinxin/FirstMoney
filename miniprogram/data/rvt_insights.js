/**
 * RVT 恋爱观测试解读 - 移植自 src/data/rvt_insights.ts
 */
const RVT_PROFILES = {
  eros: { title: '浪漫情欲型 (Eros)', summary: '你重视外表吸引与激情，相信一见钟情。你向往热烈、浓烈的情感体验。', advice: '激情会随时间自然消退，可逐步培养默契与陪伴。' },
  ludus: { title: '游戏型 (Ludus)', summary: '你把恋爱当游戏，倾向于避免过于投入，不喜欢被关系束缚。', advice: '若希望建立稳定关系，可尝试适度投入与承诺。' },
  storge: { title: '友谊型 (Storge)', summary: '你认为最好的爱情是从好朋友慢慢发展来的，更相信日久生情。', advice: '稳定的友谊式爱情是长久关系的基础，可适度营造浪漫。' },
  mania: { title: '占有型 (Mania)', summary: '你在恋爱中容易依赖、占有，情绪强烈，常常感到焦虑和不安全。', advice: '练习情绪独立与边界意识，给伴侣一定空间。' },
  pragma: { title: '现实型 (Pragma)', summary: '你看重条件与合适，会理性评估一段关系是否可行。', advice: '理性是优势，同时可适度关注情感联结。' },
  agape: { title: '奉献型 (Agape)', summary: '你倾向于无私付出，愿意为伴侣付出一切，很少计较得失。', advice: '在付出的同时，记得关注自己的需求与边界。' },
  balanced: { title: '均衡型', summary: '六种风格得分较为均衡，你的恋爱观较为多元。', advice: '根据实际情况灵活调整，找到适合自己的方式。' },
};

const RVT_DIMENSION_INSIGHTS = {
  eros: '浪漫情欲型重视外表吸引与激情，相信一见钟情，追求热烈体验。',
  ludus: '游戏型把恋爱当游戏，避免过度投入，追求自由与新鲜感。',
  storge: '友谊型相信日久生情，重视默契与舒适，伴侣应是好朋友。',
  mania: '占有型情感投入深，容易依赖占有，常感焦虑不安。',
  pragma: '现实型看重条件与合适，理性评估关系可行性。',
  agape: '奉献型倾向于无私付出，伴侣幸福优先于自己的需求。',
};

module.exports = { RVT_PROFILES, RVT_DIMENSION_INSIGHTS };
