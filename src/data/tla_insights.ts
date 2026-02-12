import type { TLADimensionId } from './tla'

/** 维度对应的可爱标签与 emoji */
export const TLA_DIMENSION_CUTE: Record<TLADimensionId, { label: string; emoji: string }> = {
  older: { label: '年上控', emoji: '✨' },
  younger: { label: '年下控', emoji: '🌸' },
  care: { label: '照顾型', emoji: '🫶' },
  cared: { label: '被宠型', emoji: '💕' },
}

/** 恋爱画像简短描述（按最高两维组合，key 按字母序） */
export const TLA_PROFILE_SHORT: Record<string, string> = {
  'care-cared': '你在照顾与被照顾之间比较均衡～既能付出也会撒娇，关系里很灵活～',
  'care-older': '你偏爱成熟稳重的伴侣，同时享受在关系中付出与保护～就像「可靠的大哥哥/大姐姐」型！',
  'care-younger': '你喜欢青春活力的人，并且享受照顾对方～「小奶狗/小奶猫」的理想主人就是你！',
  'cared-older': '你喜欢年长、有阅历的人，也乐于被对方呵护～妥妥的「被宠年上恋」体质～',
  'cared-younger': '你偏爱年轻朝气的人，也喜欢被对方宠着～双向甜甜的「年下恋」很适配你～',
  'older-younger': '你在年上与年下之间比较开放～年龄不是问题，感觉对了就OK～',
  default: '你的恋爱偏好比较多元～跟着感觉走就对了！',
}

export function getTLAProfileKey(topTwo: { id: TLADimensionId }[]): string {
  if (topTwo.length < 2) return 'default'
  const [a, b] = topTwo.map(d => d.id).sort()
  return TLA_PROFILE_SHORT[`${a}-${b}`] ? `${a}-${b}` : 'default'
}

export const TLA_DIMENSION_INSIGHTS: Record<TLADimensionId, string> = {
  older: '年上倾向反映你对成熟、有阅历伴侣的偏好。高分者更容易被年长者的稳重、见识与安全感吸引，适合与能提供指引与支持的伴侣建立关系。',
  younger: '年下倾向反映你对青春、活力伴侣的偏好。高分者更喜欢年轻者的单纯、朝气与新鲜感，可能在关系中更享受带领与保护的角色。',
  care: '照顾欲反映你乐于在关系中付出、保护与引导对方的倾向。高分者享受被需要的感觉，适合与愿意依赖你的伴侣相处。',
  cared: '被照顾欲反映你乐于在关系中被呵护、被支持的倾向。高分者享受被关心与包容，适合与愿意付出的伴侣相处。',
}
