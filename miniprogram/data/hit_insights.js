/**
 * HIT 霍兰德职业兴趣解读 - 移植自 src/data/hit_insights.ts
 */
const HOLLAND_CODE_INTRO = {
  what: '六型 RIASEC 按得分取前三组成代码，用于匹配职业。',
};

const HOLLAND_ADJACENT = { R: ['I', 'C'], I: ['R', 'A'], A: ['I', 'S'], S: ['A', 'E'], E: ['S', 'C'], C: ['E', 'R'] };

function getCodeConsistency(topThree) {
  const ids = (topThree || []).slice(0, 3).map(t => t.id);
  let adjacentCount = 0;
  for (let i = 0; i < ids.length - 1; i++) {
    const adj = HOLLAND_ADJACENT[ids[i]] || [];
    if (adj.includes(ids[i + 1])) adjacentCount++;
  }
  if (adjacentCount >= 2) return { level: '高', short: '兴趣集中' };
  if (adjacentCount === 1) return { level: '中', short: '兴趣多元' };
  return { level: '较分散', short: '兴趣多元' };
}

const HIT_DIMENSION_SHORT = {
  R: '动手操作·工具机器·工程师/技工/飞行员',
  I: '探究分析·抽象理论·科学家/医师/程序员',
  A: '创意表达·美感独特性·设计师/作家/建筑师',
  S: '帮助他人·人际交流·教师/咨询师/护士',
  E: '领导说服·竞争目标·销售/企业家/律师',
  C: '有条理·规则文书·会计/行政/审计',
};

const HIT_DIMENSION_INSIGHTS = {
  R: '现实型（R）喜欢动手操作、使用工具与机器，偏好具体、可触摸的任务。适合职业：工程师、机械师、电工、技工、园艺师、运动员、飞行员、建筑工人等。',
  I: '研究型（I）喜欢探究、分析与独立思考，偏好抽象与理论。适合职业：科学家、研究员、医师、程序员、数据分析师、大学教授、实验室技术员等。',
  A: '艺术型（A）喜欢创造性表达，追求美感与独特性。适合职业：画家、设计师、音乐家、作家、演员、摄影师、建筑师、广告创意等。',
  S: '社会型（S）喜欢帮助他人、与人交流、关心社会。适合职业：教师、心理咨询师、护士、社工、人力资源、公关、导游等。',
  E: '企业型（E）喜欢领导、说服、竞争与达成目标。适合职业：销售经理、企业家、律师、项目经理、政治家、市场策划等。',
  C: '常规型（C）喜欢有条理、遵循规则、处理数据与文书。适合职业：会计师、行政助理、秘书、审计员、银行柜员、档案管理员等。',
};

const HOLLAND_CODE_EXAMPLES = {
  RIA: '工程师、机械设计师、地质学家', RIC: '机械工程师、测量员、制图员', RIE: '建筑师、土木工程师、飞行员',
  RSE: '警察、消防员、保安', RSC: '汽车修理工、电器维修', REA: '室内设计师、珠宝设计师',
  REC: '质检员、设备操作员', IRA: '科研人员、药剂师', IRC: '实验室技术员、程序员',
  IRE: '医学研究员、生物工程师', ISA: '心理咨询师、营养师', ISC: '统计师、医学检验',
  IEA: '管理顾问、经济学家', IEC: '会计师、审计师', ICS: '医生、药剂师',
  ARI: '艺术家兼研究员', ARS: '艺术教师、博物馆策展', ARE: '广告策划、品牌设计',
  AIS: '艺术治疗师、音乐教师', AIC: '平面设计师、网页设计', AIE: '创意总监、产品经理',
  ASI: '音乐家、舞蹈教师', ASE: '演艺经纪、活动策划', ASC: '文案、编辑',
  SRA: '体育教练、康复师', SRI: '护士、医学社工', SRC: '行政助理、接待员',
  SIR: '康复治疗师、职业治疗师', SIA: '心理咨询师、教师', SIC: '人力资源、培训师',
  SEA: '公关、活动策划', SEI: '销售培训师、教练', SEC: '销售经理、客户经理',
  EAR: '项目经理、工程管理', EAS: '市场总监、品牌经理', EAC: '企业高管、总经理',
  ERI: '技术管理、研发总监', ERS: '区域经理、团队领导', ERC: '运营经理、供应链',
  ESI: '人力资源总监', ESA: '公关总监、传媒', ESC: '财务总监、行政总监',
  CRA: '财务分析师、审计', CRS: '行政经理、办公室主任', CRI: '数据分析师、统计',
  CAR: '会计、税务专员', CAS: '行政专员、秘书', CAI: '财务规划师',
  CEA: '财务顾问、投行', CER: '采购、物流管理', CES: '客户服务经理',
  CIE: '信息系统管理', CIS: '人力资源专员', CIA: '市场研究分析师',
};

module.exports = { getCodeConsistency, HIT_DIMENSION_SHORT, HIT_DIMENSION_INSIGHTS, HOLLAND_CODE_EXAMPLES, HOLLAND_CODE_INTRO };
