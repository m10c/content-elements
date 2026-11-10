import type { PreviewDevice } from '../types';

const PREVIEW_DEVICE_WIDTHS: Record<PreviewDevice, number> = {
  desktop: 1280,
  tablet: 768,
  mobile: 375,
};

export default PREVIEW_DEVICE_WIDTHS;
