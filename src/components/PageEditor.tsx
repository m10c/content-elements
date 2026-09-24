'use client';

import { Box, Button, Stack } from '@mui/material';
import React from 'react';
import { FieldProp } from 'react-typed-form';

import usePreviewSender from '../hooks/use-preview-sender';
import BlocksField, { type ListCardIcons } from './BlocksField';
import { PREVIEW_DEVICE_WIDTHS } from '../constants';
import PreviewDeviceSelect from './PreviewDeviceSelect';
import PreviewIframe from './PreviewIframe';
import PreviewPanel from './PreviewPanel';
import PreviewToggleButton from './PreviewToggleButton';
import type {
  Block,
  PreviewDevice,
  BlockFieldPreviews,
  BlockErrors,
  BlockFieldRenderers,
  BlockTypeInput,
} from '../types';

// Global pages (footer, navigation, …) have no route, so preview them on home.
const GLOBAL_PREVIEW_PATH = 'home';

type Props = {
  blockTypes: readonly BlockTypeInput[];
  field: FieldProp<Block[]>;
  renderers?: BlockFieldRenderers;
  previews?: BlockFieldPreviews;
  icons?: ListCardIcons;
  errors?: BlockErrors;
  /** Names for the preview's device sizes, e.g. 'Mobile website'. */
  deviceLabels?: Partial<Record<PreviewDevice, string>>;
  /** Site origin for the preview iframe and postMessage target. */
  previewUrl: string;
  pagePath: string;
  /** The site's route for the page, where it differs from the CMS path. */
  previewPath?: string;
  previewContent: Record<string, unknown>;
  /** CMS paths that are global pages (footer, navigation, …). */
  globalPagePaths?: readonly string[];
  isSaving?: boolean;
  /** Greys out publishing for an admin who may only view. */
  publishDisabled?: boolean;
  onPublish: () => void;
};

export default function PageEditor({
  blockTypes,
  field,
  renderers,
  previews,
  icons,
  errors,
  deviceLabels,
  previewUrl,
  pagePath,
  previewPath,
  previewContent,
  globalPagePaths = [],
  isSaving,
  publishDisabled,
  onPublish,
}: Props) {
  const [showPreview, setShowPreview] = React.useState(true);
  const [previewDevice, setPreviewDevice] =
    React.useState<PreviewDevice>('desktop');

  const isGlobal = globalPagePaths.includes(pagePath);
  const routePath = isGlobal ? GLOBAL_PREVIEW_PATH : (previewPath ?? pagePath);

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
            <Box sx={{ mb: 2 }}>
              <PreviewToggleButton
                isPreviewVisible={false}
                onClick={() => setShowPreview(true)}
              />
            </Box>
          )}
          <BlocksField
            blockTypes={blockTypes}
            field={field}
            renderers={renderers}
            previews={previews}
            icons={icons}
            errors={errors}
          />
        </Box>

        {showPreview && (
          <PreviewPanel
            onHide={() => setShowPreview(false)}
            toolbar={
              <PreviewDeviceSelect
                value={previewDevice}
                onChange={setPreviewDevice}
                labels={deviceLabels}
              />
            }
            sx={{ flex: 1, minWidth: 0, bgcolor: 'grey.200' }}
          >
            <PreviewIframe
              iframeRef={iframeRef}
              src={previewSrc}
              renderWidth={PREVIEW_DEVICE_WIDTHS[previewDevice]}
              title="Page preview"
            />
          </PreviewPanel>
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
        <Button
          variant="contained"
          onClick={onPublish}
          disabled={isSaving || publishDisabled}
        >
          Publish Changes
        </Button>
      </Stack>
    </Box>
  );
}
