'use client';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  onContinueWithoutSaving: () => void;
};

export default function UnsavedChangesDialog({
  open,
  onClose,
  onSave,
  onContinueWithoutSaving,
}: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Unsaved changes</DialogTitle>
      <DialogContent>
        <DialogContentText>
          You have unsaved changes. Save them before leaving, or continue
          without saving?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={onContinueWithoutSaving} color="error">
          Continue without saving
        </Button>
        <Button onClick={onSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
