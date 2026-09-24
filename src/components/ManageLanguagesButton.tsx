'use client';

import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { Button } from '@mui/material';

type Props = {
  onClick: () => void;
  label?: string;
};

export default function ManageLanguagesButton({
  onClick,
  label = 'Manage All Languages',
}: Props) {
  return (
    <Button
      variant="text"
      onClick={onClick}
      startIcon={<FormatListBulletedIcon />}
      sx={{ whiteSpace: 'nowrap', flexShrink: 0 }}
    >
      {label}
    </Button>
  );
}
