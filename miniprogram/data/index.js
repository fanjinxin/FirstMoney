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
    case 'aat':
      return require('./aat.js').aatTest;
    case 'psych-age':
      return require('./psych_age.js').psychAgeTest;
    case 'apt':
      return require('./apt.js').aptTest;
    case 'hit':
      return require('./hit.js').hitTest;
    case 'dth':
      return require('./dth.js').dthTest;
    case 'tla':
      return require('./tla.js').tlaTest;
    case 'fft':
      return require('./fft.js').fftTest;
    case 'ybt':
      return require('./ybt.js').ybtTest;
    case 'rvt':
      return require('./rvt.js').rvtTest;
    case 'mpt':
      return require('./mpt.js').mptTest;
    case 'vbt':
      return require('./vbt.js').vbtTest;
    case 'city':
      return require('./city.js').cityTest;
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
