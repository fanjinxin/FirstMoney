import type { CityDimensionId } from './city'

export const CITY_DIMENSION_INSIGHTS: Record<CityDimensionId, string> = {
  climate: '气候偏好反映你对温度、湿度、四季的接受度。影响对南方/北方、沿海/内陆城市的选择。',
  pace: '生活节奏反映你对快/慢、拥挤/宁静的偏好。影响对一线/二三线、都市/小镇的选择。',
  culture: '文化氛围反映你对艺术、美食、创新、教育等的重视。影响对文化名城、创意都市等的选择。',
  cost: '成本考量反映你对房价、物价、交通成本的敏感度。影响对高消费/性价比城市的权衡。',
  social: '社交需求反映你对包容性、熟人圈、行业聚集等的重视。影响对开放多元/传统熟人社会的偏好。',
}
