'use client';

import TranslateIcon from '@mui/icons-material/Translate';
import { Stack, Typography } from '@mui/material';

type Props = {
  label: string;
};

export default function DimensionSubtitle({ label }: Props) {
  return (
    <Stack direction="row" gap={1} alignItems="center" sx={{ mt: 0.5 }}>
      <TranslateIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
      <Typography variant="body2" color="text.secondary">
        in {label}
      </Typography>
    </Stack>
  );
}
