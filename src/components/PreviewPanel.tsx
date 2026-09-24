'use client';

import { Stack, type SxProps, type Theme } from '@mui/material';
import type React from 'react';

import PreviewToggleButton from './PreviewToggleButton';

type Props = {
  onHide: () => void;
  toolbar?: React.ReactNode;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
};

export default function PreviewPanel({ onHide, toolbar, children, sx }: Props) {
  return (
    <Stack sx={sx}>
      <Stack direction="row" spacing={1} sx={{ p: 1.5, flexShrink: 0 }}>
        <PreviewToggleButton isPreviewVisible onClick={onHide} />
        {toolbar}
      </Stack>
      {children}
    </Stack>
  );
}
