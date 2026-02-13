/**
 * 图表绘制 - 使用旧版 Canvas API (canvas-id + createCanvasContext)
 * 旧版 API 在微信小程序中兼容性更好，无需 createSelectorQuery
 */
const DEFAULT_COLORS = {
  levelNormal: '#7FBFE1', levelMild: '#68D4DB', levelModerate: '#2C6F7A', levelSevere: '#0F4C5C',
  textColor: '#0F4C5C', gridRgba: 'rgba(207,239,240,0.5)', fillRgba: 'rgba(127,191,225,0.25)', strokeRgba: 'rgba(15,76,92,0.3)',
  palette: ['#7FBFE1', '#68D4DB', '#98E6E2', '#2C6F7A', '#0F4C5C'],
};

function getCanvasSize(canvasId) {
  const sys = wx.getSystemInfoSync();
  const w = Math.min(sys.windowWidth - 48, 350);
  const sizes = {
    'result-radar': [w, 280],
    'result-bar': [w, 400],
    'result-pie': [w, 260],
    'result-rpi-bar': [w, 200],
    'result-sri-bar': [w, 200],
  };
  return sizes[canvasId] || [w, 280];
}

function drawRadar(page, canvasId, data, colors, maxValue) {
  if (!data || data.length === 0) return;
  setTimeout(() => {
    const [w, h] = getCanvasSize(canvasId);
    const ctx = wx.createCanvasContext(canvasId);
    const cx = w / 2, cy = h / 2, n = data.length;
    const maxR = Math.min(w, h) / 2 - 40;
    const getPoint = (i, r) => {
      const angle = (Math.PI * 2 / n) * i - Math.PI / 2;
      return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
    };
    const c = colors || {};
    ctx.setStrokeStyle(c.gridRgba || 'rgba(207,239,240,0.6)');
    ctx.setLineWidth(1);
    for (let layer = 1; layer <= 5; layer++) {
      const r = (maxR / 5) * layer;
      ctx.beginPath();
      for (let i = 0; i <= n; i++) {
        const p = getPoint(i, r);
        i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
    }
    ctx.setStrokeStyle(c.strokeRgba || DEFAULT_COLORS.strokeRgba);
    ctx.setLineDash([4, 4]);
    for (let i = 0; i < n; i++) {
      const p = getPoint(i, maxR);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.setFillStyle(c.fillRgba || DEFAULT_COLORS.fillRgba);
    ctx.setStrokeStyle(c.textColor || DEFAULT_COLORS.textColor);
    ctx.setLineWidth(2);
    ctx.beginPath();
    const maxVal = maxValue || 5;
    const scale = maxR / maxVal;
    for (let i = 0; i <= n; i++) {
      const s = Math.min(maxVal, Math.max(0, (data[i % n] || {}).score || 0));
      const r = s * scale;
      const p = getPoint(i, r);
      i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.setFillStyle(c.textColor || DEFAULT_COLORS.textColor);
    ctx.setFontSize(10);
    ctx.setTextAlign('center');
    for (let i = 0; i < n; i++) {
      const name = (data[i] || {}).name || '';
      const p = getPoint(i, maxR + 18);
      ctx.fillText(name, p.x, p.y);
    }
    ctx.draw();
  }, 500);
}

function drawBar(page, canvasId, data, colors, maxScore) {
  const sorted = (data || []).slice().sort((a, b) => (b.score || 0) - (a.score || 0));
  if (sorted.length === 0) return;
  setTimeout(() => {
    const [w, h] = getCanvasSize(canvasId);
    const ctx = wx.createCanvasContext(canvasId);
    const padLeft = 90, padRight = 30, padTop = 20, padBottom = 30;
    const chartW = w - padLeft - padRight;
    const chartH = h - padTop - padBottom;
    const barH = Math.min(24, (chartH / sorted.length) * 0.6);
    const ms = maxScore || 5;
    const c = colors || {};
    const levelMap = { normal: c.levelNormal, mild: c.levelMild, moderate: c.levelModerate, severe: c.levelSevere };
    ctx.setFillStyle(c.textColor || DEFAULT_COLORS.textColor);
    ctx.setFontSize(11);
    ctx.setTextAlign('left');
    sorted.forEach((d, i) => {
      const y = padTop + i * (chartH / sorted.length) + ((chartH / sorted.length) - barH) / 2;
      const score = Math.min(ms, Math.max(0, d.score || 0));
      const barW = (score / ms) * chartW;
      ctx.setFillStyle(levelMap[d.level] || c.levelNormal || DEFAULT_COLORS.levelNormal);
      ctx.fillRect(padLeft, y, barW, barH);
      ctx.setFillStyle(c.textColor || DEFAULT_COLORS.textColor);
      ctx.fillText((d.name || '').slice(0, 6), 4, y + barH / 2 + 4);
    });
    ctx.setStrokeStyle(c.gridRgba || DEFAULT_COLORS.gridRgba);
    ctx.setLineDash([4, 4]);
    for (let v = 1; v <= 5; v++) {
      const x = padLeft + (v / 5) * chartW;
      ctx.beginPath();
      ctx.moveTo(x, padTop);
      ctx.lineTo(x, h - padBottom);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.draw();
  }, 500);
}

function drawPie(page, canvasId, data, colors) {
  if (!data || data.length === 0) return;
  const total = data.reduce((s, d) => s + (d.value || 0), 0);
  if (total === 0) return;
  setTimeout(() => {
    const [w, h] = getCanvasSize(canvasId);
    const ctx = wx.createCanvasContext(canvasId);
    const cx = w / 2, cy = h / 2 - 10;
    const outerR = Math.min(w, h) / 2 - 30;
    const innerR = outerR * 0.4;
    const palette = (colors && colors.palette) || DEFAULT_COLORS.palette;
    const dividerRgba = (colors && colors.dividerRgba) || 'rgba(0,0,0,0.08)';
    let startAngle = -Math.PI / 2;
    data.forEach((d, i) => {
      const value = d.value || 0;
      const sweep = (value / total) * Math.PI * 2;
      if (sweep <= 0) return;
      ctx.setFillStyle(palette[i % palette.length]);
      ctx.beginPath();
      ctx.arc(cx, cy, outerR, startAngle, startAngle + sweep);
      ctx.arc(cx, cy, innerR, startAngle + sweep, startAngle, true);
      ctx.closePath();
      ctx.fill();
      ctx.setStrokeStyle(dividerRgba);
      ctx.setLineWidth(2);
      ctx.stroke();
      startAngle += sweep;
    });
    ctx.draw();
  }, 500);
}

function drawRpiBar(page, canvasId, data, colors) {
  if (!data || data.length === 0) return;
  setTimeout(() => {
    const [w, h] = getCanvasSize(canvasId);
    const ctx = wx.createCanvasContext(canvasId);
    const padLeft = 100, padRight = 24, padTop = 16, padBottom = 24;
    const chartW = w - padLeft - padRight;
    const chartH = h - padTop - padBottom;
    const maxScore = 25;
    const rowH = chartH / data.length;
    const barH = Math.min(10, rowH * 0.35);
    const gap = (rowH - barH * 2) / 3;
    const c = colors || {};
    const selfColor = c.levelModerate || c.teal || '#2C6F7A';
    const partnerColor = c.levelMild || c.aqua || '#68D4DB';
    ctx.setFillStyle(c.textColor || '#0F4C5C');
    ctx.setFontSize(10);
    ctx.setTextAlign('right');
    data.forEach((d, i) => {
      const yBase = padTop + i * rowH + gap;
      const selfVal = Math.min(maxScore, Math.max(0, d.self || 0));
      const partnerVal = Math.min(maxScore, Math.max(0, d.partner || 0));
      const selfW = (selfVal / maxScore) * chartW;
      const partnerW = (partnerVal / maxScore) * chartW;
      ctx.fillText((d.name || '').slice(0, 4), padLeft - 6, yBase + barH + gap + barH / 2);
      ctx.setFillStyle(selfColor);
      ctx.fillRect(padLeft, yBase, selfW, barH);
      ctx.setFillStyle(partnerColor);
      ctx.fillRect(padLeft, yBase + barH + gap, partnerW, barH);
    });
    ctx.setStrokeStyle(c.gridRgba || 'rgba(15,76,92,0.15)');
    ctx.setLineDash([4, 4]);
    for (let v = 5; v <= 25; v += 5) {
      const x = padLeft + (v / maxScore) * chartW;
      ctx.beginPath();
      ctx.moveTo(x, padTop);
      ctx.lineTo(x, h - padBottom);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.draw();
  }, 500);
}

const SRI_LEVEL_COLORS = { veryLow: '#2C6F7A', low: '#68D4DB', mid: '#9EABB8', high: '#7FBFE1', veryHigh: '#153243' };

function drawSriBar(page, canvasId, data) {
  const sorted = (data || []).slice();
  if (sorted.length === 0) return;
  setTimeout(() => {
    const [w, h] = getCanvasSize(canvasId);
    const ctx = wx.createCanvasContext(canvasId);
    const padLeft = 90, padRight = 30, padTop = 20, padBottom = 30;
    const chartW = w - padLeft - padRight;
    const chartH = h - padTop - padBottom;
    const barH = Math.min(28, (chartH / sorted.length) * 0.6);
    const maxScore = 5;
    sorted.forEach((d, i) => {
      const y = padTop + i * (chartH / sorted.length) + ((chartH / sorted.length) - barH) / 2;
      const score = Math.min(maxScore, Math.max(0, d.score || 0));
      const barW = (score / maxScore) * chartW;
      ctx.setFillStyle(SRI_LEVEL_COLORS[d.level] || SRI_LEVEL_COLORS.mid);
      ctx.fillRect(padLeft, y, barW, barH);
      ctx.setFillStyle('#153243');
      ctx.setFontSize(12);
      ctx.setTextAlign('left');
      ctx.fillText((d.name || '').slice(0, 8), 4, y + barH / 2 + 4);
    });
    ctx.draw();
  }, 500);
}

/** FFT 九型柱状图：每条 bar 使用水果颜色，maxValue=100 */
function drawFFTBar(page, canvasId, data, maxValue) {
  const sorted = (data || []).slice().sort((a, b) => (b.score || 0) - (a.score || 0));
  if (sorted.length === 0) return;
  const max = maxValue || 100;
  setTimeout(() => {
    const [w, h] = getCanvasSize(canvasId);
    const ctx = wx.createCanvasContext(canvasId);
    const padLeft = 100;
    const padRight = 40;
    const padTop = 24;
    const padBottom = 24;
    const chartW = w - padLeft - padRight;
    const chartH = h - padTop - padBottom;
    const rowH = chartH / sorted.length;
    const barH = Math.min(14, rowH * 0.6);
    const gap = (rowH - barH) / 2;
    ctx.setFillStyle('#0F4C5C');
    ctx.setFontSize(10);
    ctx.setTextAlign('left');
    sorted.forEach((d, i) => {
      const y = padTop + i * rowH + gap;
      const score = Math.min(max, Math.max(0, d.score || 0));
      const barW = (score / max) * chartW;
      const color = d.color || '#2C6F7A';
      ctx.setFillStyle(color);
      ctx.fillRect(padLeft, y, barW, barH);
      ctx.setFillStyle('#0F4C5C');
      ctx.fillText((d.name || '').slice(0, 14), 4, y + barH / 2 + 3);
    });
    ctx.draw();
  }, 500);
}

function drawHollandHexagon(page, canvasId, topThreeIds) {
  const ids = topThreeIds || [];
  setTimeout(() => {
    const sz = 280;
    const ctx = wx.createCanvasContext(canvasId);
    const cx = sz / 2, cy = sz / 2, r = sz * 0.4;
    const order = ['R', 'I', 'A', 'S', 'E', 'C'];
    const points = order.map((_, i) => {
      const a = -Math.PI / 2 + i * (Math.PI / 3);
      return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a), id: order[i] };
    });
    ctx.setStrokeStyle('rgba(207,239,240,0.8)');
    ctx.setLineWidth(2);
    ctx.beginPath();
    points.forEach((p, i) => { i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y); });
    ctx.closePath();
    ctx.stroke();
    points.forEach((p) => {
      const isTop = ids.indexOf(p.id) >= 0;
      ctx.setFillStyle(isTop ? 'rgba(44,111,122,0.5)' : 'rgba(207,239,240,0.3)');
      ctx.beginPath();
      ctx.arc(p.x, p.y, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.setStrokeStyle('#2C6F7A');
      ctx.setLineWidth(isTop ? 2 : 1);
      ctx.stroke();
      ctx.setFillStyle('#0F4C5C');
      ctx.setFontSize(14);
      ctx.setTextAlign('center');
      ctx.setTextBaseline('middle');
      ctx.fillText(p.id, p.x, p.y + 2);
    });
    ctx.draw();
  }, 100);
}

module.exports = { drawRadar, drawBar, drawPie, drawRpiBar, drawSriBar, drawFFTBar, drawHollandHexagon };
