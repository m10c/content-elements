'use client';

import { FieldDateTime, FormWrap, SubmitButton } from '@m10c/mui-kit';
import TranslateIcon from '@mui/icons-material/Translate';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  SvgIcon,
  Typography,
} from '@mui/material';
import { addDays, formatISO, setHours, setMinutes } from 'date-fns';
import type React from 'react';
import { useForm } from 'react-typed-form';

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
      <DialogTitle>
        <Typography variant="subtitle1">Publish {entityLabel}</Typography>
        {dimensionLabel && (
          <Stack direction="row" gap={1} alignItems="center" sx={{ mt: 0.5 }}>
            <SvgIcon sx={{ fontSize: 20, color: 'text.secondary' }}>
              <TranslateIcon />
            </SvgIcon>
            <Typography variant="body2" color="text.secondary">
              in {dimensionLabel}
            </Typography>
          </Stack>
        )}
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
