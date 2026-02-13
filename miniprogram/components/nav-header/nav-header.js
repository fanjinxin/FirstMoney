Component({
  properties: {
    currentPath: { type: String, value: '' },
    sticky: { type: Boolean, value: false },
    /** 首页模式：点击 tab 时触发 tabchange 并滚动到对应卡片，不跳转 */
    indexMode: { type: Boolean, value: false },
  },
  data: {
    navItems: [
      { name: '首页', path: '/', testId: '' },
      { name: 'MBTI', path: '/mbti', testId: 'mbti' },
      { name: '水果塑', path: '/fft', testId: 'fft' },
      { name: '动物塑', path: '/animal', testId: 'animal' },
      { name: '恋爱观', path: '/rvt', testId: 'rvt' },
      { name: '宜居城市', path: '/city', testId: 'city' },
      { name: 'SCL-90', path: '/scl90', testId: 'scl90' },
      { name: 'RPI', path: '/rpi', testId: 'rpi' },
      { name: 'SRI', path: '/sri', testId: 'sri' },
      { name: 'AAT', path: '/aat', testId: 'aat' },
      { name: '心理年龄', path: '/psych-age', testId: 'psych-age' },
      { name: 'APT', path: '/apt', testId: 'apt' },
      { name: '霍兰德', path: '/hit', testId: 'hit' },
      { name: 'DTH', path: '/dth', testId: 'dth' },
      { name: '年上年下', path: '/tla', testId: 'tla' },
      { name: '病娇', path: '/ybt', testId: 'ybt' },
      { name: '恋爱脑', path: '/lbt', testId: 'lbt' },
      { name: 'MPT', path: '/mpt', testId: 'mpt' },
      { name: 'VBT', path: '/vbt', testId: 'vbt' },
    ],
  },
  methods: {
    onNavTap(e) {
      const item = e.currentTarget.dataset.item;
      if (!item) return;
      if (this.properties.indexMode) {
        this.triggerEvent('tabchange', { path: item.path, testId: item.testId });
        return;
      }
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
