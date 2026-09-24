'use client';

import { Box, Stack, Typography } from '@mui/material';
import React from 'react';

import PreviewPanel from './PreviewPanel';
import PreviewToggleButton from './PreviewToggleButton';

type Props = {
  title: string;
  description?: string;
  action?: React.ReactNode;
  dimensionSelect?: React.ReactNode;
  toolbar?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  preview?: React.ReactNode;
  previewWidth?: number;
};

export default function VariantCardEditor({
  title,
  description,
  action,
  dimensionSelect,
  toolbar,
  children,
  footer,
  preview,
  previewWidth = 380,
}: Props) {
  const [isPreviewVisible, setIsPreviewVisible] = React.useState(true);

  return (
    <Stack direction="row" spacing={3} alignItems="flex-start">
      <Stack spacing={3} sx={{ flex: 1, minWidth: 0 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          spacing={2}
        >
          <Box>
            <Typography variant="h5">{title}</Typography>
            {description && (
              <Typography variant="body2" color="text.secondary">
                {description}
              </Typography>
            )}
          </Box>
          <Stack direction="row" spacing={1} alignItems="center">
            {preview && !isPreviewVisible && (
              <PreviewToggleButton
                isPreviewVisible={false}
                onClick={() => setIsPreviewVisible(true)}
              />
            )}
            {action}
          </Stack>
        </Stack>
        {dimensionSelect}
        {toolbar}
        {children}
        {footer}
      </Stack>
      {preview && isPreviewVisible && (
        <PreviewPanel
          onHide={() => setIsPreviewVisible(false)}
          sx={{ width: previewWidth, flexShrink: 0, position: 'sticky', top: 16 }}
        >
          {preview}
        </PreviewPanel>
      )}
    </Stack>
  );
}
