const { TESTS } = require('../../data/tests');
const { fillSampleAnswers, isSampleData, clearSampleFlag } = require('../../utils/testSample');
const { clearAnswers } = require('../../utils/storage');
const { THEMES, getThemeStyle } = require('../../data/themes');

let _shareTargetId = '';

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
    currentPath: '/',
    disclaimerTapCount: 0,
    showBackdoorBtn: false,
  },
  onShareBtnTap(e) {
    _shareTargetId = e.currentTarget.dataset.id || '';
  },
  onShareAppMessage() {
    const id = _shareTargetId || '';
    _shareTargetId = '';
    if (id) {
      const card = TESTS.find((t) => t.id === id);
      const title = card ? `${card.title} - 心理测评中心` : '心理测评中心';
      let path = '/pages/index/index';
      if (id === 'scl90') path = '/pages/scl90-test/scl90-test';
      else if (id === 'rpi') path = '/pages/rpi-test/rpi-test';
      else if (id === 'animal') path = '/pages/animal-test/animal-test';
      else path = `/pages/test/test?testId=${id}`;
      return { title, path };
    }
    return { title: '心理测评中心 - 更酷的测评体验，快速获得多维度洞察', path: '/pages/index/index' };
  },
  onShareTimeline() {
    const id = _shareTargetId || '';
    if (id) {
      const card = TESTS.find((t) => t.id === id);
      return { title: card ? `${card.title} - 心理测评中心` : '心理测评中心' };
    }
    return { title: '心理测评中心 - 更酷的测评体验，快速获得多维度洞察' };
  },
  onLoad() {
    wx.showShareMenu({ menus: ['shareAppMessage', 'shareTimeline'] });
    const saved = wx.getStorageSync('app-theme-id') || 'summer-mint';
    const theme = THEMES.find(t => t.id === saved) || THEMES.find(t => t.id === 'summer-mint');
    this.setData({
      tests: processTests(TESTS),
      themeStyle: getThemeStyle(theme) || '',
    });
  },
  onShow() {
    wx.showShareMenu({ menus: ['shareAppMessage', 'shareTimeline'] });
  },
  onNavTabChange(e) {
    const { path } = e.detail || {};
    this.setData({ currentPath: path });
    if (path === '/') {
      wx.pageScrollTo({ scrollTop: 0, duration: 300 });
      return;
    }
    const testId = path.replace('/', '');
    const query = wx.createSelectorQuery();
    query.selectViewport().scrollOffset();
    query.select(`#section-${testId}`).boundingClientRect();
    query.exec((res) => {
      if (!res || !res[0] || !res[1]) return;
      const scrollTop = res[0].scrollTop + res[1].top;
      wx.pageScrollTo({ scrollTop, duration: 300 });
    });
  },
  onThemeChange(e) {
    const { themeStyle } = e.detail || {};
    this.setData({ themeStyle: themeStyle || '' });
  },
  onTestTap(e) {
    const id = e.currentTarget.dataset.id;
    if (!id) return;
    if (isSampleData(id)) {
      clearSampleFlag(id);
      if (id === 'scl90') {
        clearAnswers('scl90');
      } else if (id === 'rpi') {
        clearAnswers('rpi-self');
        clearAnswers('rpi-partner');
      } else if (id === 'animal') {
        clearAnswers('animal-sculpture');
      } else {
        clearAnswers(id);
      }
    }
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
  onDisclaimerTap() {
    const count = (this.data.disclaimerTapCount || 0) + 1;
    this.setData({
      disclaimerTapCount: count,
      showBackdoorBtn: count >= 20,
    });
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
