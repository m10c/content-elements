'use client';

import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Dialog,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { format, parseISO } from 'date-fns';
import React from 'react';

import type { Dimension, VariantBase } from '../types';
import dimensionValue from '../utils/dimension-value';
import publishStatusChip from '../utils/publish-status-chip';
import ConfirmDialog from './ConfirmDialog';
import DimensionSubtitle from './DimensionSubtitle';
import PublishVariantDialog from './PublishVariantDialog';

type Props<V extends VariantBase> = {
  open: boolean;
  onClose: () => void;
  entityLabel: string;
  dimension: Dimension;
  variants: readonly V[];
  onPublish: (iris: string[], publishAt: string) => Promise<boolean>;
  onUnpublish: (iris: string[]) => Promise<boolean>;
  onDelete: (iris: string[]) => Promise<boolean>;
  publishable?: boolean;
  publishInfoMessage?: string;
  publishNotificationNote?: string;
};

export default function ManageVariantsDialog<V extends VariantBase>({
  open,
  onClose,
  entityLabel,
  dimension,
  variants,
  onPublish,
  onUnpublish,
  onDelete,
  publishable = true,
  publishInfoMessage,
  publishNotificationNote,
}: Props<V>) {
  const [selectedIris, setSelectedIris] = React.useState<Set<string>>(
    new Set(),
  );
  const [activeDialog, setActiveDialog] = React.useState<
    'publish' | 'unpublish' | 'delete' | null
  >(null);

  React.useEffect(() => {
    if (!open) setSelectedIris(new Set());
  }, [open]);

  const variantLabel = (variant: V) => {
    const value = dimensionValue(variant, dimension.key);
    return (
      dimension.options.find((option) => option.value === value)?.label ??
      value
    );
  };

  const selectedVariants = variants.filter((variant) =>
    selectedIris.has(variant['@id']),
  );
  const selectedCount = selectedVariants.length;
  const hasSelection = selectedCount > 0;
  const allAreDraft =
    hasSelection &&
    selectedVariants.every((variant) => variant.publishAt == null);
  const allArePublished =
    hasSelection &&
    selectedVariants.every((variant) => variant.publishAt != null);
  const isMixedSelection = hasSelection && !allAreDraft && !allArePublished;
  const isAllSelected =
    variants.length > 0 && selectedCount === variants.length;
  const selectedLabels = selectedVariants.map(variantLabel).join(', ');
  const countLabel = (
    selectedCount === 1 ? dimension.label : dimension.pluralLabel
  ).toLowerCase();
  const hasSubDialogOpen = activeDialog !== null;

  const selectAll = (checked: boolean) =>
    setSelectedIris(
      checked ? new Set(variants.map((variant) => variant['@id'])) : new Set(),
    );
  const selectOne = (iri: string, checked: boolean) => {
    const next = new Set(selectedIris);
    if (checked) next.add(iri);
    else next.delete(iri);
    setSelectedIris(next);
  };

  const runBulk = async (action: (iris: string[]) => Promise<boolean>) => {
    const success = await action(
      selectedVariants.map((variant) => variant['@id']),
    );
    if (!success) return false;
    setActiveDialog(null);
    setSelectedIris(new Set());
    onClose();
    return true;
  };

  const closeSubDialog = () => setActiveDialog(null);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      hideBackdrop={hasSubDialogOpen}
      PaperProps={{ sx: { opacity: hasSubDialogOpen ? 0 : 1 } }}
    >
      <Card>
        <CardContent sx={{ p: 2 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ p: 2 }}
          >
            <Typography variant="h5">
              Manage All {dimension.pluralLabel}
            </Typography>
            <IconButton onClick={onClose} size="small" aria-label="Close">
              <CloseIcon />
            </IconButton>
          </Stack>

          <Box sx={{ p: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox" sx={{ width: 48 }}>
                    <Checkbox
                      checked={isAllSelected}
                      indeterminate={hasSelection && !isAllSelected}
                      onChange={(event) => selectAll(event.target.checked)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="overline">{dimension.label}</Typography>
                  </TableCell>
                  {publishable && (
                    <TableCell>
                      <Typography variant="overline">Publish at</Typography>
                    </TableCell>
                  )}
                  <TableCell>
                    <Typography variant="overline">Last updated at</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {variants.map((variant) => {
                  const isSelected = selectedIris.has(variant['@id']);
                  const statusChip = publishStatusChip(variant.publishAt);
                  return (
                    <TableRow key={variant['@id']} selected={isSelected}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected}
                          onChange={(event) =>
                            selectOne(variant['@id'], event.target.checked)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {variantLabel(variant)}
                        </Typography>
                      </TableCell>
                      {publishable && (
                        <TableCell>
                          <Chip
                            size="small"
                            label={statusChip.label}
                            color={statusChip.color}
                          />
                        </TableCell>
                      )}
                      <TableCell>
                        <Typography variant="body2">
                          {variant.updatedAt
                            ? format(
                                parseISO(variant.updatedAt),
                                'dd MMM yyyy, HH:mm',
                              )
                            : '-'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                mt: 2,
                pt: 2,
                borderTop: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="body2" color="text.secondary">
                {selectedCount} {countLabel} selected
              </Typography>

              {hasSelection && (
                <Stack direction="row" spacing={1}>
                  {publishable && (
                    <>
                      <Tooltip
                        title={
                          isMixedSelection
                            ? 'To publish, please only select draft content'
                            : ''
                        }
                      >
                        <span>
                          <Button
                            variant="outlined"
                            onClick={() => setActiveDialog('publish')}
                            disabled={!allAreDraft}
                          >
                            Publish...
                          </Button>
                        </span>
                      </Tooltip>
                      <Tooltip
                        title={
                          isMixedSelection
                            ? 'To unpublish, please only select published content'
                            : ''
                        }
                      >
                        <span>
                          <Button
                            variant="outlined"
                            onClick={() => setActiveDialog('unpublish')}
                            disabled={!allArePublished}
                          >
                            Unpublish
                          </Button>
                        </span>
                      </Tooltip>
                    </>
                  )}
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => setActiveDialog('delete')}
                  >
                    Delete
                  </Button>
                </Stack>
              )}
            </Stack>
          </Box>
        </CardContent>
      </Card>

      {publishable && (
        <PublishVariantDialog
          open={activeDialog === 'publish'}
          onClose={closeSubDialog}
          entityLabel={entityLabel}
          dimensionLabel={selectedLabels}
          onPublish={(publishAt) =>
            runBulk((iris) => onPublish(iris, publishAt))
          }
          infoMessage={publishInfoMessage}
          notificationNote={publishNotificationNote}
        />
      )}

      <ConfirmDialog
        open={activeDialog === 'unpublish'}
        title={`Unpublish ${entityLabel}`}
        subtitle={<DimensionSubtitle label={selectedLabels} />}
        description="Are you sure you want to unpublish this content? If it's already gone live, users will no longer be able to access it within the app."
        confirmText="Unpublish"
        confirmColor="warning"
        onClose={closeSubDialog}
        onConfirm={() => runBulk(onUnpublish)}
      />

      <ConfirmDialog
        open={activeDialog === 'delete'}
        title={`Delete ${entityLabel}`}
        subtitle={<DimensionSubtitle label={selectedLabels} />}
        description="Are you sure you want to delete this content?"
        warning={
          isAllSelected
            ? `As you are deleting all ${dimension.pluralLabel.toLowerCase()}, this will delete the entire ${entityLabel}`
            : undefined
        }
        confirmText="Delete"
        onClose={closeSubDialog}
        onConfirm={() => runBulk(onDelete)}
      />
    </Dialog>
  );
}
