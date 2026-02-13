/**
 * 测试阶段：为指定测评填充示例答案，便于直接跳转结果页查看报告
 * 严格移植自 src/utils/testSample.ts
 */
const { saveAnswers } = require('./storage');

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function fillSampleAnswers(testId) {
  if (testId === 'scl90') {
    const answers = {};
    for (let i = 1; i <= 90; i++) answers['s' + i] = randomBetween(1, 4);
    saveAnswers('scl90', answers);
    return;
  }

  if (testId === 'animal') {
    const answers = {};
    for (let i = 1; i <= 60; i++) answers[i] = randomBetween(0, 2);
    saveAnswers('animal-sculpture', answers);
    return;
  }

  if (testId === 'rpi') {
    const selfAnswers = {};
    const partnerAnswers = {};
    for (let i = 1; i <= 20; i++) {
      selfAnswers['self-' + i] = randomBetween(1, 5);
      partnerAnswers['partner-' + i] = randomBetween(1, 5);
    }
    saveAnswers('rpi-self', selfAnswers);
    saveAnswers('rpi-partner', partnerAnswers);
    return;
  }

  if (testId === 'sri') {
    const answers = {};
    for (let i = 1; i <= 48; i++) answers['sri-' + i] = randomBetween(1, 5);
    saveAnswers('sri', answers);
    return;
  }

  if (testId === 'mbti') {
    const answers = {};
    for (let i = 1; i <= 90; i++) answers['mbti-' + i] = randomBetween(0, 4);
    saveAnswers('mbti', answers);
    return;
  }

  if (testId === 'aat') {
    const answers = {};
    for (let i = 1; i <= 118; i++) answers[String(i)] = randomBetween(0, 2);
    saveAnswers('aat', answers);
    return;
  }

  if (testId === 'psych-age') {
    const answers = {};
    for (let i = 1; i <= 30; i++) answers[String(i)] = randomBetween(0, 2);
    saveAnswers('psych-age', answers);
    return;
  }

  if (testId === 'apt') {
    const answers = {};
    for (let i = 1; i <= 60; i++) answers[String(i)] = randomBetween(1, 5);
    saveAnswers('apt', answers);
    return;
  }

  if (testId === 'hit') {
    const answers = {};
    for (let i = 1; i <= 90; i++) answers[String(i)] = randomBetween(0, 1);
    saveAnswers('hit', answers);
    return;
  }

  if (testId === 'dth') {
    const answers = {};
    for (let i = 1; i <= 70; i++) answers[String(i)] = randomBetween(1, 5);
    saveAnswers('dth', answers);
    return;
  }

  if (testId === 'tla') {
    const answers = {};
    for (let i = 1; i <= 52; i++) answers[String(i)] = randomBetween(1, 5);
    saveAnswers('tla', answers);
    return;
  }

  if (testId === 'fft') {
    const answers = {};
    for (let i = 1; i <= 54; i++) answers[String(i)] = randomBetween(0, 2);
    saveAnswers('fft', answers);
    return;
  }

  if (testId === 'ybt') {
    const answers = {};
    for (let i = 1; i <= 40; i++) answers[String(i)] = randomBetween(1, 5);
    saveAnswers('ybt', answers);
    return;
  }

  if (testId === 'rvt') {
    const answers = {};
    for (let i = 1; i <= 36; i++) answers[String(i)] = randomBetween(1, 5);
    saveAnswers('rvt', answers);
    return;
  }

  if (testId === 'lbt') {
    const answers = {};
    for (let i = 1; i <= 20; i++) answers[String(i)] = randomBetween(1, 5);
    saveAnswers('lbt', answers);
    return;
  }

  if (testId === 'mpt') {
    const answers = {};
    for (let i = 1; i <= 68; i++) answers[String(i)] = randomBetween(1, 5);
    saveAnswers('mpt', answers);
    return;
  }

  if (testId === 'vbt') {
    const answers = {};
    for (let i = 1; i <= 40; i++) answers[String(i)] = randomBetween(1, 5);
    saveAnswers('vbt', answers);
    return;
  }

  if (testId === 'city') {
    const answers = {};
    for (let i = 1; i <= 45; i++) answers[String(i)] = randomBetween(1, 5);
    saveAnswers('city', answers);
    return;
  }
}

module.exports = { fillSampleAnswers };
