# 心理测评 - 微信小程序版

基于 [FirstMoney](../) Web 版移植的微信原生小程序，尽可能还原原有 UI 和功能。

## 已实现功能

- **首页**：测评卡片列表、主题色（薄荷苏打）
- **测评页**：支持标准 5 选 1 题型、MBTI 的 A/B 5 点量表题型
- **结果页**：SCL90、LBT、MBTI、RPI 四种测评的结果展示
- **MBTI 雷达图**：使用 echarts-for-weixin 渲染

## 已移植测评

| 测评 | 题目数 | 状态 |
|------|--------|------|
| SCL-90 心理健康自评 | 90 | ✅ 完整 |
| RPI 恋爱占有欲指数 | 40 | ✅ 双视角 |
| LBT 恋爱脑测试 | 20 | ✅ 完整 |
| MBTI 16型人格 | 24 (精简版) | ✅ 含雷达图 |

其他测评（SRI、APT、HIT、DTH、TLA 等）在首页展示，点击会提示「暂无该测评」。

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
│   ├── scl90.js
│   ├── rpi.js
│   ├── lbt.js
│   ├── mbti.js
│   └── tests.js    # 首页测评列表
├── utils/
│   ├── storage.js  # wx.setStorageSync
│   └── scoring.js  # 计分逻辑
└── pages/
    ├── index/      # 首页
    ├── test/       # 通用测评页
    └── result/     # 通用结果页
```

## 后续可扩展

- 补充剩余测评的题目数据与计分逻辑
- MBTI 扩展为 90 题完整版
- 为 SCL90、LBT、RPI 等增加 echarts 图表
- 增加主题切换（沿用 Web 版 themes）
