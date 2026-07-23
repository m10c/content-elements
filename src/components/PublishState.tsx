'use client';

import { Chip } from '@mui/material';
import { format, isBefore, parseISO } from 'date-fns';

type Props<T extends { publishAt: string | null }> = {
  item: T;
};

export default function PublishState<T extends { publishAt: string | null }>({
  item,
}: Props<T>) {
  const dateFormat = 'dd MMM yyyy, HH:mm';

  if (item.publishAt) {
    const publishDate = parseISO(item.publishAt);

    if (isBefore(new Date(), publishDate)) {
      return (
        <Chip
          label={format(parseISO(item.publishAt), dateFormat)}
          color="info"
        />
      );
    }

    return (
      <Chip
        label={format(parseISO(item.publishAt), dateFormat)}
        color="success"
      />
    );
  }

  return <Chip label="Draft" color="warning" />;
}
