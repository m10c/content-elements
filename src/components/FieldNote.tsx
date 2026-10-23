import { Stack, Typography } from '@mui/material';
import React from 'react';

import type { SimpleField } from '../types';

/** Names a part of the page an admin cannot edit, e.g. a contact form. */
export default function FieldNote({
  fieldDef,
  label,
}: {
  fieldDef: SimpleField;
  label: string;
}) {
  return (
    <Stack spacing={0.5}>
      {fieldDef.label && <Typography variant="subtitle1">{label}</Typography>}
      <Typography variant="body2" color="text.secondary">
        {fieldDef.text}
      </Typography>
    </Stack>
  );
}
