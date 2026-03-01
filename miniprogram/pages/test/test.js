const { getTestConfig } = require('../../data/index');
const { TESTS } = require('../../data/tests');
const { saveAnswers, loadAnswers, clearAnswers } = require('../../utils/storage');
const { clearSampleFlag } = require('../../utils/testSample');
const { THEMES, getThemeStyle } = require('../../data/themes');

Page({
  onShareAppMessage() {
    const { testId } = this.data;
    const card = TESTS.find((t) => t.id === testId);
    const title = card ? `${card.title} - 心理测评中心` : (testId ? '测评 - 心理测评中心' : '心理测评中心');
    return { title, path: `/pages/test/test?testId=${testId || ''}` };
  },
  onShareTimeline() {
    const { testId } = this.data;
    const card = TESTS.find((t) => t.id === testId);
    return { title: card ? `${card.title} - 心理测评中心` : (testId ? '测评 - 心理测评中心' : '心理测评中心') };
  },
  data: {
    testId: '',
    themeStyle: '',
    config: null,
    questions: [],
    scaleOptions: null,
    answers: {},
    current: 0,
    total: 0,
    currentQ: null,
    answeredCount: 0,
    progress: 0,
    canSubmit: false
  },
  onShow() {
    wx.showShareMenu({ menus: ['shareAppMessage', 'shareTimeline'] });
  },
  onLoad(options) {
    wx.showShareMenu({ menus: ['shareAppMessage', 'shareTimeline'] });
    const testId = options.testId || '';
    let config = getTestConfig(testId);
    const cardMeta = TESTS.find(t => t.id === testId);
    if (config && cardMeta) {
      config = { ...config, iconType: cardMeta.iconType, iconBg: cardMeta.iconBg };
    }
    if (!config) {
      const saved = wx.getStorageSync('app-theme-id') || 'summer-mint';
      const theme = THEMES.find(t => t.id === saved) || THEMES.find(t => t.id === 'summer-mint');
      this.setData({ config: null, testId, themeStyle: getThemeStyle(theme) || '' });
      return;
    }
    const questions = config.format === 'mbti' ? config.questions : config.questions;
    let scaleOptions = null;
    if (config.format !== 'mbti' && config.format !== 'choice' && config.options && config.options.length === 5) {
      scaleOptions = [...config.options].sort((a, b) => (b.value - a.value));
    }
    const stored = loadAnswers(testId) || {};
    const answeredCount = questions.filter(q => stored[q.id] !== undefined).length;
    const total = questions.length;
    const progress = total > 0 ? (answeredCount / total) * 100 : 0;
    let current = questions.findIndex(q => stored[q.id] === undefined);
    if (current < 0) current = total - 1;
    const saved = wx.getStorageSync('app-theme-id') || 'summer-mint';
    const theme = THEMES.find(t => t.id === saved) || THEMES.find(t => t.id === 'summer-mint');
    this.setData({
      testId,
      config,
      themeStyle: getThemeStyle(theme) || '',
      questions,
      scaleOptions,
      answers: stored,
      current,
      total,
      currentQ: questions[current],
      answeredCount: Object.keys(stored).length,
      progress,
      canSubmit: Object.keys(stored).length === total
    });
  },
  onSelect(e) {
    const { testId } = this.data;
    clearSampleFlag(testId);
    let value = e.currentTarget.dataset.value;
    if (value !== undefined && value !== '') {
      const num = typeof value === 'number' ? value : parseInt(String(value), 10);
      if (!isNaN(num)) value = num;
    }
    const { currentQ, answers, questions, total } = this.data;
    const next = { ...answers, [currentQ.id]: value };
    saveAnswers(testId, next);
    const nextUnanswered = questions.findIndex((q, i) => i > this.data.current && next[q.id] === undefined);
    let nextIdx = nextUnanswered >= 0 ? nextUnanswered : this.data.current < total - 1 ? this.data.current + 1 : this.data.current;
    const firstGap = questions.findIndex(q => next[q.id] === undefined);
    if (firstGap >= 0) nextIdx = firstGap;
    const answeredCount = Object.keys(next).length;
    this.setData({
      answers: next,
      current: nextIdx,
      currentQ: questions[nextIdx],
      answeredCount,
      progress: (answeredCount / total) * 100,
      canSubmit: answeredCount === total
    });
  },
  goPrev() {
    const { current, questions } = this.data;
    if (current <= 0) return;
    const next = current - 1;
    this.setData({ current: next, currentQ: questions[next] });
  },
  goNext() {
    const { current, questions, total } = this.data;
    if (current >= total - 1) return;
    const next = current + 1;
    this.setData({ current: next, currentQ: questions[next] });
  },

  onOverviewTap(e) {
    const index = e.currentTarget.dataset.index;
    if (index == null) return;
    const { questions } = this.data;
    this.setData({ current: index, currentQ: questions[index] });
  },
  onRestart() {
    wx.showModal({
      title: '确认',
      content: '确定要重新开始吗？当前的作答进度将被清空。',
      success: (res) => {
        if (res.confirm) {
          clearAnswers(this.data.testId);
          this.onLoad({ testId: this.data.testId });
        }
      }
    });
  },
  onThemeChange(e) {
    const { themeStyle } = e.detail || {};
    this.setData({ themeStyle: themeStyle || '' });
  },
  onSubmit() {
    if (!this.data.canSubmit) return;
    wx.navigateTo({
      url: `/pages/result/result?testId=${this.data.testId}`
    });
  }
});
