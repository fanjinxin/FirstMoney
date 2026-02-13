Component({
  properties: {
    currentPath: { type: String, value: '' },
  },
  data: {
    navItems: [
      { name: '首页', path: '/', testId: '' },
      { name: 'SCL-90', path: '/scl90', testId: 'scl90' },
      { name: 'RPI', path: '/rpi', testId: 'rpi' },
      { name: 'SRI', path: '/sri', testId: 'sri' },
      { name: '动物塑', path: '/animal', testId: 'animal' },
      { name: 'MBTI', path: '/mbti', testId: 'mbti' },
      { name: 'AAT', path: '/aat', testId: 'aat' },
      { name: '心理年龄', path: '/psych-age', testId: 'psych-age' },
      { name: 'APT', path: '/apt', testId: 'apt' },
      { name: '霍兰德', path: '/hit', testId: 'hit' },
      { name: 'DTH', path: '/dth', testId: 'dth' },
      { name: '年上年下', path: '/tla', testId: 'tla' },
      { name: '水果塑', path: '/fft', testId: 'fft' },
      { name: '病娇', path: '/ybt', testId: 'ybt' },
      { name: '恋爱观', path: '/rvt', testId: 'rvt' },
      { name: '恋爱脑', path: '/lbt', testId: 'lbt' },
      { name: 'MPT', path: '/mpt', testId: 'mpt' },
      { name: 'VBT', path: '/vbt', testId: 'vbt' },
      { name: '宜居城市', path: '/city', testId: 'city' },
    ],
  },
  methods: {
    onNavTap(e) {
      const item = e.currentTarget.dataset.item;
      if (!item) return;
      if (item.path === '/') {
        wx.redirectTo({ url: '/pages/index/index' });
      } else if (item.testId === 'scl90') {
        wx.navigateTo({ url: '/pages/scl90-test/scl90-test' });
      } else if (item.testId === 'rpi') {
        wx.navigateTo({ url: '/pages/rpi-test/rpi-test' });
      } else if (item.testId === 'animal') {
        wx.navigateTo({ url: '/pages/animal-test/animal-test' });
      } else {
        wx.navigateTo({
          url: `/pages/test/test?testId=${item.testId}`,
        });
      }
    },
  },
});
