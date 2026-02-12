/**
 * SCL-90 因子柱状图 - 移植自 FactorBarChart.tsx
 * 横向柱状图，按等级着色，颜色随主题变化
 */
const DEFAULT_COLORS = { levelNormal: '#7FBFE1', levelMild: '#68D4DB', levelModerate: '#2C6F7A', levelSevere: '#0F4C5C', levelDefault: '#CFEFF0', textColor: '#0F4C5C', gridRgba: 'rgba(207,239,240,0.5)' };

Component({
  properties: {
    data: { type: Array, value: [] },
    colors: { type: Object, value: null },
  },
  lifetimes: { ready() { this.draw(); } },
  observers: { 'data, colors'() { this.draw(); } },
  methods: {
    draw() {
      const data = (this.properties.data || []).slice().sort((a, b) => (b.score || 0) - (a.score || 0));
      if (data.length === 0) return;
      setTimeout(() => {
      const query = wx.createSelectorQuery().in(this);
      query.select('.scl90-bar-canvas').fields({ node: true, size: true }).exec((res) => {
        if (!res?.[0]?.node) return;
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        const dpr = wx.getSystemInfoSync().pixelRatio;
        canvas.width = res[0].width * dpr;
        canvas.height = res[0].height * dpr;
        ctx.scale(dpr, dpr);
        const w = res[0].width;
        const h = res[0].height;
        const padLeft = 90;
        const padRight = 30;
        const padTop = 20;
        const padBottom = 30;
        const chartW = w - padLeft - padRight;
        const chartH = h - padTop - padBottom;
        const barH = Math.min(24, (chartH / data.length) * 0.6);
        const gap = (chartH / data.length) - barH;
        const maxScore = 5;
        const c = this.properties.colors || {};
        const levelMap = { normal: c.levelNormal, mild: c.levelMild, moderate: c.levelModerate, severe: c.levelSevere };
        const textColor = c.textColor || DEFAULT_COLORS.textColor;
        const gridRgba = c.gridRgba || DEFAULT_COLORS.gridRgba;
        data.forEach((d, i) => {
          const y = padTop + i * (chartH / data.length) + gap / 2;
          const score = Math.min(maxScore, Math.max(0, d.score || 0));
          const barW = (score / maxScore) * chartW;
          const color = levelMap[d.level] || c.levelNormal || DEFAULT_COLORS.levelNormal;
          ctx.fillStyle = color;
          ctx.fillRect(padLeft, y, barW, barH);
          ctx.fillStyle = textColor;
          ctx.font = '11px sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText((d.name || '').slice(0, 6), 4, y + barH / 2 + 4);
        });
        ctx.strokeStyle = gridRgba;
        ctx.setLineDash([4, 4]);
        for (let v = 1; v <= 5; v++) {
          const x = padLeft + (v / maxScore) * chartW;
          ctx.beginPath();
          ctx.moveTo(x, padTop);
          ctx.lineTo(x, h - padBottom);
          ctx.stroke();
        }
        ctx.setLineDash([]);
      });
      }, 100);
    },
  },
});
