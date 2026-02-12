const { getTestConfig } = require('../../data/index');
const { saveAnswers, loadAnswers, clearAnswers } = require('../../utils/storage');
const { THEMES, getThemeStyle } = require('../../data/themes');

Page({
  data: {
    testId: '',
    themeStyle: '',
    config: null,
    questions: [],
    answers: {},
    current: 0,
    total: 0,
    currentQ: null,
    answeredCount: 0,
    progress: 0,
    canSubmit: false
  },
  onLoad(options) {
    const testId = options.testId || '';
    const config = getTestConfig(testId);
    if (!config) {
      const saved = wx.getStorageSync('app-theme-id') || 'summer-mint';
      const theme = THEMES.find(t => t.id === saved) || THEMES.find(t => t.id === 'summer-mint');
      this.setData({ config: null, testId, themeStyle: getThemeStyle(theme) || '' });
      return;
    }
    const questions = config.format === 'mbti' ? config.questions : config.questions;
    const stored = loadAnswers(testId) || {};
    const answeredCount = questions.filter(q => stored[q.id] !== undefined).length;
    const total = questions.length;
    const progress = total > 0 ? (answeredCount / total) * 100 : 0;
    const current = Math.min(answeredCount > 0 ? questions.findIndex(q => stored[q.id] === undefined) : 0, total - 1);
    if (current < 0) this.setData({ current: total - 1 });
    const saved = wx.getStorageSync('app-theme-id') || 'summer-mint';
    const theme = THEMES.find(t => t.id === saved) || THEMES.find(t => t.id === 'summer-mint');
    this.setData({
      testId,
      config,
      themeStyle: getThemeStyle(theme) || '',
      questions,
      answers: stored,
      current: current < 0 ? total - 1 : current,
      total,
      currentQ: questions[current < 0 ? total - 1 : current],
      answeredCount: Object.keys(stored).length,
      progress,
      canSubmit: Object.keys(stored).length === total
    });
  },
  onSelect(e) {
    const value = e.currentTarget.dataset.value;
    const { currentQ, answers, questions, total, testId } = this.data;
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
