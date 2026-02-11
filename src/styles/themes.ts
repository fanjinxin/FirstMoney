export interface Theme {
  id: string;
  name: string;
  colors: {
    sky: string;    // Primary
    aqua: string;   // Secondary
    mint: string;   // Tertiary / Light
    cream: string;  // Background / Base
    haze: string;   // Light Accent
    deep: string;   // Text / Dark
    teal: string;   // Medium Accent
  };
}

// Helper to darken/lighten would be nice, but we'll hardcode for now to ensure quality
// "Summer High-end Color Schemes" from the image

export const themes: Theme[] = [
  {
    id: 'ocean-breeze',
    name: '清凉夏日', // Theme 1 (Blue)
    colors: {
      sky: '#008ed9',
      aqua: '#40c9e4',
      mint: '#abe2e2',
      cream: '#f7eedd',
      haze: '#e0f7fa',
      deep: '#004d73',
      teal: '#007bb5',
    },
  },
  {
    id: 'sunset-glow',
    name: '落日晚霞', // Theme 2 (Orange)
    colors: {
      sky: '#ed9354',
      aqua: '#ffbb70',
      mint: '#ffeca0',
      cream: '#fefbda',
      haze: '#fff8e1',
      deep: '#8d4d1e',
      teal: '#d67d3e',
    },
  },
  {
    id: 'summer-mint',
    name: '薄荷苏打', // Theme 3 (Current-ish)
    colors: {
      sky: '#7FBFE1', // Restored closer to original
      aqua: '#68D4DB',
      mint: '#98E6E2',
      cream: '#F8F4E1',
      haze: '#CFEFF0',
      deep: '#0F4C5C',
      teal: '#2C6F7A',
    },
  },
  {
    id: 'peach-blossom',
    name: '桃夭灼灼', // Theme 4 (Pink/Green)
    colors: {
      sky: '#ff8082',
      aqua: '#ffd097',
      mint: '#cdf9d6',
      cream: '#f6fdc2',
      haze: '#fff0f0',
      deep: '#8a2c2e',
      teal: '#d66e70',
    },
  },
  {
    id: 'spring-bud',
    name: '春日嫩芽', // Theme 5 (Green/Orange)
    colors: {
      sky: '#a5dd9c',
      aqua: '#c5ebaa',
      mint: '#f3c28e',
      cream: '#f6f193',
      haze: '#f1f8e9',
      deep: '#3d5a36',
      teal: '#7cb342',
    },
  },
  {
    id: 'vibrant-contrast',
    name: '活力撞色', // Theme 6 (Orange/Blue)
    colors: {
      sky: '#ff9943',
      aqua: '#3568c2', // Bold contrast
      mint: '#88a7fc',
      cream: '#ffde95',
      haze: '#fff3e0',
      deep: '#bf360c',
      teal: '#1565c0',
    },
  },
  {
    id: 'royal-dream',
    name: '梦幻蓝紫', // Theme 7 (Blue/Pink)
    colors: {
      sky: '#1e6dd0',
      aqua: '#a3e4db',
      mint: '#ffd1ea',
      cream: '#fff9f2',
      haze: '#e3f2fd',
      deep: '#0d47a1',
      teal: '#1976d2',
    },
  },
  {
    id: 'forest-light',
    name: '森之呼吸', // Theme 8 (Green/Lime)
    colors: {
      sky: '#4b8130',
      aqua: '#a1cf00',
      mint: '#e6eeca',
      cream: '#f8bb19', // Yellowish cream
      haze: '#f1f8e9',
      deep: '#1b5e20',
      teal: '#33691e',
    },
  },
  {
    id: 'sky-clear',
    name: '雨后晴空', // Theme 9 (Blue/Yellow)
    colors: {
      sky: '#029dd0',
      aqua: '#7ad1e8',
      mint: '#cdeff5',
      cream: '#f9e97f',
      haze: '#e1f5fe',
      deep: '#01579b',
      teal: '#0277bd',
    },
  },
];
