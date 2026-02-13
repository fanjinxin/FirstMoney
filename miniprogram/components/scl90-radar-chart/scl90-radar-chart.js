/**
 * SCL-90 雷达图 - 移植自 FactorRadarChart.tsx
 * 使用 Canvas 2D 绘制雷达轮廓
 */
Component({
  properties: {
    data: { type: Array, value: [] },
    colors: { type: Object, value: null },
    maxValue: { type: Number, value: 5 },
  },
  data: { canvasId: '' },
  lifetimes: {
    attached() {
      this.setData({ canvasId: 'radar-' + Math.random().toString(36).slice(2) });
    },
    ready() {
      this.scheduleDraw();
    },
  },
  observers: {
    'data, colors, maxValue'() { this.scheduleDraw(); },
  },
  methods: {
    scheduleDraw() {
      const data = this.properties.data || [];
      if (data.length === 0) return;
      this.drawWithRetry(0);
    },
    drawWithRetry(attempt) {
      const self = this;
      const delay = attempt === 0 ? 250 : 100;
      setTimeout(function () {
        self.doDraw(attempt);
      }, delay);
    },
    doDraw(attempt) {
      const data = this.properties.data || [];
      if (data.length === 0) return;
      const cid = this.data.canvasId;
      if (!cid) { if (attempt < 3) this.drawWithRetry(attempt + 1); return; }
      const query = wx.createSelectorQuery().in(this);
      const selector = '#' + cid;
      query.select(selector).fields({ node: true, size: true }).exec((res) => {
        if (!res || !res[0] || !res[0].node) {
          if (attempt < 3) this.drawWithRetry(attempt + 1);
          return;
        }
        const w = res[0].width || 0;
        const h = res[0].height || 0;
        if (w <= 0 || h <= 0) {
          if (attempt < 3) this.drawWithRetry(attempt + 1);
          return;
        }
        this.drawCanvas(res[0], data);
      });
    },
    drawCanvas(res, data) {
          const canvas = res.node;
          const ctx = canvas.getContext('2d');
          const dpr = wx.getSystemInfoSync().pixelRatio;
          canvas.width = res.width * dpr;
          canvas.height = res.height * dpr;
          ctx.scale(dpr, dpr);
          const w = res.width;
          const h = res.height;
          const cx = w / 2;
          const cy = h / 2;
          const n = data.length;
          const maxR = Math.min(w, h) / 2 - 40;
          const getPoint = (i, r) => {
            const angle = (Math.PI * 2 / n) * i - Math.PI / 2;
            return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
          };
          const c = this.properties.colors || {};
          const gridRgba = c.gridRgba || 'rgba(207,239,240,0.6)';
          const strokeRgba = c.strokeRgba || 'rgba(15,76,92,0.3)';
          const fillRgba = c.fillRgba || 'rgba(127,191,225,0.25)';
          const textColor = c.textColor || '#0F4C5C';
          ctx.strokeStyle = gridRgba;
          ctx.lineWidth = 1;
          for (let layer = 1; layer <= 5; layer++) {
            const r = (maxR / 5) * layer;
            ctx.beginPath();
            for (let i = 0; i <= n; i++) {
              const p = getPoint(i, r);
              if (i === 0) ctx.moveTo(p.x, p.y);
              else ctx.lineTo(p.x, p.y);
            }
            ctx.stroke();
          }
          ctx.strokeStyle = strokeRgba;
          ctx.setLineDash([4, 4]);
          for (let i = 0; i < n; i++) {
            const p = getPoint(i, maxR);
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
          }
          ctx.setLineDash([]);
          ctx.fillStyle = fillRgba;
          ctx.strokeStyle = textColor;
          ctx.lineWidth = 2;
          ctx.beginPath();
          const maxVal = this.properties.maxValue || 5;
          const scale = maxR / maxVal;
          for (let i = 0; i <= n; i++) {
            const s = Math.min(maxVal, Math.max(0, (data[i % n] || {}).score || 0));
            const r = s * scale;
            const p = getPoint(i, r);
            if (i === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = textColor;
          ctx.font = '10px sans-serif';
          ctx.textAlign = 'center';
          for (let i = 0; i < n; i++) {
            const name = (data[i] || {}).name || '';
            const p = getPoint(i, maxR + 18);
            ctx.fillText(name, p.x, p.y);
          }
    },
  },
});
