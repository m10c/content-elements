import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import React from 'react';

import useSortableItem from '../hooks/use-sortable-item';
import type {
  BlockFieldPreviews,
  ListField,
  ListItem,
  SimpleField,
} from '../types';
import fieldLabel from '../utils/field-label';
import type { ListCardIcons } from './BlocksField';
import FieldError from './FieldError';
import FieldNote from './FieldNote';

type ListItemCardProps = {
  sortableId: string;
  fieldDef: ListField;
  item: ListItem;
  previews?: BlockFieldPreviews;
  icons?: ListCardIcons;
  errors?: Record<string, string>;
  onEdit: () => void;
};

export default function ListItemCard({
  sortableId,
  fieldDef,
  item,
  previews,
  icons,
  errors,
  onEdit,
}: ListItemCardProps) {
  const { itemProps, handleProps } = useSortableItem(sortableId);

  return (
    <Stack
      {...itemProps}
      direction="row"
      spacing={1}
      alignItems="flex-start"
      sx={{ p: 2, borderRadius: 1, bgcolor: 'grey.100' }}
    >
      <Box {...handleProps} sx={{ display: 'flex', color: 'primary.main' }}>
        {icons?.drag ?? <DragIndicatorIcon fontSize="small" />}
      </Box>
      <Stack spacing={1.5} sx={{ flex: 1, minWidth: 0 }}>
        {Object.entries(fieldDef.itemFields).map(([subKey, subFieldDef]) => {
          const label = fieldLabel(subFieldDef, subKey);
          if (subFieldDef.kind === 'note') {
            return (
              <FieldNote key={subKey} fieldDef={subFieldDef} label={label} />
            );
          }
          const value = typeof item[subKey] === 'string' ? item[subKey] : null;
          const preview = previews?.[subFieldDef.kind];
          return (
            <Stack key={subKey} spacing={0.5}>
              <Typography variant="body2" color="text.secondary">
                {label}
              </Typography>
              {preview ? (
                preview(value)
              ) : (
                <Typography variant="body1">
                  {fieldSummary(subFieldDef, item[subKey])}
                </Typography>
              )}
              {errors?.[subKey] && <FieldError error={errors[subKey]} />}
            </Stack>
          );
        })}
      </Stack>
      <IconButton
        size="small"
        onClick={onEdit}
        aria-label="Edit item"
        sx={{ color: 'primary.main' }}
      >
        {icons?.edit ?? <EditOutlinedIcon fontSize="small" />}
      </IconButton>
    </Stack>
  );
}

/** What a saved value reads as in a card's summary. */
function fieldSummary(fieldDef: SimpleField, value: unknown) {
  if (fieldDef.kind === 'boolean') return value === true ? 'Yes' : 'No';
  if (typeof value !== 'string') return null;
  return fieldDef.kind === 'richtext' || fieldDef.kind === 'markdown'
    ? plainText(value)
    : value;
}

/** A card summarises its item as text, so markup is shown as the words it holds. */
function plainText(html: string) {
  return html
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/(p|div|li|h[1-6])>/gi, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}
