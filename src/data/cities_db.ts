/**
 * 中国宜居城市数据库
 * 覆盖直辖市、省会、计划单列市及重点地级市
 * 各维度 0-100：climate 气候温暖度/沿海度，pace 节奏快慢，culture 文化丰富度，cost 可负担性，social 开放多元度
 */
export interface CityProfile {
  id: string
  name: string
  province: string
  climate: number
  pace: number
  culture: number
  cost: number
  social: number
  brief: string
}

export const CHINESE_CITIES: CityProfile[] = [
  // 直辖市
  { id: 'beijing', name: '北京', province: '北京', climate: 42, pace: 95, culture: 95, cost: 18, social: 88, brief: '首都，文化底蕴深厚，机会与资源顶尖，节奏快，房价高' },
  { id: 'shanghai', name: '上海', province: '上海', climate: 55, pace: 95, culture: 92, cost: 15, social: 92, brief: '国际化大都市，多元开放，文化创意丰富，生活成本高' },
  { id: 'tianjin', name: '天津', province: '天津', climate: 48, pace: 68, culture: 75, cost: 55, social: 72, brief: '海滨直辖市，节奏适中，生活成本相对可控' },
  { id: 'chongqing', name: '重庆', province: '重庆', climate: 65, pace: 72, culture: 78, cost: 58, social: 78, brief: '山城，美食之都，节奏较快，房价友好' },
  // 广东
  { id: 'guangzhou', name: '广州', province: '广东', climate: 78, pace: 85, culture: 85, cost: 42, social: 88, brief: '岭南文化中心，饮食丰富，节奏快但相对从容' },
  { id: 'shenzhen', name: '深圳', province: '广东', climate: 82, pace: 95, culture: 75, cost: 28, social: 95, brief: '创新之都，年轻活力，包容开放，节奏极快' },
  { id: 'zhuhai', name: '珠海', province: '广东', climate: 82, pace: 48, culture: 70, cost: 48, social: 78, brief: '海滨城市，环境优美，节奏慢，宜居' },
  { id: 'dongguan', name: '东莞', province: '广东', climate: 80, pace: 75, culture: 65, cost: 55, social: 75, brief: '制造业名城，生活成本适中' },
  { id: 'foshan', name: '佛山', province: '广东', climate: 78, pace: 65, culture: 72, cost: 62, social: 72, brief: '岭南文化，节奏适中，性价比高' },
  { id: 'zhongshan', name: '中山', province: '广东', climate: 80, pace: 50, culture: 68, cost: 65, social: 70, brief: '孙中山故乡，节奏较慢，环境宜居' },
  { id: 'huizhou', name: '惠州', province: '广东', climate: 80, pace: 52, culture: 65, cost: 68, social: 70, brief: '滨海城市，环境好，房价相对友好' },
  // 浙江
  { id: 'hangzhou', name: '杭州', province: '浙江', climate: 62, pace: 78, culture: 90, cost: 38, social: 85, brief: '江南名城，互联网与人文并重，节奏适中偏快' },
  { id: 'ningbo', name: '宁波', province: '浙江', climate: 62, pace: 68, culture: 78, cost: 52, social: 75, brief: '港口城市，经济发达，文化底蕴深厚' },
  { id: 'wenzhou', name: '温州', province: '浙江', climate: 68, pace: 72, culture: 72, cost: 55, social: 72, brief: '民营经济活跃，商业氛围浓' },
  { id: 'jiaxing', name: '嘉兴', province: '浙江', climate: 62, pace: 55, culture: 75, cost: 60, social: 72, brief: '江南水乡，临近上海杭州，节奏舒缓' },
  { id: 'shaoxing', name: '绍兴', province: '浙江', climate: 62, pace: 52, culture: 82, cost: 58, social: 70, brief: '历史文化名城，鲁迅故乡，文化氛围浓厚' },
  { id: 'jinhua', name: '金华', province: '浙江', climate: 65, pace: 58, culture: 72, cost: 62, social: 70, brief: '义乌所在，商贸活跃，生活成本适中' },
  // 江苏
  { id: 'nanjing', name: '南京', province: '江苏', climate: 58, pace: 72, culture: 92, cost: 45, social: 82, brief: '六朝古都，高校云集，文化底蕴深厚' },
  { id: 'suzhou', name: '苏州', province: '江苏', climate: 62, pace: 70, culture: 88, cost: 42, social: 78, brief: '园林名城，经济强市，传统文化与现代并存' },
  { id: 'wuxi', name: '无锡', province: '江苏', climate: 62, pace: 65, culture: 78, cost: 58, social: 72, brief: '太湖明珠，工业发达，节奏适中' },
  { id: 'changzhou', name: '常州', province: '江苏', climate: 60, pace: 62, culture: 75, cost: 62, social: 72, brief: '制造业基地，生活舒适' },
  { id: 'nantong', name: '南通', province: '江苏', climate: 60, pace: 55, culture: 72, cost: 58, social: 70, brief: '江海交汇，临近上海，节奏舒缓' },
  { id: 'yangzhou', name: '扬州', province: '江苏', climate: 60, pace: 48, culture: 85, cost: 65, social: 72, brief: '历史文化名城，慢生活，宜居宜游' },
  { id: 'xuzhou', name: '徐州', province: '江苏', climate: 55, pace: 62, culture: 75, cost: 65, social: 70, brief: '淮海中心城市，交通枢纽，生活成本低' },
  // 四川
  { id: 'chengdu', name: '成都', province: '四川', climate: 58, pace: 55, culture: 88, cost: 55, social: 88, brief: '天府之国，慢生活，美食之都，包容多元' },
  { id: 'mianyang', name: '绵阳', province: '四川', climate: 58, pace: 52, culture: 72, cost: 72, social: 72, brief: '科技城，节奏舒缓，生活成本低' },
  // 湖北
  { id: 'wuhan', name: '武汉', province: '湖北', climate: 62, pace: 75, culture: 82, cost: 52, social: 78, brief: '九省通衢，高校众多，节奏较快' },
  { id: 'yichang', name: '宜昌', province: '湖北', climate: 60, pace: 52, culture: 72, cost: 65, social: 70, brief: '三峡门户，山水之城，节奏适中' },
  // 陕西
  { id: 'xian', name: '西安', province: '陕西', climate: 48, pace: 68, culture: 95, cost: 52, social: 78, brief: '十三朝古都，历史文化底蕴极深' },
  { id: 'baoji', name: '宝鸡', province: '陕西', climate: 50, pace: 50, culture: 75, cost: 72, social: 68, brief: '炎帝故里，节奏舒缓' },
  // 湖南
  { id: 'changsha', name: '长沙', province: '湖南', climate: 65, pace: 68, culture: 85, cost: 62, social: 82, brief: '娱乐之都，房价友好，文化创意活跃' },
  { id: 'zhuzhou', name: '株洲', province: '湖南', climate: 65, pace: 58, culture: 72, cost: 68, social: 72, brief: '铁路枢纽，制造业基地' },
  // 山东
  { id: 'jinan', name: '济南', province: '山东', climate: 52, pace: 62, culture: 78, cost: 58, social: 75, brief: '泉城，省会，文化底蕴深厚' },
  { id: 'qingdao', name: '青岛', province: '山东', climate: 62, pace: 62, culture: 82, cost: 52, social: 78, brief: '海滨名城，啤酒之都，节奏适中' },
  { id: 'yantai', name: '烟台', province: '山东', climate: 58, pace: 52, culture: 75, cost: 62, social: 75, brief: '海滨城市，环境优美，宜居' },
  { id: 'weihai', name: '威海', province: '山东', climate: 58, pace: 45, culture: 72, cost: 65, social: 75, brief: '海滨城市，环境佳，节奏慢' },
  { id: 'weifang', name: '潍坊', province: '山东', climate: 55, pace: 55, culture: 75, cost: 70, social: 72, brief: '风筝之都，生活成本低' },
  { id: 'zibo', name: '淄博', province: '山东', climate: 52, pace: 55, culture: 78, cost: 72, social: 72, brief: '齐文化发源地，近年来宜居热度上升' },
  // 福建
  { id: 'fuzhou', name: '福州', province: '福建', climate: 72, pace: 62, culture: 80, cost: 55, social: 78, brief: '榕城，省会，有福之州，节奏适中' },
  { id: 'xiamen', name: '厦门', province: '福建', climate: 80, pace: 58, culture: 85, cost: 42, social: 88, brief: '海滨花园城市，文艺氛围浓，包容开放' },
  { id: 'quanzhou', name: '泉州', province: '福建', climate: 78, pace: 62, culture: 82, cost: 62, social: 78, brief: '海上丝绸之路起点，民营经济活跃' },
  { id: 'zhangzhou', name: '漳州', province: '福建', climate: 80, pace: 50, culture: 75, cost: 68, social: 75, brief: '花果之乡，节奏慢，宜居' },
  // 辽宁
  { id: 'shenyang', name: '沈阳', province: '辽宁', climate: 42, pace: 65, culture: 82, cost: 62, social: 75, brief: '东北中心城市，四季分明，生活成本可控' },
  { id: 'dalian', name: '大连', province: '辽宁', climate: 52, pace: 62, culture: 82, cost: 52, social: 78, brief: '海滨城市，气候宜人，节奏适中' },
  { id: 'anshan', name: '鞍山', province: '辽宁', climate: 45, pace: 55, culture: 72, cost: 72, social: 70, brief: '钢铁之城，生活成本低' },
  // 云南
  { id: 'kunming', name: '昆明', province: '云南', climate: 88, pace: 50, culture: 78, cost: 55, social: 80, brief: '春城，四季如春，节奏慢，宜居' },
  { id: 'dali', name: '大理', province: '云南', climate: 82, pace: 35, culture: 85, cost: 55, social: 85, brief: '苍山洱海，文艺慢生活，多元包容' },
  { id: 'lijiang', name: '丽江', province: '云南', climate: 75, pace: 30, culture: 88, cost: 50, social: 85, brief: '古城与雪山，旅游与文化并重' },
  // 海南
  { id: 'haikou', name: '海口', province: '海南', climate: 88, pace: 48, culture: 72, cost: 55, social: 78, brief: '海岛省会，热带气候，节奏慢' },
  { id: 'sanya', name: '三亚', province: '海南', climate: 95, pace: 45, culture: 68, cost: 38, social: 75, brief: '热带海滨度假城市' },
  // 贵州
  { id: 'guiyang', name: '贵阳', province: '贵州', climate: 68, pace: 55, culture: 75, cost: 62, social: 78, brief: '避暑之都，大数据产业，节奏适中' },
  // 广西
  { id: 'nanning', name: '南宁', province: '广西', climate: 82, pace: 58, culture: 75, cost: 62, social: 80, brief: '绿城，东盟窗口，气候温暖' },
  { id: 'guilin', name: '桂林', province: '广西', climate: 72, pace: 45, culture: 85, cost: 58, social: 78, brief: '山水甲天下，旅游名城，节奏慢' },
  { id: 'beihai', name: '北海', province: '广西', climate: 85, pace: 45, culture: 72, cost: 65, social: 75, brief: '海滨城市，银滩，节奏舒缓' },
  // 安徽
  { id: 'hefei', name: '合肥', province: '安徽', climate: 62, pace: 68, culture: 78, cost: 58, social: 75, brief: '科教城市，新兴发展，节奏较快' },
  { id: 'huangshan', name: '黄山', province: '安徽', climate: 65, pace: 38, culture: 82, cost: 58, social: 72, brief: '世界遗产所在地，旅游与生态' },
  // 河南
  { id: 'zhengzhou', name: '郑州', province: '河南', climate: 55, pace: 72, culture: 75, cost: 58, social: 75, brief: '中原枢纽，国家中心城市' },
  { id: 'luoyang', name: '洛阳', province: '河南', climate: 55, pace: 55, culture: 88, cost: 62, social: 72, brief: '十三朝古都，历史文化厚重' },
  // 江西
  { id: 'nanchang', name: '南昌', province: '江西', climate: 68, pace: 62, culture: 75, cost: 62, social: 75, brief: '英雄城，省会，节奏适中' },
  { id: 'jiujiang', name: '九江', province: '江西', climate: 65, pace: 50, culture: 78, cost: 65, social: 72, brief: '庐山所在，滨江城市' },
  // 山西
  { id: 'taiyuan', name: '太原', province: '山西', climate: 48, pace: 58, culture: 78, cost: 65, social: 72, brief: '晋商故里，能源重镇' },
  { id: 'datong', name: '大同', province: '山西', climate: 45, pace: 50, culture: 82, cost: 72, social: 68, brief: '云冈石窟所在地，历史文化名城' },
  // 河北
  { id: 'shijiazhuang', name: '石家庄', province: '河北', climate: 52, pace: 65, culture: 72, cost: 65, social: 72, brief: '省会，交通枢纽' },
  { id: 'qinhuangdao', name: '秦皇岛', province: '河北', climate: 58, pace: 50, culture: 75, cost: 62, social: 75, brief: '海滨避暑胜地' },
  // 黑龙江
  { id: 'haerbin', name: '哈尔滨', province: '黑龙江', climate: 35, pace: 58, culture: 85, cost: 65, social: 75, brief: '冰城，欧式建筑，冬季特色鲜明' },
  { id: 'daqing', name: '大庆', province: '黑龙江', climate: 40, pace: 55, culture: 68, cost: 75, social: 70, brief: '石油之城，生活成本低' },
  // 吉林
  { id: 'changchun', name: '长春', province: '吉林', climate: 42, pace: 60, culture: 78, cost: 65, social: 72, brief: '汽车城，电影城' },
  { id: 'jilin', name: '吉林市', province: '吉林', climate: 48, pace: 52, culture: 75, cost: 70, social: 70, brief: '雾凇之都' },
  // 甘肃
  { id: 'lanzhou', name: '兰州', province: '甘肃', climate: 45, pace: 58, culture: 78, cost: 68, social: 72, brief: '黄河穿城，西北重镇' },
  { id: 'dunhuang', name: '敦煌', province: '甘肃', climate: 42, pace: 35, culture: 95, cost: 55, social: 70, brief: '丝路明珠，莫高窟所在地' },
  // 新疆
  { id: 'urumqi', name: '乌鲁木齐', province: '新疆', climate: 45, pace: 62, culture: 78, cost: 62, social: 75, brief: '亚心之都，多元文化' },
  { id: 'kashgar', name: '喀什', province: '新疆', climate: 48, pace: 45, culture: 92, cost: 68, social: 78, brief: '丝路古城，民族风情浓厚' },
  // 内蒙古
  { id: 'hohhot', name: '呼和浩特', province: '内蒙古', climate: 42, pace: 58, culture: 75, cost: 65, social: 72, brief: '草原青城' },
  { id: 'erdos', name: '鄂尔多斯', province: '内蒙古', climate: 45, pace: 55, culture: 68, cost: 72, social: 68, brief: '能源城市' },
  // 青海
  { id: 'xining', name: '西宁', province: '青海', climate: 42, pace: 52, culture: 75, cost: 65, social: 75, brief: '高原夏都' },
  // 宁夏
  { id: 'yinchuan', name: '银川', province: '宁夏', climate: 48, pace: 55, culture: 75, cost: 68, social: 72, brief: '塞上江南' },
  // 西藏
  { id: 'lasa', name: '拉萨', province: '西藏', climate: 45, pace: 40, culture: 95, cost: 55, social: 80, brief: '日光城，藏文化中心' },
  // 广东其他
  { id: 'zhanjiang', name: '湛江', province: '广东', climate: 85, pace: 50, culture: 72, cost: 68, social: 75, brief: '海滨城市，节奏慢' },
  { id: 'jiangmen', name: '江门', province: '广东', climate: 80, pace: 50, culture: 75, cost: 68, social: 75, brief: '侨乡，节奏舒缓' },
  // 浙江其他
  { id: 'huzhou', name: '湖州', province: '浙江', climate: 62, pace: 50, culture: 78, cost: 62, social: 70, brief: '湖笔之都，江南水乡' },
  { id: 'taizhou_zj', name: '台州', province: '浙江', climate: 68, pace: 62, culture: 72, cost: 62, social: 72, brief: '民营经济活跃' },
  // 江苏其他
  { id: 'zhenjiang', name: '镇江', province: '江苏', climate: 60, pace: 55, culture: 80, cost: 62, social: 72, brief: '历史文化名城' },
  { id: 'taizhou_js', name: '泰州', province: '江苏', climate: 60, pace: 52, culture: 75, cost: 65, social: 70, brief: '凤城，节奏舒缓' },
]
