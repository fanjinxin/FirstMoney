const { THEMES, getThemeStyle } = require('../../data/themes');

Component({
  data: {
    isOpen: false,
    currentThemeId: 'summer-mint',
    themes: THEMES,
  },
  lifetimes: {
    attached() {
      const saved = wx.getStorageSync('app-theme-id') || 'summer-mint';
      const theme = THEMES.find(t => t.id === saved) || THEMES.find(t => t.id === 'summer-mint');
      if (theme) {
        this.setData({ currentThemeId: theme.id });
        this.triggerThemeChange(theme);
      }
    },
  },
  methods: {
    onToggle() {
      this.setData({ isOpen: !this.data.isOpen });
    },
    onSelectTheme(e) {
      const id = e.currentTarget.dataset.id;
      const theme = THEMES.find(t => t.id === id);
      if (!theme) return;
      wx.setStorageSync('app-theme-id', theme.id);
      this.setData({ currentThemeId: theme.id, isOpen: false });
      this.triggerThemeChange(theme);
    },
    triggerThemeChange(theme) {
      this.triggerEvent('themechange', { theme, themeStyle: getThemeStyle(theme) });
    },
  },
});
