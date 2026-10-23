'use client';

import { Box, Card, type CardProps, Stack, Typography } from '@mui/material';
import type React from 'react';

type Props = Omit<CardProps, 'title'> & {
  gutter?: React.ReactNode;
  title?: React.ReactNode;
  action?: React.ReactNode;
  children?: React.ReactNode;
};

export default function BlockCardFrame({
  gutter,
  title,
  action,
  children,
  sx,
  ...cardProps
}: Props) {
  return (
    <Card
      {...cardProps}
      sx={[
        { display: 'flex', gap: 1, pt: 2, pb: 3, pl: gutter ? 0 : 3 },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {gutter && (
        <Box sx={{ display: 'flex', p: 1, color: 'text.secondary' }}>
          {gutter}
        </Box>
      )}
      <Stack spacing={2} sx={{ flex: 1, minWidth: 0, pr: 2 }}>
        {(title || action) && (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={1}
            sx={{ minHeight: 40 }}
          >
            <Typography variant="h6">{title}</Typography>
            {action}
          </Stack>
        )}
        {children}
      </Stack>
    </Card>
  );
}
