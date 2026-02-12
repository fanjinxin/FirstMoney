/**
 * SCL-90 症状饼图 - 移植自 SymptomPieChart.tsx
 * 颜色随主题变化
 */
const DEFAULT_PALETTE = ['#7FBFE1', '#68D4DB', '#98E6E2', '#2C6F7A', '#0F4C5C'];

Component({
  data: { dataWithColors: [] },
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
        this.draw();
      }
    },
  },
  lifetimes: {
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
        this.draw();
      }
    },
  },
  methods: {
    draw() {
      const data = this.properties.data || [];
      if (data.length === 0) return;
      const total = data.reduce((s, d) => s + (d.value || 0), 0);
      if (total === 0) return;
      setTimeout(() => {
      const query = wx.createSelectorQuery().in(this);
      query.select('.scl90-pie-canvas').fields({ node: true, size: true }).exec((res) => {
        if (!res?.[0]?.node) return;
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        const dpr = wx.getSystemInfoSync().pixelRatio;
        canvas.width = res[0].width * dpr;
        canvas.height = res[0].height * dpr;
        ctx.scale(dpr, dpr);
        const w = res[0].width;
        const h = res[0].height;
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
      }, 100);
    },
  },
});
