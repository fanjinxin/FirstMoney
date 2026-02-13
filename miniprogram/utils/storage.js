const prefix = 'psych-tests';

function saveAnswers(testId, answers) {
  try {
    wx.setStorageSync(`${prefix}:${testId}:answers`, JSON.stringify(answers));
  } catch (e) {
    console.error('saveAnswers error', e);
  }
}

function loadAnswers(testId) {
  try {
    const raw = wx.getStorageSync(`${prefix}:${testId}:answers`);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function clearAnswers(testId) {
  try {
    wx.removeStorageSync(`${prefix}:${testId}:answers`);
  } catch (e) {
    console.error('clearAnswers error', e);
  }
}

module.exports = {
  saveAnswers,
  loadAnswers,
  clearAnswers
};
