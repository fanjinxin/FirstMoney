const { TESTS } = require('../../data/tests');
const { fillSampleAnswers } = require('../../utils/testSample');
const { THEMES, getThemeStyle } = require('../../data/themes');

function processTests(tests) {
  return tests.map(t => {
    const total = t.questionCount || 0;
    const metaText = (total > 0 && t.duration)
      ? `${total}题 · ${t.duration}`
      : total > 0
        ? `${total}题`
        : t.duration || '';
    return {
      ...t,
      metaText: metaText || null,
      testId: t.id,
    };
  });
}

Page({
  data: {
    tests: [],
    themeStyle: '',
  },
  onLoad() {
    const saved = wx.getStorageSync('app-theme-id') || 'summer-mint';
    const theme = THEMES.find(t => t.id === saved) || THEMES.find(t => t.id === 'summer-mint');
    this.setData({
      tests: processTests(TESTS),
      themeStyle: getThemeStyle(theme) || '',
    });
  },
  onThemeChange(e) {
    const { themeStyle } = e.detail || {};
    this.setData({ themeStyle: themeStyle || '' });
  },
  onTestTap(e) {
    const id = e.currentTarget.dataset.id;
    if (!id) return;
    if (id === 'scl90') {
      wx.navigateTo({ url: '/pages/scl90-test/scl90-test' });
    } else if (id === 'rpi') {
      wx.navigateTo({ url: '/pages/rpi-test/rpi-test' });
    } else if (id === 'animal') {
      wx.navigateTo({ url: '/pages/animal-test/animal-test' });
    } else {
      wx.navigateTo({
        url: `/pages/test/test?testId=${id}`
      });
    }
  },
  onTestJump(e) {
    const id = e.currentTarget.dataset.id;
    if (!id) return;
    fillSampleAnswers(id);
    if (id === 'scl90') {
      wx.navigateTo({ url: '/pages/result/result?testId=scl90' });
    } else if (id === 'rpi') {
      wx.navigateTo({ url: '/pages/result/result?testId=rpi' });
    } else {
      wx.navigateTo({
        url: `/pages/result/result?testId=${id}`
      });
    }
  }
});
