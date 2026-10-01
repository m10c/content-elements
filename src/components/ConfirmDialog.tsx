'use client';

import WarningIcon from '@mui/icons-material/WarningAmber';
import {
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
import type React from 'react';

type Props = {
  open: boolean;
  title: string;
  description: React.ReactNode;
  subtitle?: React.ReactNode;
  warning?: React.ReactNode;
  confirmText?: string;
  confirmColor?: 'error' | 'primary' | 'warning' | 'success';
  onClose: () => void;
  onConfirm: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  description,
  subtitle,
  warning,
  confirmText = 'Confirm',
  confirmColor = 'error',
  onClose,
  onConfirm,
}: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle component="div">
        <Typography variant="h6">{title}</Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" component="div">
            {subtitle}
          </Typography>
        )}
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Stack spacing={1}>
          <Typography variant="body2" color="text.secondary" component="div">
            {description}
          </Typography>
          {warning && (
            <Typography
              variant="body2"
              color="warning.main"
              component="div"
              sx={{ display: 'flex', gap: 0.5 }}
            >
              <SvgIcon sx={{ fontSize: 18, mt: 0.25 }}>
                <WarningIcon />
              </SvgIcon>
              {warning}
            </Typography>
          )}
        </Stack>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ justifyContent: 'flex-start', p: 2 }}>
        <Button onClick={onConfirm} variant="contained" color={confirmColor}>
          {confirmText}
        </Button>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
