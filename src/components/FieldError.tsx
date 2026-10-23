import { Typography } from '@mui/material';
import React from 'react';

export default function FieldError({ error }: { error: string }) {
  return (
    <Typography variant="caption" color="error.main">
      {error}
    </Typography>
  );
}
