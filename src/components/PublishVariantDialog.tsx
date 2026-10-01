'use client';

import { FieldDateTime, FormWrap, SubmitButton } from '@m10c/mui-kit';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { addDays, formatISO, setHours, setMinutes } from 'date-fns';
import type React from 'react';
import { useForm } from 'react-typed-form';

import DimensionSubtitle from './DimensionSubtitle';

type Props = {
  open: boolean;
  onClose: () => void;
  entityLabel: string;
  onPublish: (publishAt: string) => Promise<boolean>;
  dimensionLabel?: string;
  infoMessage?: string;
  notificationNote?: string;
  children?: React.ReactNode;
};

const tomorrowAtNoon = () =>
  formatISO(setMinutes(setHours(addDays(new Date(), 1), 12), 0));

export default function PublishVariantDialog({
  open,
  onClose,
  entityLabel,
  onPublish,
  dimensionLabel,
  infoMessage,
  notificationNote,
  children,
}: Props) {
  const form = useForm<{ publishAt: string | null }>({
    defaultValues: { publishAt: tomorrowAtNoon() },
    onSubmit: async (values) => {
      if (!values.publishAt) return false;
      const success = await onPublish(values.publishAt);
      if (success) onClose();
      return success;
    },
  });

  const publishNow = async () => {
    const success = await onPublish(formatISO(new Date()));
    if (success) onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle component="div">
        <Typography variant="subtitle1">Publish {entityLabel}</Typography>
        {dimensionLabel && <DimensionSubtitle label={dimensionLabel} />}
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Stack spacing={3}>
          {infoMessage && <Alert severity="info">{infoMessage}</Alert>}
          {children}
          <FormWrap {...form}>
            <FieldDateTime field={form.getField('publishAt')} />
          </FormWrap>
          {notificationNote && (
            <Typography variant="body2">{notificationNote}</Typography>
          )}
        </Stack>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ justifyContent: 'flex-start', px: 2, pb: 2 }}>
        <Stack direction="row" spacing={1}>
          <Button onClick={publishNow} variant="contained" color="success">
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
