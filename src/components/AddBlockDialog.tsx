'use client';

import CloseIcon from '@mui/icons-material/Close';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
} from '@mui/material';
import type React from 'react';

import type { BlockType, BlockTypeInput } from '../types';

type Props = {
  open: boolean;
  onClose: () => void;
  blockTypes: readonly BlockTypeInput[];
  onSelect: (blockType: BlockType) => void;
  icons?: Record<string, React.ReactNode>;
  title?: string;
};

export default function AddBlockDialog({
  open,
  onClose,
  blockTypes,
  onSelect,
  icons,
  title = 'Add block',
}: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          {title}
          <IconButton onClick={onClose} size="small" aria-label="Close">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ px: 1, pb: 2 }}>
        <List disablePadding>
          {blockTypes.map((blockType) => (
            <ListItemButton
              key={blockType.key}
              onClick={() => {
                onSelect(blockType as BlockType);
                onClose();
              }}
            >
              {icons?.[blockType.key] && (
                <ListItemIcon>{icons[blockType.key]}</ListItemIcon>
              )}
              <ListItemText primary={blockType.label} />
            </ListItemButton>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
}
