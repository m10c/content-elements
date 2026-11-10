import { format, isFuture, parseISO } from 'date-fns';

import type { DimensionChip } from '../types';

export default function publishStatusChip(
  publishAt: string | null | undefined,
): DimensionChip {
  if (!publishAt) return { label: 'Draft', color: 'warning' };
  const publishDate = parseISO(publishAt);
  return {
    label: format(publishDate, 'dd MMM yyyy'),
    color: isFuture(publishDate) ? 'info' : 'success',
  };
}
