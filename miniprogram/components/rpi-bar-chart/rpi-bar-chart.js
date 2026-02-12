/**
 * RPI 四维度柱状图 - 自我 vs 伴侣，横向分组柱
 * data: [{ name, self, partner }]
 */
Component({
  properties: {
    data: { type: Array, value: [] },
    colors: { type: Object, value: null },
  },
  lifetimes: { ready() { this.draw(); } },
  observers: { 'data, colors'() { this.draw(); } },
  methods: {
    draw() {
      const data = this.properties.data || [];
      if (data.length === 0) return;
      const c = this.properties.colors || {};
      const selfColor = c.levelModerate || c.teal || '#2C6F7A';
      const partnerColor = c.levelMild || c.aqua || '#68D4DB';
      const textColor = c.textColor || '#0F4C5C';
      const gridRgba = c.gridRgba || 'rgba(15,76,92,0.15)';

      setTimeout(() => {
        const query = wx.createSelectorQuery().in(this);
        query.select('.rpi-bar-canvas').fields({ node: true, size: true }).exec((res) => {
          if (!res?.[0]?.node) return;
          const canvas = res[0].node;
          const ctx = canvas.getContext('2d');
          const dpr = wx.getSystemInfoSync().pixelRatio;
          canvas.width = res[0].width * dpr;
          canvas.height = res[0].height * dpr;
          ctx.scale(dpr, dpr);
          const w = res[0].width;
          const h = res[0].height;
          const padLeft = 100;
          const padRight = 24;
          const padTop = 16;
          const padBottom = 24;
          const chartW = w - padLeft - padRight;
          const chartH = h - padTop - padBottom;
          const maxScore = 25;
          const rowH = chartH / data.length;
          const barH = Math.min(10, rowH * 0.35);
          const gap = (rowH - barH * 2) / 3;

          data.forEach((d, i) => {
            const yBase = padTop + i * rowH + gap;
            const selfVal = Math.min(maxScore, Math.max(0, d.self || 0));
            const partnerVal = Math.min(maxScore, Math.max(0, d.partner || 0));
            const selfW = (selfVal / maxScore) * chartW;
            const partnerW = (partnerVal / maxScore) * chartW;

            ctx.fillStyle = textColor;
            ctx.font = '10px sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText((d.name || '').slice(0, 4), padLeft - 6, yBase + barH + gap + barH / 2);

            ctx.fillStyle = selfColor;
            ctx.fillRect(padLeft, yBase, selfW, barH);
            ctx.fillStyle = partnerColor;
            ctx.fillRect(padLeft, yBase + barH + gap, partnerW, barH);
          });

          ctx.strokeStyle = gridRgba;
          ctx.setLineDash([4, 4]);
          for (let v = 5; v <= 25; v += 5) {
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
