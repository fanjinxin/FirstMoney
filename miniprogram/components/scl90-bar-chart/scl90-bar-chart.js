/**
 * SCL-90 因子柱状图 - 移植自 FactorBarChart.tsx
 * 横向柱状图，按等级着色，颜色随主题变化
 */
const DEFAULT_COLORS = { levelNormal: '#7FBFE1', levelMild: '#68D4DB', levelModerate: '#2C6F7A', levelSevere: '#0F4C5C', levelDefault: '#CFEFF0', textColor: '#0F4C5C', gridRgba: 'rgba(207,239,240,0.5)' };

Component({
  properties: {
    data: { type: Array, value: [] },
    colors: { type: Object, value: null },
    maxScore: { type: Number, value: 5 },
  },
  data: { canvasId: '' },
  lifetimes: {
    attached() {
      this.setData({ canvasId: 'scl90-bar-' + Math.random().toString(36).slice(2) });
    },
    ready() { this.scheduleDraw(); },
  },
  observers: { 'data, colors, maxScore'() { this.scheduleDraw(); } },
  methods: {
    scheduleDraw() {
      const data = (this.properties.data || []).slice().sort((a, b) => (b.score || 0) - (a.score || 0));
      if (data.length === 0) return;
      this.drawWithRetry(0);
    },
    drawWithRetry(attempt) {
      const self = this;
      const delay = attempt === 0 ? 250 : 100;
      setTimeout(function () { self.doDraw(attempt); }, delay);
    },
    doDraw(attempt) {
      const data = (this.properties.data || []).slice().sort((a, b) => (b.score || 0) - (a.score || 0));
      if (data.length === 0) return;
      const query = wx.createSelectorQuery().in(this);
      const cid = this.data.canvasId;
      if (!cid) { if (attempt < 3) this.drawWithRetry(attempt + 1); return; }
      const selector = '#' + cid;
      query.select(selector).fields({ node: true, size: true }).exec((res) => {
        if (!res?.[0]?.node) {
          if (attempt < 3) this.drawWithRetry(attempt + 1);
          return;
        }
        const w = res[0].width || 0;
        const h = res[0].height || 0;
        if (w <= 0 || h <= 0) {
          if (attempt < 3) this.drawWithRetry(attempt + 1);
          return;
        }
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        const dpr = wx.getSystemInfoSync().pixelRatio;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.scale(dpr, dpr);
        const padLeft = 90;
        const padRight = 30;
        const padTop = 20;
        const padBottom = 30;
        const chartW = w - padLeft - padRight;
        const chartH = h - padTop - padBottom;
        const barH = Math.min(24, (chartH / data.length) * 0.6);
        const gap = (chartH / data.length) - barH;
        const maxScore = this.properties.maxScore || 5;
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
          const x = padLeft + (v / 5) * chartW;
          ctx.beginPath();
          ctx.moveTo(x, padTop);
          ctx.lineTo(x, h - padBottom);
          ctx.stroke();
        }
        ctx.setLineDash([]);
      });
    },
  },
});
