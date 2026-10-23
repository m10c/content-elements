import CloseIcon from '@mui/icons-material/Close';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import React from 'react';

import type { BlockFieldRenderers, ListField, ListItem } from '../types';
import SimpleFieldRenderer from './SimpleFieldRenderer';

type ListItemDialogProps = {
  title: string;
  fieldDef: ListField;
  item: ListItem;
  renderers?: BlockFieldRenderers;
  errors?: Record<string, string>;
  confirmLabel: string;
  onDelete?: () => void;
  onConfirm: (item: ListItem) => void;
  onClose: () => void;
};

export default function ListItemDialog({
  title,
  fieldDef,
  item,
  renderers,
  errors,
  confirmLabel,
  onDelete,
  onConfirm,
  onClose,
}: ListItemDialogProps) {
  const [draft, setDraft] = React.useState(item);

  return (
    <Dialog open fullWidth maxWidth="xs" onClose={onClose}>
      <DialogTitle sx={{ pr: 6 }}>
        {title}
        <IconButton
          size="small"
          onClick={onClose}
          aria-label="Close"
          sx={{ position: 'absolute', right: 12, top: 12 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {!!fieldDef.variables?.length && (
            <Stack
              spacing={1}
              sx={{ p: 2, borderRadius: 1, bgcolor: 'grey.100' }}
            >
              <Typography variant="subtitle2">Variables to use</Typography>
              <Stack
                direction="row"
                spacing={2}
                divider={<Divider flexItem orientation="vertical" />}
              >
                {fieldDef.variables.map((variable) => (
                  <Stack key={variable.token} spacing={0.5} sx={{ flex: 1 }}>
                    <Typography variant="body2">{variable.token}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {variable.description}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          )}
          {Object.entries(fieldDef.itemFields).map(([subKey, subFieldDef]) => (
            <SimpleFieldRenderer
              key={subKey}
              fieldKey={subKey}
              fieldDef={subFieldDef}
              value={draft[subKey]}
              renderers={renderers}
              error={errors?.[subKey]}
              onChange={(subValue) =>
                setDraft({ ...draft, [subKey]: subValue })
              }
            />
          ))}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        {onDelete ? (
          <>
            <Button variant="outlined" color="error" onClick={onDelete}>
              Delete
            </Button>
            <Button variant="contained" onClick={() => onConfirm(draft)}>
              {confirmLabel}
            </Button>
          </>
        ) : (
          <Button
            fullWidth
            variant="contained"
            onClick={() => onConfirm(draft)}
          >
            {confirmLabel}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
