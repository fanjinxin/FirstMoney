/**
 * SRI 四维度柱状图 - 移植自 SRIResult.tsx recharts BarChart
 * 横向柱状图，按 level(veryLow/low/mid/high/veryHigh) 着色
 */
const SRI_LEVEL_COLORS = {
  veryLow: '#2C6F7A',
  low: '#68D4DB',
  mid: '#9EABB8',
  high: '#7FBFE1',
  veryHigh: '#153243',
};

Component({
  properties: {
    data: { type: Array, value: [] },
  },
  data: { canvasId: '' },
  lifetimes: {
    attached() {
      this.setData({ canvasId: 'sri-bar-' + Math.random().toString(36).slice(2) });
    },
    ready() { this.scheduleDraw(); },
  },
  observers: { data() { this.scheduleDraw(); } },
  methods: {
    scheduleDraw() {
      const data = (this.properties.data || []).slice();
      if (data.length === 0) return;
      this.drawWithRetry(0);
    },
    drawWithRetry(attempt) {
      const self = this;
      const delay = attempt === 0 ? 250 : 100;
      setTimeout(function () { self.doDraw(attempt); }, delay);
    },
    doDraw(attempt) {
      const data = (this.properties.data || []).slice();
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
          const barH = Math.min(28, (chartH / data.length) * 0.6);
          const gap = (chartH / data.length) - barH;
          const maxScore = 5;
          const textColor = '#153243';
          data.forEach((d, i) => {
            const y = padTop + i * (chartH / data.length) + gap / 2;
            const score = Math.min(maxScore, Math.max(0, d.score || 0));
            const barW = (score / maxScore) * chartW;
            const color = SRI_LEVEL_COLORS[d.level] || SRI_LEVEL_COLORS.mid;
            ctx.fillStyle = color;
            ctx.fillRect(padLeft, y, barW, barH);
            ctx.fillStyle = textColor;
            ctx.font = '12px sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText((d.name || '').slice(0, 8), 4, y + barH / 2 + 4);
          });
        });
    },
  },
});
