/**
 * 根据 testId 获取测评配置
 */
function getTestConfig(testId) {
  switch (testId) {
    case 'scl90':
      return require('./scl90.js').scl90Test;
    case 'lbt':
      return require('./lbt.js').lbtTest;
    case 'mbti':
      return require('./mbti.js').mbtiTest;
    case 'rpi':
      return require('./rpi.js').rpiTest;
    case 'sri':
      return require('./sri.js').sriTest;
    default:
      return null;
  }
}

module.exports = {
  getTestConfig
};
