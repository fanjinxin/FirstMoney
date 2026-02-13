/**
 * 主题配置 - 严格移植自 src/styles/themes.ts
 */
const THEMES = [
  { id: 'ocean-breeze', name: '清凉夏日', colors: { sky: '#008ed9', aqua: '#40c9e4', mint: '#abe2e2', cream: '#f7eedd', haze: '#e0f7fa', deep: '#004d73', teal: '#007bb5' } },
  { id: 'sunset-glow', name: '落日晚霞', colors: { sky: '#ed9354', aqua: '#ffbb70', mint: '#ffeca0', cream: '#fefbda', haze: '#fff8e1', deep: '#8d4d1e', teal: '#d67d3e' } },
  { id: 'summer-mint', name: '薄荷苏打', colors: { sky: '#7FBFE1', aqua: '#68D4DB', mint: '#98E6E2', cream: '#F8F4E1', haze: '#CFEFF0', deep: '#0F4C5C', teal: '#2C6F7A' } },
  { id: 'peach-blossom', name: '桃夭灼灼', colors: { sky: '#ff8082', aqua: '#ffd097', mint: '#cdf9d6', cream: '#f6fdc2', haze: '#fff0f0', deep: '#8a2c2e', teal: '#d66e70' } },
  { id: 'spring-bud', name: '春日嫩芽', colors: { sky: '#a5dd9c', aqua: '#c5ebaa', mint: '#f3c28e', cream: '#f6f193', haze: '#f1f8e9', deep: '#3d5a36', teal: '#7cb342' } },
  { id: 'vibrant-contrast', name: '活力撞色', colors: { sky: '#ff9943', aqua: '#3568c2', mint: '#88a7fc', cream: '#ffde95', haze: '#fff3e0', deep: '#bf360c', teal: '#1565c0' } },
  { id: 'royal-dream', name: '梦幻蓝紫', colors: { sky: '#1e6dd0', aqua: '#a3e4db', mint: '#ffd1ea', cream: '#fff9f2', haze: '#e3f2fd', deep: '#0d47a1', teal: '#1976d2' } },
  { id: 'forest-light', name: '森之呼吸', colors: { sky: '#4b8130', aqua: '#a1cf00', mint: '#e6eeca', cream: '#f8bb19', haze: '#f1f8e9', deep: '#1b5e20', teal: '#33691e' } },
  { id: 'sky-clear', name: '雨后晴空', colors: { sky: '#029dd0', aqua: '#7ad1e8', mint: '#cdeff5', cream: '#f9e97f', haze: '#e1f5fe', deep: '#01579b', teal: '#0277bd' } },
];

function hexToRgb(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m ? `${parseInt(m[1], 16)}, ${parseInt(m[2], 16)}, ${parseInt(m[3], 16)}` : '0, 0, 0';
}

function getThemeStyle(theme) {
  if (!theme || !theme.colors) return '';
  const c = theme.colors;
  const parts = [
    `--xia-sky: ${c.sky}; --xia-aqua: ${c.aqua}; --xia-mint: ${c.mint}; --xia-cream: ${c.cream}; --xia-haze: ${c.haze}; --xia-deep: ${c.deep}; --xia-teal: ${c.teal}`,
    `--xia-deep-rgb: ${hexToRgb(c.deep)}`,
    `--xia-haze-rgb: ${hexToRgb(c.haze)}`,
    `--xia-sky-rgb: ${hexToRgb(c.sky)}`,
    `--xia-teal-rgb: ${hexToRgb(c.teal)}`,
    `--xia-cream-rgb: ${hexToRgb(c.cream)}`,
    `--xia-aqua-rgb: ${hexToRgb(c.aqua)}`,
    `--xia-mint-rgb: ${hexToRgb(c.mint)}`
  ];
  return parts.join('; ') + ';';
}

module.exports = { THEMES, getThemeStyle };
