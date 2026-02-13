/**
 * 人格动物塑测试页 - 移植自 src/pages/animal/AnimalTest.tsx
 */
const { animalQuestions } = require('../../data/animal_sculpture');
const { loadAnswers, saveAnswers, clearAnswers } = require('../../utils/storage');
const { THEMES, getThemeStyle } = require('../../data/themes');

const ANIMAL_STORAGE_KEY = 'animal-sculpture';
const TEST_INFO = {
  title: '人格动物塑测试',
  subtitle: '测测你的精神动物',
  description: '本测试基于FFM五因素模型（大五人格），通过60道生活场景题目，深度解析你的性格特质，并匹配最契合的动物原型。',
  instructions: [
    '本测试共有60道题目，请耐心完成。',
    '请根据您的真实情况和第一直觉作答。',
    '答案无对错之分，越真实的结果越有参考价值。',
    '中途退出会自动保存进度。',
  ],
};

Page({
  data: {
    testInfo: TEST_INFO,
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
    const stored = loadAnswers(ANIMAL_STORAGE_KEY) ?? {};
    const questions = animalQuestions;
    const total = questions.length;
    const answeredCount = Object.keys(stored).length;
    const progress = total > 0 ? (answeredCount / total) * 100 : 0;

    let current = 0;
    const firstUnanswered = questions.findIndex((q) => stored[q.id] === undefined);
    if (firstUnanswered >= 0) {
      current = firstUnanswered;
    } else {
      current = total - 1;
    }

    const saved = wx.getStorageSync('app-theme-id') || 'summer-mint';
    const theme = THEMES.find((t) => t.id === saved) || THEMES[0];

    this.setData({
      questions,
      answers: stored,
      current,
      total,
      currentQ: questions[current],
      answeredCount,
      progress,
      canSubmit: answeredCount === total,
      themeStyle: getThemeStyle(theme) || '',
    });
  },

  onSelect(e) {
    const value = e.currentTarget.dataset.value;
    const { currentQ, answers, questions, total } = this.data;
    const next = { ...answers, [currentQ.id]: Number(value) };
    saveAnswers(ANIMAL_STORAGE_KEY, next);

    let nextIdx = questions.findIndex((q, i) => i > this.data.current && next[q.id] === undefined);
    if (nextIdx === -1) {
      const firstUnanswered = questions.findIndex((q) => next[q.id] === undefined);
      nextIdx = firstUnanswered >= 0 ? firstUnanswered : (this.data.current < total - 1 ? this.data.current + 1 : this.data.current);
    }

    const answeredCount = Object.keys(next).length;
    this.setData({
      answers: next,
      current: nextIdx,
      currentQ: questions[nextIdx],
      answeredCount,
      progress: (answeredCount / total) * 100,
      canSubmit: answeredCount === total,
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
          clearAnswers(ANIMAL_STORAGE_KEY);
          this.onLoad();
        }
      },
    });
  },

  onThemeChange(e) {
    const { themeStyle } = e.detail || {};
    this.setData({ themeStyle: themeStyle || '' });
  },

  onSubmit() {
    if (!this.data.canSubmit) return;
    wx.navigateTo({
      url: '/pages/result/result?testId=animal',
    });
  },
});
