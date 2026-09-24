'use client';

import { FieldDateTime, FormWrap, SubmitButton } from '@m10c/mui-kit';
import CloseIcon from '@mui/icons-material/Close';
import TranslateIcon from '@mui/icons-material/Translate';
import WarningIcon from '@mui/icons-material/WarningAmber';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  addDays,
  format,
  formatISO,
  isFuture,
  parseISO,
  setHours,
  setMinutes,
} from 'date-fns';
import React from 'react';
import { useForm } from 'react-typed-form';

import type { DimensionOption, VariantBase } from '../types';

type Props<V extends VariantBase> = {
  open: boolean;
  onClose: () => void;
  entityLabel: string;
  variants: readonly V[];
  getValue: (variant: V) => string;
  options: readonly DimensionOption[];
  onPublish: (ids: string[], publishAt: string) => Promise<boolean>;
  onUnpublish: (ids: string[]) => Promise<boolean>;
  onDelete: (ids: string[]) => Promise<boolean>;
  supportsPublish?: boolean;
  publishInfoMessage?: string;
  publishNotificationNote?: string;
};

export default function ManageVariantsDialog<V extends VariantBase>({
  open,
  onClose,
  entityLabel,
  variants,
  getValue,
  options,
  onPublish,
  onUnpublish,
  onDelete,
  supportsPublish = true,
  publishInfoMessage,
  publishNotificationNote,
}: Props<V>) {
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [activeDialog, setActiveDialog] = React.useState<
    'publish' | 'unpublish' | 'delete' | null
  >(null);

  React.useEffect(() => {
    if (!open) setSelectedIds(new Set());
  }, [open]);

  const valueLabel = (value: string) =>
    options.find((option) => option.value === value)?.label ?? value;
  const shortValueLabel = (value: string) => {
    const parts = valueLabel(value).split(', ');
    return parts[1] ?? parts[0] ?? value;
  };

  const selectedVariants = variants.filter((v) => selectedIds.has(v.id));
  const hasSelection = selectedVariants.length > 0;
  const allAreDraft =
    hasSelection && selectedVariants.every((v) => v.publishAt == null);
  const allArePublished =
    hasSelection && selectedVariants.every((v) => v.publishAt != null);
  const isMixedSelection = hasSelection && !allAreDraft && !allArePublished;
  const selectedLocales = selectedVariants
    .map((v) => shortValueLabel(getValue(v)))
    .join(', ');

  const isAllSelected =
    variants.length > 0 && selectedIds.size === variants.length;
  const isIndeterminate =
    selectedIds.size > 0 && selectedIds.size < variants.length;
  const hasSubDialogOpen = activeDialog !== null;

  const selectAll = (checked: boolean) =>
    setSelectedIds(checked ? new Set(variants.map((v) => v.id)) : new Set());
  const selectOne = (id: string, checked: boolean) => {
    const next = new Set(selectedIds);
    if (checked) next.add(id);
    else next.delete(id);
    setSelectedIds(next);
  };

  const runBulk = async (action: (ids: string[]) => Promise<boolean>) => {
    const success = await action(Array.from(selectedIds));
    if (!success) return;
    setActiveDialog(null);
    setSelectedIds(new Set());
    onClose();
  };

  const bulkPublish = (publishAt: string) =>
    runBulk((ids) => onPublish(ids, publishAt));
  const bulkUnpublish = () => runBulk(onUnpublish);
  const bulkDelete = () => runBulk(onDelete);

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
            <Typography variant="h5">Manage All Languages</Typography>
            <IconButton onClick={onClose} size="small">
              <SvgIcon>
                <CloseIcon />
              </SvgIcon>
            </IconButton>
          </Stack>

          <Box sx={{ p: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox" sx={{ width: 48 }}>
                    <Checkbox
                      checked={isAllSelected}
                      indeterminate={isIndeterminate}
                      onChange={(e) => selectAll(e.target.checked)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="overline">LANGUAGE</Typography>
                  </TableCell>
                  {supportsPublish && (
                    <TableCell>
                      <Typography variant="overline">PUBLISH AT</Typography>
                    </TableCell>
                  )}
                  <TableCell>
                    <Typography variant="overline">LAST UPDATED AT</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {variants.map((variant) => {
                  const isSelected = selectedIds.has(variant.id);
                  return (
                    <TableRow
                      key={variant.id}
                      selected={isSelected}
                      sx={{
                        bgcolor: isSelected ? 'action.selected' : 'transparent',
                      }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected}
                          onChange={(e) =>
                            selectOne(variant.id, e.target.checked)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {valueLabel(getValue(variant))}
                        </Typography>
                      </TableCell>
                      {supportsPublish && (
                        <TableCell>
                          <PublishBadge publishAt={variant.publishAt ?? null} />
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
              sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}
            >
              <Typography variant="body2" color="text.secondary">
                {selectedIds.size} language{selectedIds.size !== 1 ? 's' : ''}{' '}
                selected
              </Typography>

              {hasSelection && (
                <Stack direction="row" spacing={1}>
                  {supportsPublish && (
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

      <BulkPublishDialog
        open={activeDialog === 'publish'}
        onClose={() => setActiveDialog(null)}
        entityLabel={entityLabel}
        selectedLocales={selectedLocales}
        onPublish={bulkPublish}
        infoMessage={publishInfoMessage}
        notificationNote={publishNotificationNote}
      />

      <ConfirmBulkDialog
        open={activeDialog === 'unpublish'}
        onClose={() => setActiveDialog(null)}
        title={`Unpublish ${entityLabel}`}
        selectedLocales={selectedLocales}
        confirmLabel="Unpublish"
        confirmColor="warning"
        description="Are you sure you want to unpublish this content? If it's already gone live, users will no longer be able to access it within the app."
        onConfirm={bulkUnpublish}
      />

      <ConfirmBulkDialog
        open={activeDialog === 'delete'}
        onClose={() => setActiveDialog(null)}
        title={`Delete ${entityLabel}`}
        selectedLocales={selectedLocales}
        confirmLabel="Delete"
        confirmColor="error"
        description="Are you sure you want to delete this content?"
        warning={
          selectedIds.size === variants.length
            ? `As you are deleting all languages, this will delete the entire ${entityLabel}`
            : undefined
        }
        onConfirm={bulkDelete}
      />
    </Dialog>
  );
}

function PublishBadge({ publishAt }: { publishAt: string | null }) {
  if (!publishAt) return <Chip size="small" label="Draft" color="warning" />;
  const date = parseISO(publishAt);
  return (
    <Chip
      size="small"
      label={format(date, 'dd MMM yyyy')}
      color={isFuture(date) ? 'info' : 'success'}
    />
  );
}

function LocaleSubtitle({ selectedLocales }: { selectedLocales: string }) {
  return (
    <Stack direction="row" gap={1} alignItems="center" sx={{ mt: 0.5 }}>
      <SvgIcon sx={{ fontSize: 20, color: 'text.secondary' }}>
        <TranslateIcon />
      </SvgIcon>
      <Typography variant="body2" color="text.secondary">
        in {selectedLocales}
      </Typography>
    </Stack>
  );
}

type BulkPublishProps = {
  open: boolean;
  onClose: () => void;
  entityLabel: string;
  selectedLocales: string;
  onPublish: (publishAt: string) => Promise<void>;
  infoMessage?: string;
  notificationNote?: string;
};

function BulkPublishDialog({
  open,
  onClose,
  entityLabel,
  selectedLocales,
  onPublish,
  infoMessage,
  notificationNote,
}: BulkPublishProps) {
  const form = useForm<{ publishAt: string | null }>({
    defaultValues: {
      publishAt: formatISO(setMinutes(setHours(addDays(new Date(), 1), 12), 0)),
    },
    onSubmit: async (values) => {
      if (!values.publishAt) return false;
      await onPublish(values.publishAt);
      return true;
    },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="subtitle1">Publish {entityLabel}</Typography>
        <LocaleSubtitle selectedLocales={selectedLocales} />
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {infoMessage && <Alert severity="info">{infoMessage}</Alert>}
          <FormWrap {...form}>
            <FieldDateTime field={form.getField('publishAt')} label="Publish At" />
          </FormWrap>
          {notificationNote && (
            <Typography variant="body2">{notificationNote}</Typography>
          )}
        </Stack>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ justifyContent: 'flex-start', px: 2, py: 2 }}>
        <Stack direction="row" spacing={1}>
          <Button
            onClick={() => onPublish(formatISO(new Date()))}
            variant="contained"
            color="success"
          >
            Publish now
          </Button>
          <FormWrap {...form}>
            <SubmitButton {...form} label="Schedule publish" />
          </FormWrap>
          <Button variant="outlined" color="inherit" onClick={onClose}>
            Cancel
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

type ConfirmBulkProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  selectedLocales: string;
  description: string;
  confirmLabel: string;
  confirmColor: 'warning' | 'error';
  warning?: string;
  onConfirm: () => Promise<void>;
};

function ConfirmBulkDialog({
  open,
  onClose,
  title,
  selectedLocales,
  description,
  confirmLabel,
  confirmColor,
  warning,
  onConfirm,
}: ConfirmBulkProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6">{title}</Typography>
        <LocaleSubtitle selectedLocales={selectedLocales} />
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Stack spacing={1}>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
          {warning && (
            <Typography
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
              variant="body2"
              color="warning.main"
            >
              <SvgIcon sx={{ fontSize: 16 }}>
                <WarningIcon />
              </SvgIcon>
              {warning}
            </Typography>
          )}
        </Stack>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ justifyContent: 'flex-start', px: 2, py: 2 }}>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" color={confirmColor} onClick={onConfirm}>
            {confirmLabel}
          </Button>
          <Button variant="outlined" color="inherit" onClick={onClose}>
            Cancel
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
