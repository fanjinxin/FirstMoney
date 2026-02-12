/**
 * MPT 麋鹿性偏好测试
 * 共 68 题，4 维度：亲密偏好、激情偏好、浪漫偏好、探索偏好
 * 5 点量表
 */

export const MPT_TEST_ID = 'mpt'

export const MPT_DIMENSIONS = [
  { id: 'intimacy', name: '亲密偏好', qStart: 1, qEnd: 17 },
  { id: 'passion', name: '激情偏好', qStart: 18, qEnd: 34 },
  { id: 'romance', name: '浪漫偏好', qStart: 35, qEnd: 51 },
  { id: 'explore', name: '探索偏好', qStart: 52, qEnd: 68 },
] as const

export type MPTDimensionId = (typeof MPT_DIMENSIONS)[number]['id']

export interface MPTQuestion {
  id: number
  text: string
  dimension: MPTDimensionId
  reverse: boolean
}

function buildMPTQuestions(): MPTQuestion[] {
  const qs: MPTQuestion[] = []
  const texts: Record<MPTDimensionId, string[]> = {
    intimacy: [
      '我更看重情感上的深度联结。',
      '亲密感比身体接触更重要。',
      '我希望与伴侣有深层次的沟通。',
      '情感安全是关系的基础。',
      '我倾向于先建立信任再做进一步。',
      '心灵的契合比外在吸引更重要。',
      '我享受与伴侣的安静共处。',
      '被理解比被关注更重要。',
      '我重视关系的稳定与长久。',
      '情感上的依赖是健康的。',
      '我更喜欢温和的亲密方式。',
      '亲密关系中的安全感很重要。',
      '我更在意对方的感受与需求。',
      '情感连接是亲密的起点。',
      '我倾向于慢慢建立亲密感。',
      '长期承诺比短期刺激更重要。',
      '心灵的亲近让我感到满足。',
    ],
    passion: [
      '我享受强烈的情感与身体体验。',
      '激情是关系中重要的一部分。',
      '我容易被强烈的吸引所打动。',
      '新鲜感对维持关系很重要。',
      '我追求恋爱中的心跳感。',
      '身体的吸引对我有重要性。',
      '我倾向于表达热烈的情感。',
      '刺激与变化让我感到兴奋。',
      '我享受关系中的张力与期待。',
      '激情的消退会让我不安。',
      '我容易被强烈的化学反应吸引。',
      '我倾向于主动表达欲望。',
      '身体的默契很重要。',
      '我追求关系中的强度与深度。',
      '平淡会让我感到乏味。',
      '我享受被强烈渴望的感觉。',
      '激情需要主动维护。',
    ],
    romance: [
      '我重视仪式感与浪漫表达。',
      '惊喜与心意对我很重要。',
      '我享受被追求与宠爱的感觉。',
      '浪漫的细节让我感到被爱。',
      '我倾向于用浪漫方式表达感情。',
      '理想的爱情应该像电影般美好。',
      '我容易被浪漫的举动打动。',
      '纪念日与特殊时刻很重要。',
      '我向往被捧在手心的感觉。',
      '浪漫是维持关系的润滑剂。',
      '我会为对方准备惊喜。',
      '我享受恋爱的甜蜜氛围。',
      '情话与甜言蜜语有其价值。',
      '我重视对方是否愿意花心思。',
      '浪漫可以弥补很多不足。',
      '我容易被细节上的用心打动。',
      '仪式感让关系更有质感。',
    ],
    explore: [
      '我对新的体验持开放态度。',
      '我愿意尝试不同的相处方式。',
      '好奇心是关系中的动力。',
      '我倾向于探索伴侣的方方面面。',
      '新鲜感有助于维持兴趣。',
      '我乐于在安全范围内尝试。',
      '了解对方的边界是重要的。',
      '我倾向于主动沟通需求。',
      '探索可以增进亲密感。',
      '我重视关系中的成长与变化。',
      '坦诚沟通偏好很重要。',
      '我愿意倾听对方的需求。',
      '互相探索可以加深理解。',
      '我倾向于用开放心态面对关系。',
      '边界内的探索是健康的。',
      '我乐于与伴侣共同成长。',
      '沟通与协商是探索的基础。',
    ],
  }
  let id = 1
  for (const dim of MPT_DIMENSIONS) {
    for (const text of texts[dim.id]) {
      qs.push({
        id,
        text,
        dimension: dim.id,
        reverse: id % 5 === 0,
      })
      id++
    }
  }
  return qs
}

export const mptQuestions = buildMPTQuestions()
