/**
 * 宜居城市 - 维度解读
 * 移植自 src/data/city_insights.ts（精简版）
 */
const CITY_LEVEL_LABELS = { low: '偏低', moderate: '适中', high: '偏高' };

const CITY_PROFILES = {
  metropolis: { title: '一线/新一线都市型', summary: '你偏好快节奏、机会多、文化资源丰富的大城市。', focus: '适合北京、上海、深圳、杭州、广州、南京、成都等。', typicalCities: '北京、上海、深圳、杭州、广州、南京、武汉' },
  coastal_slow: { title: '海滨/文旅慢城型', summary: '你偏好慢节奏、气候宜人、环境优美的城市。', focus: '适合厦门、珠海、青岛、三亚、昆明、大理、威海、海口等。', typicalCities: '厦门、珠海、青岛、昆明、大理、威海、海口' },
  cost_effective: { title: '性价比宜居型', summary: '你高度重视生活成本，倾向选择房价、物价相对友好的城市。', focus: '适合长沙、成都、重庆、昆明、鄂尔多斯、佛山、无锡、扬州等。', typicalCities: '长沙、成都、重庆、鄂尔多斯、佛山、无锡、扬州、淄博' },
  cultural: { title: '文化氛围型', summary: '你最看重城市的文化底蕴、艺术氛围、历史遗存。', focus: '适合西安、南京、杭州、北京、敦煌、苏州、扬州、洛阳等。', typicalCities: '西安、南京、杭州、北京、敦煌、苏州、扬州、洛阳' },
  vitality: { title: '活力机会型', summary: '你偏好节奏较快、机会多、充满活力的城市。', focus: '适合深圳、杭州、成都、武汉、长沙、合肥、东莞等。', typicalCities: '深圳、杭州、成都、武汉、长沙、东莞' },
  balanced: { title: '均衡型城市', summary: '你在各维度上较为均衡，无明显极端偏好。', focus: '适合苏州、无锡、宁波、青岛、佛山、常州、嘉兴等。', typicalCities: '苏州、无锡、宁波、青岛、佛山、嘉兴、常州' },
};

const CITY_DIMENSION_BY_LEVEL = {
  climate: { low: '你更适应四季分明或偏冷的气候。', moderate: '你对气候适应性较强。', high: '你偏好温暖、阳光充足、少雨或沿海气候。' },
  pace: { low: '你更适合慢节奏、中小城市。', moderate: '你适应中等节奏。', high: '你偏好快节奏、大城市的活力。' },
  culture: { low: '文化资源不是你的首要考量。', moderate: '你希望城市有一定文化氛围。', high: '文化底蕴、艺术、美食对你很重要。' },
  cost: { low: '你能接受较高生活成本。', moderate: '你希望在成本与品质之间取得平衡。', high: '你高度重视性价比。' },
  social: { low: '你更看重熟人圈、家乡情结。', moderate: '你希望在开放与熟人社会之间取得平衡。', high: '你重视包容性、多元性、陌生人社交。' },
};

const CITY_DIMENSION_INSIGHTS = {
  climate: '气候偏好反映你对温度、湿度、四季的接受度。',
  pace: '生活节奏反映你对快/慢、拥挤/宁静的偏好。',
  culture: '文化氛围反映你对艺术、美食、创新的重视。',
  cost: '成本考量反映你对房价、物价的敏感度。',
  social: '社交需求反映你对包容性、熟人圈、行业聚集等的重视。',
};

module.exports = { CITY_LEVEL_LABELS, CITY_PROFILES, CITY_DIMENSION_BY_LEVEL, CITY_DIMENSION_INSIGHTS };
