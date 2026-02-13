/**
 * SCL-90 症状饼图 - 移植自 SymptomPieChart.tsx
 * 颜色随主题变化
 */
const DEFAULT_PALETTE = ['#7FBFE1', '#68D4DB', '#98E6E2', '#2C6F7A', '#0F4C5C'];

Component({
  data: {
    dataWithColors: [],
    canvasId: '',
  },
  properties: {
    data: { type: Array, value: [] },
    colors: { type: Object, value: null },
  },
  observers: {
    'data, colors'(data, colors) {
      if (data && data.length > 0) {
        const palette = (colors && colors.palette) || DEFAULT_PALETTE;
        this.setData({
          dataWithColors: data.map((item, i) => ({
            ...item,
            color: palette[i % palette.length]
          }))
        });
        this.scheduleDraw();
      }
    },
  },
  lifetimes: {
    attached() {
      this.setData({ canvasId: 'scl90-pie-' + Math.random().toString(36).slice(2) });
    },
    ready() {
      const data = this.properties.data || [];
      if (data.length > 0) {
        const palette = (this.properties.colors && this.properties.colors.palette) || DEFAULT_PALETTE;
        this.setData({
          dataWithColors: data.map((item, i) => ({
            ...item,
            color: palette[i % palette.length]
          }))
        });
        this.scheduleDraw();
      }
    },
  },
  methods: {
    scheduleDraw() {
      const data = this.properties.data || [];
      if (data.length === 0) return;
      const total = data.reduce((s, d) => s + (d.value || 0), 0);
      if (total === 0) return;
      this.drawWithRetry(0);
    },
    drawWithRetry(attempt) {
      const self = this;
      const delay = attempt === 0 ? 250 : 100;
      setTimeout(function () { self.doDraw(attempt); }, delay);
    },
    doDraw(attempt) {
      const data = this.properties.data || [];
      if (data.length === 0) return;
      const total = data.reduce((s, d) => s + (d.value || 0), 0);
      if (total === 0) return;
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
        const cx = w / 2;
        const cy = h / 2 - 10;
        const outerR = Math.min(w, h) / 2 - 30;
        const innerR = outerR * 0.4;
        const palette = (this.properties.colors && this.properties.colors.palette) || DEFAULT_PALETTE;
        const dividerRgba = (this.properties.colors && this.properties.colors.dividerRgba) || 'rgba(0,0,0,0.08)';
        let startAngle = -Math.PI / 2;
        data.forEach((d, i) => {
          const value = d.value || 0;
          const sweep = (value / total) * Math.PI * 2;
          if (sweep <= 0) return;
          ctx.beginPath();
          ctx.arc(cx, cy, outerR, startAngle, startAngle + sweep);
          ctx.arc(cx, cy, innerR, startAngle + sweep, startAngle, true);
          ctx.closePath();
          ctx.fillStyle = palette[i % palette.length];
          ctx.fill();
          ctx.strokeStyle = dividerRgba;
          ctx.lineWidth = 2;
          ctx.stroke();
          startAngle += sweep;
        });
      });
    },
  },
});
