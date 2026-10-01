'use client';

import { Box, Stack } from '@mui/material';
import React from 'react';

import PreviewToggleButton from './PreviewToggleButton';

type Props = {
  children: React.ReactNode;
  preview: React.ReactNode;
  previewToolbar?: React.ReactNode;
  previewWidth?: number;
};

export default function PreviewLayout({
  children,
  preview,
  previewToolbar,
  previewWidth,
}: Props) {
  const [isPreviewVisible, setIsPreviewVisible] = React.useState(true);

  return (
    <Stack direction="row" sx={{ flex: 1, height: '100%', minHeight: 0 }}>
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          overflow: 'auto',
          position: 'relative',
          bgcolor: 'background.level1',
        }}
      >
        {!isPreviewVisible && (
          <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 1 }}>
            <PreviewToggleButton
              isPreviewVisible={false}
              onClick={() => setIsPreviewVisible(true)}
            />
          </Box>
        )}
        {children}
      </Box>
      {isPreviewVisible && (
        <Stack
          sx={{
            ...(previewWidth
              ? { width: previewWidth, flexShrink: 0 }
              : { flex: 1, minWidth: 0 }),
            bgcolor: 'grey.200',
          }}
        >
          <Stack direction="row" spacing={1} sx={{ p: 1.5, flexShrink: 0 }}>
            <PreviewToggleButton
              isPreviewVisible
              onClick={() => setIsPreviewVisible(false)}
            />
            {previewToolbar}
          </Stack>
          {preview}
        </Stack>
      )}
    </Stack>
  );
}
