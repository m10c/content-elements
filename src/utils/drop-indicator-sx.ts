import type { Theme } from '@mui/material';

import type { DropSide } from '../hooks/use-sortable-item';

const LINE_HEIGHT = 3;

/**
 * Draws the line marking where a dragged item will land, centred in the
 * `gap` (theme spacing units) between this item and its neighbour. Meant for
 * an `sx` array, which skips the `false` returned when there is no line.
 */
export default function dropIndicatorSx(side: DropSide | null, gap: number) {
  if (!side) return false;
  return {
    '&::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      height: LINE_HEIGHT,
      borderRadius: LINE_HEIGHT,
      bgcolor: 'primary.main',
      pointerEvents: 'none',
      [side === 'before' ? 'top' : 'bottom']: (theme: Theme) =>
        `calc(${theme.spacing(-gap / 2)} - ${LINE_HEIGHT / 2}px)`,
    },
  };
}
