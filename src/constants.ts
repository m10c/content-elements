import type { PreviewDevice } from './types';

export const PREVIEW_MESSAGE = {
  content: 'm10c-cms-preview',
  ready: 'm10c-cms-preview-ready',
  tokenRequest: 'm10c-cms-preview-token-request',
  auth: 'm10c-cms-preview-auth',
} as const;

export const PREVIEW_DEVICE_WIDTHS: Record<PreviewDevice, number> = {
  desktop: 1280,
  tablet: 768,
  mobile: 375,
};
