import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    hooks: 'src/website.ts',
  },
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: [
    'react',
    'react-dom',
    'react-typed-form',
    'date-fns',
    '@mui/material',
    '@mui/icons-material',
    '@m10c/mui-kit',
    'api-read-hook',
  ],
});
