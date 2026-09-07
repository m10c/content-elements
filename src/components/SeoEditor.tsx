'use client';

import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import { FieldText } from '@m10c/mui-kit';
import type React from 'react';
import type { FieldProp } from 'react-typed-form';

import type { BlockFieldRenderers } from '../types';

type Props = {
  pageTitleField: FieldProp<string | null>;
  descriptionField: FieldProp<string | null>;
  /** Draws the text fields, for an app whose inputs look nothing like these. */
  renderers?: BlockFieldRenderers;
  imageField?: FieldProp<string | null>;
  renderImageField?: (field: FieldProp<string | null>) => React.ReactNode;
  imagePreviewUrl?: string;
  /** The image the site shares when a page names none of its own. */
  fallbackImageUrl?: string;
  /** The site's favicon, shown next to the URL in the search preview (search
   * engines use the favicon here, not the social/OG image). */
  faviconUrl?: string;
  fallbackTitle: string;
  siteName?: string;
  isSaving?: boolean;
  onPublish: () => void;
};

function CharacterCount({
  value,
  min,
  max,
}: {
  value: string | null;
  min: number;
  max: number;
}) {
  const count = value?.length ?? 0;
  const isGood = count >= min && count <= max;
  const isTooLong = count > max;

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Chip
        size="small"
        label={isTooLong ? 'Too long' : isGood ? 'Good' : 'Too short'}
        color={isTooLong ? 'error' : isGood ? 'success' : 'warning'}
      />
      <Typography variant="caption" color="text.secondary">
        Character count: {count} ({min}-{max} recommended)
      </Typography>
    </Stack>
  );
}

export default function SeoEditor({
  pageTitleField,
  descriptionField,
  renderers,
  imageField,
  renderImageField,
  imagePreviewUrl,
  fallbackImageUrl,
  faviconUrl,
  fallbackTitle,
  siteName = '',
  isSaving,
  onPublish,
}: Props) {
  const pageTitle = pageTitleField.value ?? '';
  const description = descriptionField.value ?? '';
  const socialImageUrl = imagePreviewUrl ?? fallbackImageUrl;

  return (
    <Box
      sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}
    >
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 4,
          pb: 10,
          bgcolor: 'background.level1',
        }}
      >
        <Stack direction="row" sx={{ gap: '56px', justifyContent: 'center' }}>
          <Stack sx={{ width: 571 }} spacing={3}>
            <Stack spacing={1}>
              {renderers?.text ? (
                renderers.text({
                  name: 'pageTitle',
                  label: 'Page Title',
                  value: pageTitleField.value ?? null,
                  onChange: pageTitleField.handleValueChange,
                })
              ) : (
                <>
                  <Typography variant="subtitle2">Page Title</Typography>
                  <FieldText
                    field={pageTitleField}
                    hiddenLabel
                    size="small"
                    fullWidth
                  />
                </>
              )}
              <CharacterCount value={pageTitle} min={45} max={60} />
            </Stack>
            <Stack spacing={1}>
              {renderers?.textarea ? (
                renderers.textarea({
                  name: 'description',
                  label: 'Description',
                  value: descriptionField.value ?? null,
                  onChange: descriptionField.handleValueChange,
                })
              ) : (
                <>
                  <Typography variant="subtitle2">Description</Typography>
                  <FieldText
                    field={descriptionField}
                    hiddenLabel
                    size="small"
                    fullWidth
                    multiline
                    rows={4}
                  />
                </>
              )}
              <CharacterCount value={description} min={100} max={150} />
            </Stack>
            {imageField && renderImageField && renderImageField(imageField)}
          </Stack>

          <Stack sx={{ width: 555 }} spacing={3}>
            <Stack spacing={1}>
              <Typography variant="subtitle2">Search Preview</Typography>
              <Box
                sx={{
                  bgcolor: 'white',
                  borderRadius: '20px',
                  p: 2,
                  boxShadow:
                    '0px 0px 0px 1px rgba(0,0,0,0.06), 0px 5px 22px 0px rgba(0,0,0,0.04)',
                }}
              >
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box
                      sx={{
                        width: 20,
                        height: 22,
                        borderRadius: '4px',
                        bgcolor: 'grey.300',
                        flexShrink: 0,
                        backgroundImage: faviconUrl
                          ? `url(${faviconUrl})`
                          : undefined,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                      }}
                    />
                    <Stack>
                      <Typography
                        sx={{
                          fontFamily: 'Arial, sans-serif',
                          fontSize: 15,
                          color: '#333',
                          lineHeight: 1.2,
                        }}
                      >
                        {fallbackTitle}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: 'Arial, sans-serif',
                          fontSize: 12,
                          color: '#828282',
                          lineHeight: 1.2,
                        }}
                      >
                        {siteName}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Typography
                    sx={{
                      fontFamily: 'Arial, sans-serif',
                      fontSize: 22,
                      color: '#1718A4',
                      lineHeight: '22px',
                    }}
                  >
                    {pageTitle || fallbackTitle}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: 'Arial, sans-serif',
                      fontSize: 14,
                      color: '#333',
                      lineHeight: '22px',
                    }}
                  >
                    {description || 'No description set'}
                  </Typography>
                </Stack>
              </Box>
            </Stack>
            <Stack spacing={1}>
              <Typography variant="subtitle2">Social Media Preview</Typography>
              <Box
                sx={{
                  bgcolor: 'white',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow:
                    '0px 0px 0px 1px rgba(0,0,0,0.06), 0px 5px 22px 0px rgba(0,0,0,0.04)',
                }}
              >
                <Box
                  sx={{
                    height: 260,
                    bgcolor: 'grey.300',
                    backgroundImage: socialImageUrl
                      ? `url(${socialImageUrl})`
                      : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <Stack
                  sx={{ bgcolor: 'grey.100', px: 2, py: 1.5 }}
                  spacing={0.5}
                >
                  <Typography
                    sx={{
                      fontSize: 12,
                      color: '#65676B',
                      textTransform: 'uppercase',
                      lineHeight: '15px',
                    }}
                  >
                    {siteName}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 16,
                      fontWeight: 510,
                      color: '#0F1419',
                      lineHeight: '19px',
                    }}
                  >
                    {pageTitle || fallbackTitle}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 14,
                      color: '#65676B',
                      lineHeight: '19px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {description || 'No description set'}
                  </Typography>
                </Stack>
              </Box>
            </Stack>
          </Stack>
        </Stack>
      </Box>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        sx={{
          px: 3,
          py: 2,
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
