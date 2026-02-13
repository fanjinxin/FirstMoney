/**
 * SCL-90 选择页面 - 逐行移植自 src/pages/scl90/SCL90Test.tsx
 */
const { scl90Test } = require('../../data/scl90');
const { TESTS } = require('../../data/tests');
const { loadAnswers, saveAnswers, clearAnswers } = require('../../utils/storage');
const { clearSampleFlag } = require('../../utils/testSample');
const { THEMES, getThemeStyle } = require('../../data/themes');

Page({
  data: {
    test: null,
    questions: [],
    answers: {},
    current: 0,
    total: 0,
    currentQ: null,
    answeredCount: 0,
    progress: 0,
    canSubmit: false,
    themeStyle: '',
  },

  onLoad() {
    const stored = loadAnswers(scl90Test.id) ?? {};
    const questions = scl90Test.questions;
    const total = questions.length;
    const answeredCount = questions.filter((q) => stored[q.id] !== undefined).length;
    const progress = total > 0 ? (answeredCount / total) * 100 : 0;

    // 首次未答：current=0；有未答则跳转到第一个未答
    let current = 0;
    const firstUnanswered = questions.findIndex((q) => stored[q.id] === undefined);
    if (firstUnanswered >= 0) {
      current = firstUnanswered;
    } else {
      current = total - 1;
    }

    const saved = wx.getStorageSync('app-theme-id') || 'summer-mint';
    const theme = THEMES.find((t) => t.id === saved) || THEMES[2];
    const cardMeta = TESTS.find((t) => t.id === 'scl90');
    const testWithIcon = cardMeta ? { ...scl90Test, iconType: cardMeta.iconType, iconBg: cardMeta.iconBg } : scl90Test;
    const scaleOptions = [...scl90Test.options].sort((a, b) => b.value - a.value);

    this.setData({
      test: testWithIcon,
      scaleOptions,
      questions,
      answers: stored,
      current,
      total,
      currentQ: questions[current],
      answeredCount: Object.keys(stored).length,
      progress,
      canSubmit: Object.keys(stored).length === total,
      themeStyle: getThemeStyle(theme) || '',
    });
  },

  onSelect(e) {
    clearSampleFlag('scl90');
    const value = e.currentTarget.dataset.value;
    const { currentQ, answers, questions, total } = this.data;
    const next = { ...answers, [currentQ.id]: Number(value) };
    saveAnswers(scl90Test.id, next);

    // 与 Web 一致：找下一未答，否则找第一个未答，否则当前+1
    let nextIdx = questions.findIndex((q, i) => i > this.data.current && next[q.id] === undefined);
    if (nextIdx !== -1) {
      // 找到后续未答
    } else {
      const firstUnanswered = questions.findIndex((q) => next[q.id] === undefined);
      if (firstUnanswered !== -1) {
        nextIdx = firstUnanswered;
      } else if (this.data.current < total - 1) {
        nextIdx = this.data.current + 1;
      } else {
        nextIdx = this.data.current;
      }
    }

    const answeredCount = Object.keys(next).length;
    const progress = total > 0 ? (answeredCount / total) * 100 : 0;

    this.setData({
      answers: next,
      current: nextIdx,
      currentQ: questions[nextIdx],
      answeredCount,
      progress,
      canSubmit: answeredCount === total,
    });
  },

  onRestart() {
    wx.showModal({
      title: '确认',
      content: '确定要重新开始吗？当前的作答进度将被清空。',
      success: (res) => {
        if (res.confirm) {
          clearAnswers(scl90Test.id);
          this.onLoad();
        }
      },
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

  onThemeChange(e) {
    const { themeStyle } = e.detail || {};
    this.setData({ themeStyle: themeStyle || '' });
  },

  onSubmit() {
    if (!this.data.canSubmit) return;
    wx.navigateTo({
      url: '/pages/result/result?testId=scl90',
    });
  },
});
