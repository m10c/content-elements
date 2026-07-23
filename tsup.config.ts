import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    hooks: 'src/hooks/index.ts',
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
  ],
});
