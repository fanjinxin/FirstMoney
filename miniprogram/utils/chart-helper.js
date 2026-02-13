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
  // 预留左右边距，确保图表不超出屏幕
  const w = Math.min(sys.windowWidth - 56, 320);
  const sizes = {
    'result-radar': [w, 260],
    'result-bar': [w, 360],
    'mpt-bar': [w, 220],
    'lbt-bar': [w, 200],
    'ybt-bar': [w, 208],
    'result-pie': [w, 240],
    'result-rpi-bar': [w, 180],
    'result-sri-bar': [w, 180],
    'vbt-bar': [w, 220],
    'city-bar': [w, 280],
  };
  return sizes[canvasId] || [w, 260];
}

function drawRadar(page, canvasId, data, colors, maxValue) {
  if (!data || data.length === 0) return;
  setTimeout(() => {
    const [w, h] = getCanvasSize(canvasId);
    const ctx = wx.createCanvasContext(canvasId, page);
    const cx = w / 2, cy = h / 2, n = data.length;
    const maxR = Math.min(w, h) / 2 - 48;
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
      const name = ((data[i] || {}).name || '').slice(0, 4);
      const p = getPoint(i, maxR + 14);
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
    const ctx = wx.createCanvasContext(canvasId, page);
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
    const ctx = wx.createCanvasContext(canvasId, page);
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
    const ctx = wx.createCanvasContext(canvasId, page);
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
    const ctx = wx.createCanvasContext(canvasId, page);
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

/** YBT 病娇柱状图：玫瑰色 rgb(190,18,60)，maxValue=100 */
function drawYBTBar(page, canvasId, data, maxValue) {
  const sorted = (data || []).slice().sort((a, b) => (b.score || 0) - (a.score || 0));
  if (sorted.length === 0) return;
  const max = maxValue || 100;
  const ROSE = 'rgb(190, 18, 60)';
  setTimeout(() => {
    const [w, h] = getCanvasSize(canvasId);
    const ctx = wx.createCanvasContext(canvasId, page);
    const padLeft = 90;
    const padRight = 32;
    const padTop = 24;
    const padBottom = 24;
    const chartW = w - padLeft - padRight;
    const chartH = h - padTop - padBottom;
    const rowH = chartH / sorted.length;
    const barH = Math.min(18, rowH * 0.6);
    const gap = (rowH - barH) / 2;
    ctx.setFillStyle('#0F4C5C');
    ctx.setFontSize(10);
    ctx.setTextAlign('left');
    sorted.forEach((d, i) => {
      const y = padTop + i * rowH + gap;
      const score = Math.min(max, Math.max(0, d.score || 0));
      const barW = (score / max) * chartW;
      ctx.setFillStyle(ROSE);
      ctx.setGlobalAlpha(0.85);
      ctx.fillRect(padLeft, y, barW, barH);
      ctx.setGlobalAlpha(1);
      ctx.setFillStyle('#0F4C5C');
      ctx.fillText((d.name || '').slice(0, 8), 4, y + barH / 2 + 3);
    });
    ctx.draw();
  }, canvasId === 'ybt-bar' ? 700 : 500);
}

/** RVT 恋爱观柱状图：玫瑰色 rgb(190,18,60)，maxValue=100 */
function drawRVTBar(page, canvasId, data, maxValue) {
  const sorted = (data || []).slice().sort((a, b) => (b.score || 0) - (a.score || 0));
  if (sorted.length === 0) return;
  const max = maxValue || 100;
  const ROSE = 'rgb(190, 18, 60)';
  setTimeout(() => {
    const [w, h] = getCanvasSize(canvasId);
    const ctx = wx.createCanvasContext(canvasId, page);
    const padLeft = 90;
    const padRight = 32;
    const padTop = 24;
    const padBottom = 24;
    const chartW = w - padLeft - padRight;
    const chartH = h - padTop - padBottom;
    const rowH = chartH / sorted.length;
    const barH = Math.min(18, rowH * 0.6);
    const gap = (rowH - barH) / 2;
    ctx.setFillStyle('#0F4C5C');
    ctx.setFontSize(10);
    ctx.setTextAlign('left');
    sorted.forEach((d, i) => {
      const y = padTop + i * rowH + gap;
      const score = Math.min(max, Math.max(0, d.score || 0));
      const barW = (score / max) * chartW;
      ctx.setFillStyle(ROSE);
      ctx.setGlobalAlpha(0.85);
      ctx.fillRect(padLeft, y, barW, barH);
      ctx.setGlobalAlpha(1);
      ctx.setFillStyle('#0F4C5C');
      ctx.fillText((d.name || '').slice(0, 8), 4, y + barH / 2 + 3);
    });
    ctx.draw();
  }, 500);
}

/** LBT 恋爱脑柱状图：粉色 rgb(219,39,119)，maxValue=100 */
function drawLBTBar(page, canvasId, data, maxValue) {
  const sorted = (data || []).slice().sort((a, b) => (b.score || 0) - (a.score || 0));
  if (sorted.length === 0) return;
  const max = maxValue || 100;
  const PINK = 'rgb(219, 39, 119)';
  setTimeout(() => {
    const [w, h] = getCanvasSize(canvasId);
    const ctx = wx.createCanvasContext(canvasId, page);
    const padLeft = 90;
    const padRight = 32;
    const padTop = 24;
    const padBottom = 24;
    const chartW = w - padLeft - padRight;
    const chartH = h - padTop - padBottom;
    const rowH = chartH / sorted.length;
    const barH = Math.min(20, rowH * 0.6);
    const gap = (rowH - barH) / 2;
    ctx.setFillStyle('#0F4C5C');
    ctx.setFontSize(10);
    ctx.setTextAlign('left');
    sorted.forEach((d, i) => {
      const y = padTop + i * rowH + gap;
      const score = Math.min(max, Math.max(0, d.score || 0));
      const barW = (score / max) * chartW;
      ctx.setFillStyle(PINK);
      ctx.setGlobalAlpha(0.85);
      ctx.fillRect(padLeft, y, barW, barH);
      ctx.setGlobalAlpha(1);
      ctx.setFillStyle('#0F4C5C');
      ctx.fillText((d.name || '').slice(0, 10), 4, y + barH / 2 + 3);
    });
    ctx.draw();
  }, canvasId === 'lbt-bar' ? 600 : 500);
}

/** MPT 亲密关系柱状图：teal 色 #2C6F7A，maxValue=100 */
function drawMPTBar(page, canvasId, data, maxValue) {
  const sorted = (data || []).slice().sort((a, b) => (b.score || 0) - (a.score || 0));
  if (sorted.length === 0) return;
  const max = maxValue || 100;
  const TEAL = 'rgb(44, 111, 122)';
  setTimeout(() => {
    const [w, h] = getCanvasSize(canvasId);
    const ctx = wx.createCanvasContext(canvasId, page);
    const padLeft = 90;
    const padRight = 32;
    const padTop = 24;
    const padBottom = 24;
    const chartW = w - padLeft - padRight;
    const chartH = h - padTop - padBottom;
    const rowH = chartH / sorted.length;
    const barH = Math.min(22, rowH * 0.6);
    const gap = (rowH - barH) / 2;
    ctx.setFillStyle('#0F4C5C');
    ctx.setFontSize(10);
    ctx.setTextAlign('left');
    sorted.forEach((d, i) => {
      const y = padTop + i * rowH + gap;
      const score = Math.min(max, Math.max(0, d.score || 0));
      const barW = (score / max) * chartW;
      ctx.setFillStyle(TEAL);
      ctx.setGlobalAlpha(0.85);
      ctx.fillRect(padLeft, y, barW, barH);
      ctx.setGlobalAlpha(1);
      ctx.setFillStyle('#0F4C5C');
      ctx.fillText((d.name || '').slice(0, 8), 4, y + barH / 2 + 3);
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
    const ctx = wx.createCanvasContext(canvasId, page);
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

/** City 宜居城市柱状图：teal 色 #2C6F7A，5 维，maxValue=100 */
function drawCityBar(page, canvasId, data, maxValue) {
  const sorted = (data || []).slice().sort((a, b) => (b.score || 0) - (a.score || 0));
  if (sorted.length === 0) return;
  const max = maxValue || 100;
  const TEAL = 'rgb(44, 111, 122)';
  setTimeout(() => {
    const [w, h] = getCanvasSize(canvasId);
    const ctx = wx.createCanvasContext(canvasId, page);
    const padLeft = 90;
    const padRight = 32;
    const padTop = 24;
    const padBottom = 24;
    const chartW = w - padLeft - padRight;
    const chartH = h - padTop - padBottom;
    const rowH = chartH / sorted.length;
    const barH = Math.min(22, rowH * 0.6);
    const gap = (rowH - barH) / 2;
    ctx.setFillStyle('#0F4C5C');
    ctx.setFontSize(10);
    ctx.setTextAlign('left');
    sorted.forEach((d, i) => {
      const y = padTop + i * rowH + gap;
      const score = Math.min(max, Math.max(0, d.score || 0));
      const barW = (score / max) * chartW;
      ctx.setFillStyle(TEAL);
      ctx.setGlobalAlpha(0.85);
      ctx.fillRect(padLeft, y, barW, barH);
      ctx.setGlobalAlpha(1);
      ctx.setFillStyle('#0F4C5C');
      ctx.fillText((d.name || '').slice(0, 8), 4, y + barH / 2 + 3);
    });
    ctx.draw();
  }, 500);
}

/** VBT 易被欺负保护力柱状图：teal 色 #2C6F7A，仅 3 个保护力维度，maxValue=100 */
function drawVBTBar(page, canvasId, data, maxValue) {
  const sorted = (data || []).slice().sort((a, b) => (b.score || 0) - (a.score || 0));
  if (sorted.length === 0) return;
  const max = maxValue || 100;
  const TEAL = 'rgb(44, 111, 122)';
  setTimeout(() => {
    const [w, h] = getCanvasSize(canvasId);
    const ctx = wx.createCanvasContext(canvasId, page);
    const padLeft = 90;
    const padRight = 32;
    const padTop = 24;
    const padBottom = 24;
    const chartW = w - padLeft - padRight;
    const chartH = h - padTop - padBottom;
    const rowH = chartH / sorted.length;
    const barH = Math.min(22, rowH * 0.6);
    const gap = (rowH - barH) / 2;
    ctx.setFillStyle('#0F4C5C');
    ctx.setFontSize(10);
    ctx.setTextAlign('left');
    sorted.forEach((d, i) => {
      const y = padTop + i * rowH + gap;
      const score = Math.min(max, Math.max(0, d.score || 0));
      const barW = (score / max) * chartW;
      ctx.setFillStyle(TEAL);
      ctx.setGlobalAlpha(0.85);
      ctx.fillRect(padLeft, y, barW, barH);
      ctx.setGlobalAlpha(1);
      ctx.setFillStyle('#0F4C5C');
      ctx.fillText((d.name || '').slice(0, 8), 4, y + barH / 2 + 3);
    });
    ctx.draw();
  }, 500);
}

function drawHollandHexagon(page, canvasId, topThreeIds) {
  const ids = topThreeIds || [];
  setTimeout(() => {
    const sz = 280;
    const ctx = wx.createCanvasContext(canvasId, page);
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

module.exports = { drawRadar, drawBar, drawPie, drawRpiBar, drawSriBar, drawYBTBar, drawRVTBar, drawLBTBar, drawMPTBar, drawVBTBar, drawCityBar, drawFFTBar, drawHollandHexagon };
