/**
 * RPI 答题页 - 移植自 src/pages/rpi/RPITest.tsx
 * 双视角：自我 / 伴侣，各自 20 题，存储为 rpi-self / rpi-partner
 */
const { rpiTest } = require('../../data/rpi');
const { loadAnswers, saveAnswers, clearAnswers } = require('../../utils/storage');
const { clearSampleFlag } = require('../../utils/testSample');
const { THEMES, getThemeStyle } = require('../../data/themes');

const STORAGE_KEYS = { self: 'rpi-self', partner: 'rpi-partner' };

Page({
  data: {
    test: null,
    perspective: 'self',
    questions: [],
    answers: {},
    current: 0,
    total: 20,
    currentQ: null,
    answeredCount: 0,
    selfAnswered: 0,
    partnerAnswered: 0,
    progress: 0,
    canSubmit: false,
    themeStyle: '',
  },

  onLoad() {
    this.refreshByPerspective('self');
    const saved = wx.getStorageSync('app-theme-id') || 'summer-mint';
    const theme = THEMES.find(t => t.id === saved) || THEMES[2];
    const scaleOptions = [...rpiTest.options].sort((a, b) => b.value - a.value);
    this.setData({ test: rpiTest, scaleOptions, themeStyle: getThemeStyle(theme) || '' });
  },

  refreshByPerspective(perspective) {
    const storageKey = STORAGE_KEYS[perspective];
    const stored = loadAnswers(storageKey) || {};
    const questions = rpiTest.questions.filter(q => q.id.startsWith(`${perspective}-`));
    const total = 20;
    const answeredCount = questions.filter(q => stored[q.id] !== undefined).length;

    const selfStored = loadAnswers('rpi-self') || {};
    const partnerStored = loadAnswers('rpi-partner') || {};
    const selfAnswered = rpiTest.questions.filter(q => q.id.startsWith('self-') && selfStored[q.id] !== undefined).length;
    const partnerAnswered = rpiTest.questions.filter(q => q.id.startsWith('partner-') && partnerStored[q.id] !== undefined).length;

    let current = 0;
    const firstUnanswered = questions.findIndex(q => stored[q.id] === undefined);
    if (firstUnanswered >= 0) current = firstUnanswered;
    else current = total - 1;

    const canSubmit = selfAnswered >= 20 || partnerAnswered >= 20;
    const progress = total > 0 ? (answeredCount / total) * 100 : 0;

    this.setData({
      perspective,
      questions,
      answers: stored,
      current,
      total,
      currentQ: questions[current],
      answeredCount,
      selfAnswered,
      partnerAnswered,
      progress,
      canSubmit,
    });
  },

  onRestart() {
    wx.showModal({
      title: '确认',
      content: '确定要重新开始吗？自我视角和伴侣视角的作答进度都将被清空。',
      success: (res) => {
        if (res.confirm) {
          clearAnswers('rpi-self');
          clearAnswers('rpi-partner');
          this.refreshByPerspective('self');
        }
      },
    });
  },
  onSwitchPerspective(e) {
    const p = e.currentTarget.dataset.perspective;
    if (p === this.data.perspective) return;
    this.refreshByPerspective(p);
  },

  onSelect(e) {
    clearSampleFlag('rpi');
    const value = e.currentTarget.dataset.value;
    const { currentQ, answers, perspective } = this.data;
    const storageKey = STORAGE_KEYS[perspective];
    const next = { ...answers, [currentQ.id]: Number(value) };
    saveAnswers(storageKey, next);

    this.refreshByPerspective(perspective);
  },

  goPrev() {
    const { current, questions } = this.data;
    if (current <= 0) return;
    this.setData({ current: current - 1, currentQ: questions[current - 1] });
  },

  goNext() {
    const { current, questions, total } = this.data;
    if (current >= total - 1) return;
    this.setData({ current: current + 1, currentQ: questions[current + 1] });
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
    wx.navigateTo({ url: '/pages/result/result?testId=rpi' });
  },
});
