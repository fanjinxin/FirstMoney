/**
 * 宜居城市测试 - 移植自 src/data/city.ts
 * 45 题，5 维度：气候、节奏、文化、成本、社交
 */
const CITY_DIMENSIONS = [
  { id: 'climate', name: '气候偏好', qStart: 1, qEnd: 9 },
  { id: 'pace', name: '生活节奏', qStart: 10, qEnd: 18 },
  { id: 'culture', name: '文化氛围', qStart: 19, qEnd: 27 },
  { id: 'cost', name: '成本考量', qStart: 28, qEnd: 36 },
  { id: 'social', name: '社交需求', qStart: 37, qEnd: 45 },
];

const cityQuestions = [
  { id: 1, text: '我喜欢四季分明的气候。', dimension: 'climate', reverse: false },
  { id: 2, text: '我更喜欢温暖、少雨的城市。', dimension: 'climate', reverse: false },
  { id: 3, text: '冬季太长会让我感到压抑。', dimension: 'climate', reverse: false },
  { id: 4, text: '我能适应潮湿闷热的夏天。', dimension: 'climate', reverse: true },
  { id: 5, text: '我喜欢阳光充足的地方。', dimension: 'climate', reverse: false },
  { id: 6, text: '凉爽的天气让我更舒适。', dimension: 'climate', reverse: false },
  { id: 7, text: '雾霾和污染会影响我的选择。', dimension: 'climate', reverse: false },
  { id: 8, text: '我更喜欢干燥的气候。', dimension: 'climate', reverse: false },
  { id: 9, text: '沿海城市的气候更适合我。', dimension: 'climate', reverse: false },
  { id: 10, text: '我喜欢快节奏、充满活力的城市。', dimension: 'pace', reverse: false },
  { id: 11, text: '我更适合慢节奏、悠闲的生活。', dimension: 'pace', reverse: false },
  { id: 12, text: '大城市的拥挤会让我焦虑。', dimension: 'pace', reverse: false },
  { id: 13, text: '我享受通勤时间短的生活。', dimension: 'pace', reverse: false },
  { id: 14, text: '我向往小城镇的宁静。', dimension: 'pace', reverse: false },
  { id: 15, text: '机会多比生活舒适更重要。', dimension: 'pace', reverse: false },
  { id: 16, text: '我更喜欢中等规模的城市。', dimension: 'pace', reverse: false },
  { id: 17, text: '加班文化严重的城市不适合我。', dimension: 'pace', reverse: false },
  { id: 18, text: '我渴望大城市的机会与资源。', dimension: 'pace', reverse: false },
  { id: 19, text: '我重视城市的文化底蕴和历史感。', dimension: 'culture', reverse: false },
  { id: 20, text: '我喜欢艺术、展览、演出丰富的城市。', dimension: 'culture', reverse: false },
  { id: 21, text: '我更喜欢多元、开放的文化氛围。', dimension: 'culture', reverse: false },
  { id: 22, text: '我对美食多样性有要求。', dimension: 'culture', reverse: false },
  { id: 23, text: '我重视教育资源和学术氛围。', dimension: 'culture', reverse: false },
  { id: 24, text: '我希望城市有良好的阅读氛围。', dimension: 'culture', reverse: false },
  { id: 25, text: '夜生活丰富对我很重要。', dimension: 'culture', reverse: false },
  { id: 26, text: '我更喜欢传统、保守的氛围。', dimension: 'culture', reverse: false },
  { id: 27, text: '创新创业氛围会影响我的选择。', dimension: 'culture', reverse: false },
  { id: 28, text: '房价是我考虑的重要因素。', dimension: 'cost', reverse: false },
  { id: 29, text: '我能接受高房价换取更好的资源。', dimension: 'cost', reverse: false },
  { id: 30, text: '我更看重性价比。', dimension: 'cost', reverse: false },
  { id: 31, text: '生活成本高会让我压力很大。', dimension: 'cost', reverse: false },
  { id: 32, text: '我愿意为更好的生活品质多花钱。', dimension: 'cost', reverse: false },
  { id: 33, text: '我倾向于选择生活成本较低的城市。', dimension: 'cost', reverse: false },
  { id: 34, text: '交通成本是我在意的。', dimension: 'cost', reverse: false },
  { id: 35, text: '我能接受租房而非买房。', dimension: 'cost', reverse: false },
  { id: 36, text: '物价水平会显著影响我的选择。', dimension: 'cost', reverse: false },
  { id: 37, text: '我重视城市的包容性和多样性。', dimension: 'social', reverse: false },
  { id: 38, text: '我希望容易结识志同道合的人。', dimension: 'social', reverse: false },
  { id: 39, text: '熟人圈和家乡情结对我不重要。', dimension: 'social', reverse: true },
  { id: 40, text: '我更倾向于留在亲友附近。', dimension: 'social', reverse: false },
  { id: 41, text: '单身友好程度会影响我的选择。', dimension: 'social', reverse: false },
  { id: 42, text: '我更喜欢熟人社会式的氛围。', dimension: 'social', reverse: false },
  { id: 43, text: '陌生人社交对我很重要。', dimension: 'social', reverse: false },
  { id: 44, text: '社区氛围和邻里关系是我在意的。', dimension: 'social', reverse: false },
  { id: 45, text: '我更看重职业圈和行业聚集度。', dimension: 'social', reverse: false },
];

const cityTest = {
  id: 'city',
  title: '你最宜居的城市测试',
  subtitle: '择城参考',
  description: '从气候、生活节奏、文化氛围、成本、社交需求五个维度，了解你理想城市的特征。',
  instructions: ['请根据真实感受作答，每题五选一', '无对错之分，选最符合你的即可'],
  options: [
    { value: 1, label: '完全不符合' },
    { value: 2, label: '不太符合' },
    { value: 3, label: '一般' },
    { value: 4, label: '比较符合' },
    { value: 5, label: '完全符合' },
  ],
  questions: cityQuestions.map(q => ({ id: q.id, text: q.text, dimension: q.dimension, reverse: q.reverse })),
};

module.exports = { cityTest, cityQuestions, CITY_DIMENSIONS };
