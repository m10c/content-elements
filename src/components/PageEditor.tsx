'use client';

import {
  Devices,
  KeyboardArrowDown,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Select,
  Stack,
} from '@mui/material';
import React from 'react';
import { FieldProp } from 'react-typed-form';

import usePreviewSender from '../hooks/use-preview-sender';
import BlocksField, { type ListCardIcons } from './BlocksField';
import type {
  Block,
  BlockFieldPreviews,
  BlockFieldRenderers,
  BlockTypeInput,
} from '../types';

type PreviewWidth = 'desktop' | 'tablet' | 'mobile';

const DEVICE_LABELS: Record<PreviewWidth, string> = {
  desktop: 'Desktop',
  tablet: 'Tablet',
  mobile: 'Mobile',
};

const PREVIEW_WIDTHS = {
  desktop: 1280,
  tablet: 768,
  mobile: 375,
} as const;

// Global pages (footer, navigation, …) have no route, so preview them on home.
const GLOBAL_PREVIEW_PATH = 'home';

type Props = {
  blockTypes: readonly BlockTypeInput[];
  field: FieldProp<Block[]>;
  renderers?: BlockFieldRenderers;
  previews?: BlockFieldPreviews;
  icons?: ListCardIcons;
  /** Names for the preview's device sizes, e.g. 'Mobile website'. */
  deviceLabels?: Partial<Record<PreviewWidth, string>>;
  /** Site origin for the preview iframe and postMessage target. */
  previewUrl: string;
  pagePath: string;
  previewContent: Record<string, unknown>;
  /** CMS paths that are global pages (footer, navigation, …). */
  globalPagePaths?: readonly string[];
  isSaving?: boolean;
  onPublish: () => void;
};

export default function PageEditor({
  blockTypes,
  field,
  renderers,
  previews,
  icons,
  deviceLabels,
  previewUrl,
  pagePath,
  previewContent,
  globalPagePaths = [],
  isSaving,
  onPublish,
}: Props) {
  const [showPreview, setShowPreview] = React.useState(true);
  const [previewWidth, setPreviewWidth] =
    React.useState<PreviewWidth>('desktop');

  const isGlobal = globalPagePaths.includes(pagePath);
  const routePath = isGlobal ? GLOBAL_PREVIEW_PATH : pagePath;

  const { iframeRef } = usePreviewSender({
    previewUrl,
    pagePath,
    content: previewContent,
    globals: isGlobal ? { [pagePath]: previewContent } : undefined,
  });

  const previewSrc = `${previewUrl}/${
    routePath === 'home' ? '' : routePath
  }?preview`;

  return (
    <Box
      sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}
    >
      <Stack direction="row" sx={{ flex: 1, overflow: 'hidden' }}>
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            overflow: 'auto',
            p: 3,
            pb: 10,
            bgcolor: 'background.level1',
          }}
        >
          {!showPreview && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<Visibility />}
              onClick={() => setShowPreview(true)}
              sx={{ mb: 2 }}
            >
              Show Preview
            </Button>
          )}
          <BlocksField
            blockTypes={blockTypes}
            field={field}
            renderers={renderers}
            previews={previews}
            icons={icons}
          />
        </Box>

        {showPreview && (
          <Stack sx={{ flex: 1, minWidth: 0, bgcolor: 'grey.200' }}>
            <Stack direction="row" spacing={1} sx={{ p: 1.5, flexShrink: 0 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<VisibilityOff />}
                onClick={() => setShowPreview(false)}
                sx={{ whiteSpace: 'nowrap', bgcolor: 'background.paper' }}
              >
                Hide Preview
              </Button>
              <FormControl size="small">
                <Select
                  value={previewWidth}
                  onChange={(event) =>
                    setPreviewWidth(event.target.value as PreviewWidth)
                  }
                  startAdornment={
                    <Devices
                      sx={{ fontSize: 18, color: 'text.secondary', mr: 1 }}
                    />
                  }
                  IconComponent={KeyboardArrowDown}
                  sx={{ bgcolor: 'background.paper' }}
                >
                  {(Object.keys(DEVICE_LABELS) as PreviewWidth[]).map(
                    (device) => (
                      <MenuItem key={device} value={device}>
                        {deviceLabels?.[device] ?? DEVICE_LABELS[device]}
                      </MenuItem>
                    ),
                  )}
                </Select>
              </FormControl>
            </Stack>
            <PreviewIframe
              iframeRef={iframeRef as React.RefObject<HTMLIFrameElement>}
              src={previewSrc}
              renderWidth={PREVIEW_WIDTHS[previewWidth]}
            />
          </Stack>
        )}
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        sx={{
          px: 2,
          py: 1.5,
          flexShrink: 0,
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Button variant="contained" onClick={onPublish} disabled={isSaving}>
          Publish Changes
        </Button>
      </Stack>
    </Box>
  );
}

function PreviewIframe({
  iframeRef,
  src,
  renderWidth,
}: {
  iframeRef: React.RefObject<HTMLIFrameElement>;
  src: string;
  renderWidth: number;
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = React.useState(0);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      setContainerWidth(entry.contentRect.width);
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  if (!src) return null;

  const scale =
    containerWidth > 0 ? Math.min(1, containerWidth / renderWidth) : 0.5;

  return (
    <Box ref={containerRef} sx={{ flex: 1, overflow: 'hidden', p: 1.5, pt: 0 }}>
      <Box
        sx={{
          width: '100%',
          maxWidth: renderWidth,
          height: '100%',
          overflow: 'hidden',
          mx: 'auto',
        }}
      >
        <iframe
          ref={iframeRef}
          src={src}
          title="Page preview"
          style={{
            width: renderWidth,
            height: `${Math.round(100 / scale)}%`,
            border: 'none',
            backgroundColor: 'white',
            transformOrigin: 'top left',
            transform: `scale(${scale})`,
            display: 'block',
            borderRadius: 8,
          }}
        />
      </Box>
    </Box>
  );
}
