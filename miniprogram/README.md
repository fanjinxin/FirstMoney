# 心理测评 - 微信小程序版

基于 [FirstMoney](../) Web 版移植的微信原生小程序，尽可能还原原有 UI 和功能。

## 已实现功能

- **首页**：测评卡片列表、主题色切换
- **测评页**：支持 5 选 1、MBTI A/B 量表、choice 三选一/二选一
- **结果页**：各测评雷达图、柱状图、维度解读、建议
- **图表**：echarts-for-weixin 雷达图与柱状图

## 已移植测评

| 测评 | 题目数 | 状态 |
|------|--------|------|
| SCL-90 心理健康自评 | 90 | ✅ 完整 |
| RPI 恋爱占有欲指数 | 40 | ✅ 双视角 |
| SRI 性压抑指数 | 48 | ✅ 完整 |
| 人格动物塑测试 | 60 | ✅ 完整 |
| MBTI 16型人格 | 90 | ✅ 完整 |
| AAT 学习适应性 | 118 | ✅ 完整 |
| 心理年龄测验 | 35 | ✅ 完整 |
| APT 天赋潜能 | 60 | ✅ 完整 |
| HIT 霍兰德职业兴趣 | 90 | ✅ 完整 |
| DTH 黑暗三角 | 70 | ✅ 完整 |
| TLA 年上年下恋爱 | 52 | ✅ 完整 |
| FFT 水果塑形 | 54 | ✅ 完整 |
| YBT 病娇测试 | 40 | ✅ 完整 |
| RVT 恋爱观 | 36 | ✅ 完整 |
| LBT 恋爱脑 | 20 | ✅ 完整 |
| MPT 麋鹿性偏好 | 68 | ✅ 完整 |
| VBT 易被欺负 | 40 | ✅ 完整 |
| City 宜居城市 | 45 | ✅ 完整 |

## 运行方式

1. 用 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html) 打开 `miniprogram` 目录
2. 在工具中执行：**工具 → 构建 npm**
3. 编译并预览

## 项目结构

```
miniprogram/
├── app.js / app.json / app.wxss
├── data/           # 测评题目与配置
│   ├── index.js    # getTestConfig
│   ├── tests.js    # 首页测评列表
│   ├── scl90.js, rpi.js, sri.js, mbti.js, aat.js
│   ├── psych_age.js, apt.js, hit.js, dth.js, tla.js
│   ├── fft.js, ybt.js, rvt.js, lbt.js, mpt.js, vbt.js, city.js
│   ├── cities_db.js, animal_sculpture.js
│   └── *_insights.js  # 各测评解读文案
├── utils/
│   ├── storage.js, testSample.js
│   ├── scoring.js  # 统一计分入口
│   └── *_scoring.js  # 各测评计分逻辑
└── pages/
    ├── index/      # 首页
    ├── test/       # 通用测评页
    ├── scl90-test/, rpi-test/, animal-test/  # 专用测评页
    └── result/     # 通用结果页
```

## 后续可扩展

- 主题切换优化
- 报告分享/保存为图片
